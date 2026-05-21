import { prisma } from "@/lib/prisma";
import { requireUser, jsonError, jsonOk, sameOriginGuard } from "@/lib/api";
import { TRANSACTION_STATUS } from "@/lib/transaction-validation";

type Params = { params: Promise<{ id: string }> };

// POST /api/transactions/[id]/refuse
// Refus d'une demande par le prestataire (US-012). La transaction passe a
// ANNULEE, plus de transfert d'heures possible ensuite.
//
// Seul le prestataire peut refuser. Le refus n'est possible qu'avant que la
// transaction soit finalisee (pas de retour en arriere sur un transfert deja
// effectue).
export async function POST(request: Request, { params }: Params) {
  const blocked = sameOriginGuard(request);
  if (blocked) return blocked;

  const { user, response } = await requireUser();
  if (response) return response;

  const { id } = await params;

  try {
    const transaction = await prisma.transaction.findUnique({ where: { id } });
    if (!transaction) {
      return jsonError("Transaction introuvable.", 404);
    }
    if (transaction.providerId !== user.id) {
      return jsonError(
        "Seul le prestataire peut refuser cette demande.",
        403,
      );
    }
    if (transaction.status === TRANSACTION_STATUS.FINALISEE) {
      return jsonError(
        "Cette transaction est déjà finalisée, impossible de la refuser.",
        400,
      );
    }
    if (transaction.status === TRANSACTION_STATUS.ANNULEE) {
      return jsonOk({ transaction });
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data: { status: TRANSACTION_STATUS.ANNULEE },
    });
    return jsonOk({ transaction: updated });
  } catch {
    return jsonError("Une erreur est survenue.", 500);
  }
}
