import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser, jsonError, jsonOk, sameOriginGuard } from "@/lib/api";
import { TRANSACTION_STATUS } from "@/lib/transaction-validation";

type Params = { params: Promise<{ id: string }> };

type ValidateResult =
  | { ok: true; transaction: Prisma.TransactionGetPayload<object> }
  | { ok: false; error: string; status: number };

// POST /api/transactions/[id]/validate
// Valide la transaction du cote du user connecte (beneficiaire ou prestataire).
// Quand les deux ont valide, le transfert d'heures est execute dans une transaction
// SQL atomique : debit du beneficiaire, credit du prestataire, statut FINALISEE.
//
// Garanties :
// - Idempotent : si l'utilisateur a deja valide, l'appel renvoie l'etat courant
//   sans rejouer le transfert.
// - Atomique : le transfert d'heures et le changement de statut se font dans
//   un meme prisma.$transaction, donc on ne peut pas avoir un debit sans credit.
// - Verification du solde au moment du transfert, pas a la creation.
export async function POST(request: Request, { params }: Params) {
  const blocked = sameOriginGuard(request);
  if (blocked) return blocked;

  const { user, response } = await requireUser();
  if (response) return response;

  const { id } = await params;

  try {
    // Isolation SERIALIZABLE pour eviter le scenario de race condition suivant :
    // 1. User A lit la transaction (validations: 0/0)
    // 2. User B lit la transaction (validations: 0/0) -> donnees stales
    // 3. User A met sa validation a true
    // 4. User B met sa validation a true en croyant etre seul
    // Resultat : les deux booleens passent a true mais aucun transfert n'est fait.
    // Avec SERIALIZABLE, la seconde transaction echoue avec une erreur de
    // serialisation et le client peut retry.
    const result: ValidateResult = await prisma.$transaction(
      async (tx) => {
      const transaction = await tx.transaction.findUnique({
        where: { id },
      });

      if (!transaction) {
        return { ok: false, error: "Transaction introuvable.", status: 404 };
      }

      const isBeneficiary = transaction.beneficiaryId === user.id;
      const isProvider = transaction.providerId === user.id;
      if (!isBeneficiary && !isProvider) {
        return { ok: false, error: "Accès refusé.", status: 403 };
      }

      if (transaction.status === TRANSACTION_STATUS.ANNULEE) {
        return {
          ok: false,
          error: "Cette transaction a été annulée.",
          status: 400,
        };
      }
      if (transaction.status === TRANSACTION_STATUS.FINALISEE) {
        // Idempotence : on ne rejoue rien, on renvoie l'etat actuel.
        return { ok: true, transaction };
      }

      // Idempotence : si le user a deja valide, on ne fait rien.
      if (isBeneficiary && transaction.beneficiaryValidated) {
        return { ok: true, transaction };
      }
      if (isProvider && transaction.providerValidated) {
        return { ok: true, transaction };
      }

      const beneficiaryValidated = isBeneficiary
        ? true
        : transaction.beneficiaryValidated;
      const providerValidated = isProvider
        ? true
        : transaction.providerValidated;

      const bothValidated = beneficiaryValidated && providerValidated;

      if (!bothValidated) {
        // Une seule validation pour le moment, on met juste a jour le booleen.
        const updated = await tx.transaction.update({
          where: { id },
          data: {
            beneficiaryValidated,
            providerValidated,
          },
        });
        return { ok: true, transaction: updated };
      }

      // Les deux valident maintenant : on verifie le solde puis on transfere.
      const beneficiary = await tx.user.findUnique({
        where: { id: transaction.beneficiaryId },
        select: { balance: true },
      });
      if (!beneficiary) {
        return {
          ok: false,
          error: "Bénéficiaire introuvable.",
          status: 500,
        };
      }
      if (beneficiary.balance < transaction.duration) {
        return {
          ok: false,
          error: "Solde insuffisant pour finaliser cet échange.",
          status: 400,
        };
      }

      // Transfert atomique : debit du beneficiaire, credit du prestataire,
      // passage du statut a FINALISEE. Si une etape echoue, tout est annule.
      await tx.user.update({
        where: { id: transaction.beneficiaryId },
        data: { balance: { decrement: transaction.duration } },
      });
      await tx.user.update({
        where: { id: transaction.providerId },
        data: { balance: { increment: transaction.duration } },
      });
      const finalized = await tx.transaction.update({
        where: { id },
        data: {
          beneficiaryValidated: true,
          providerValidated: true,
          status: TRANSACTION_STATUS.FINALISEE,
        },
      });

      return { ok: true, transaction: finalized };
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    if (!result.ok) {
      return jsonError(result.error, result.status);
    }
    return jsonOk({ transaction: result.transaction });
  } catch (err) {
    // Avec SERIALIZABLE, deux validations concurrentes peuvent declencher une
    // erreur de serialisation. Le client peut retry, on renvoie 409 dans ce cas.
    const code = (err as { code?: string })?.code;
    if (code === "P2034" || code === "40001") {
      return jsonError(
        "Validation concurrente détectée, merci de réessayer.",
        409,
      );
    }
    return jsonError("Une erreur est survenue.", 500);
  }
}
