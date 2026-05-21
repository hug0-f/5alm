import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, jsonError, jsonOk, sameOriginGuard } from "@/lib/api";
import {
  parseTransactionInput,
  TRANSACTION_STATUS,
} from "@/lib/transaction-validation";

// GET /api/transactions
// Liste les transactions de l'utilisateur connecte (cote beneficiaire ET prestataire).
export async function GET() {
  const { user, response } = await requireUser();
  if (response) return response;

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [{ beneficiaryId: user.id }, { providerId: user.id }],
      },
      include: {
        listing: { select: { id: true, title: true, category: true } },
        beneficiary: { select: { id: true, email: true } },
        provider: { select: { id: true, email: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ transactions });
  } catch {
    return jsonError("Une erreur est survenue.", 500);
  }
}

// POST /api/transactions
// Cree une transaction (le user connecte est le beneficiaire).
// Refuse l'auto-echange : on ne peut pas reserver sa propre annonce.
export async function POST(request: Request) {
  const blocked = sameOriginGuard(request);
  if (blocked) return blocked;

  const { user, response } = await requireUser();
  if (response) return response;
  if (!user.isVerified) {
    return jsonError(
      "Vous devez vérifier votre numéro avant de réserver.",
      403,
    );
  }

  try {
    const parsed = parseTransactionInput(await request.json());
    if (!parsed.ok) return jsonError(parsed.error, 400);

    const listing = await prisma.listing.findUnique({
      where: { id: parsed.data.listingId },
      select: {
        id: true,
        authorId: true,
        duration: true,
        status: true,
      },
    });

    if (!listing) {
      return jsonError("Annonce introuvable.", 404);
    }
    if (listing.status !== "ACTIVE") {
      return jsonError("Cette annonce n'est plus disponible.", 400);
    }
    // US-016 : interdiction de l'auto-echange.
    if (listing.authorId === user.id) {
      return jsonError(
        "Vous ne pouvez pas réserver votre propre annonce.",
        400,
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        listingId: listing.id,
        beneficiaryId: user.id,
        providerId: listing.authorId,
        duration: listing.duration,
        status: TRANSACTION_STATUS.OUVERTE,
      },
    });

    return jsonOk({ id: transaction.id });
  } catch {
    return jsonError("Une erreur est survenue.", 500);
  }
}
