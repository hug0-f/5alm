import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, jsonError } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

// GET /api/transactions/[id]
// Detail d'une transaction. L'utilisateur connecte doit etre l'un des deux participants.
export async function GET(_request: Request, { params }: Params) {
  const { user, response } = await requireUser();
  if (response) return response;

  const { id } = await params;

  const transaction = await prisma.transaction.findUnique({
    where: { id },
    include: {
      listing: {
        select: { id: true, title: true, category: true, postalCode: true },
      },
      beneficiary: { select: { id: true, email: true } },
      provider: { select: { id: true, email: true } },
    },
  });

  if (!transaction) {
    return jsonError("Transaction introuvable.", 404);
  }
  if (
    transaction.beneficiaryId !== user.id &&
    transaction.providerId !== user.id
  ) {
    return jsonError("Accès refusé.", 403);
  }

  return NextResponse.json({ transaction });
}
