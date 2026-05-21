import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, jsonError, jsonOk, sameOriginGuard } from "@/lib/api";
import { parseListingInput } from "@/lib/listing-validation";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { author: { select: { id: true, email: true } } },
  });

  if (!listing) return jsonError("Annonce introuvable.", 404);
  return NextResponse.json({ listing });
}

export async function PATCH(request: Request, { params }: Params) {
  const blocked = sameOriginGuard(request);
  if (blocked) return blocked;

  const { id } = await params;
  const { user, response } = await requireUser();
  if (response) return response;

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) return jsonError("Annonce introuvable.", 404);
  if (listing.authorId !== user.id) {
    return jsonError("Vous ne pouvez modifier que vos propres annonces.", 403);
  }

  const parsed = parseListingInput(await request.json());
  if (!parsed.ok) return jsonError(parsed.error, 400);

  await prisma.listing.update({ where: { id }, data: parsed.data });
  return jsonOk();
}

export async function DELETE(request: Request, { params }: Params) {
  const blocked = sameOriginGuard(request);
  if (blocked) return blocked;

  const { id } = await params;
  const { user, response } = await requireUser();
  if (response) return response;

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) return jsonError("Annonce introuvable.", 404);
  if (listing.authorId !== user.id) {
    return jsonError("Vous ne pouvez supprimer que vos propres annonces.", 403);
  }

  await prisma.listing.delete({ where: { id } });
  return jsonOk();
}
