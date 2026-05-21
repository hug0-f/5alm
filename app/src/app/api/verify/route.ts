import { prisma } from "@/lib/prisma";
import { normalizePhone } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { jsonError, jsonOk, sameOriginGuard } from "@/lib/api";

const MAX_ATTEMPTS = 5;
const GENERIC_ERROR = "Code incorrect ou expiré.";

export async function POST(request: Request) {
  const blocked = sameOriginGuard(request);
  if (blocked) return blocked;

  const ip = clientIp(request);
  if (!rateLimit(`verify:ip:${ip}`, 20, 60 * 60 * 1000).allowed) {
    return jsonError("Trop de tentatives. Réessayez dans quelques minutes.", 429);
  }

  try {
    const body = await request.json();
    const phoneNumber = normalizePhone(String(body.phoneNumber ?? ""));
    const code = String(body.code ?? "").trim();

    if (!phoneNumber || !code) {
      return jsonError("Numéro ou code manquant.", 400);
    }

    if (!rateLimit(`verify:phone:${phoneNumber}`, 6, 15 * 60 * 1000).allowed) {
      return jsonError("Trop de tentatives pour ce numéro. Réessayez plus tard.", 429);
    }

    const user = await prisma.user.findUnique({ where: { phoneNumber } });
    if (!user || user.isVerified) {
      return jsonError(GENERIC_ERROR, 400);
    }
    if (!user.verificationCode || !user.verificationExpiry) {
      return jsonError(GENERIC_ERROR, 400);
    }
    if (new Date() > user.verificationExpiry) {
      return jsonError(GENERIC_ERROR, 400);
    }
    if (user.verificationAttempts >= MAX_ATTEMPTS) {
      return jsonError(GENERIC_ERROR, 400);
    }

    if (code !== user.verificationCode) {
      // Increment uniquement en cas d'echec, conditionne sur les attempts
      // pour qu'une concurrence ne puisse pas depasser MAX_ATTEMPTS.
      await prisma.user.updateMany({
        where: { id: user.id, verificationAttempts: { lt: MAX_ATTEMPTS } },
        data: { verificationAttempts: { increment: 1 } },
      });
      return jsonError(GENERIC_ERROR, 400);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        balance: 1,
        verificationCode: null,
        verificationExpiry: null,
        verificationAttempts: 0,
      },
    });

    return jsonOk();
  } catch {
    return jsonError("Une erreur est survenue. Réessayez plus tard.", 500);
  }
}
