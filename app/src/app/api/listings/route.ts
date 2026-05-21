import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requireUser, jsonError, jsonOk, sameOriginGuard } from "@/lib/api";
import { parseListingInput } from "@/lib/listing-validation";
import { isValidCategory } from "@/lib/categories";
import { isValidPostalCode } from "@/lib/validation";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const postalCode = searchParams.get("postalCode");

    const session = await auth();
    const isAuth = Boolean(session?.user?.id);

    const listings = await prisma.listing.findMany({
      where: {
        status: "ACTIVE",
        ...(category && isValidCategory(category) ? { category } : {}),
        ...(postalCode && isValidPostalCode(postalCode) ? { postalCode } : {}),
      },
      orderBy: { createdAt: "desc" },
      // L'email auteur n'est revele qu'aux utilisateurs connectes.
      include: {
        author: { select: { id: true, email: isAuth } },
      },
    });

    return NextResponse.json({ listings });
  } catch {
    return jsonError("Une erreur est survenue.", 500);
  }
}

export async function POST(request: Request) {
  const blocked = sameOriginGuard(request);
  if (blocked) return blocked;

  const { user, response } = await requireUser();
  if (response) return response;
  if (!user.isVerified) {
    return jsonError(
      "Vous devez vérifier votre numéro avant de publier.",
      403,
    );
  }

  try {
    const parsed = parseListingInput(await request.json());
    if (!parsed.ok) return jsonError(parsed.error, 400);

    const listing = await prisma.listing.create({
      data: { ...parsed.data, authorId: user.id },
    });

    return jsonOk({ id: listing.id });
  } catch {
    return jsonError("Une erreur est survenue.", 500);
  }
}
