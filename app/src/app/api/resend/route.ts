import { randomInt } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppCode } from "@/lib/whatsapp";
import { normalizePhone } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { jsonError, jsonOk, sameOriginGuard } from "@/lib/api";

export async function POST(request: Request) {
  const blocked = sameOriginGuard(request);
  if (blocked) return blocked;

  const ip = clientIp(request);
  if (!rateLimit(`resend:ip:${ip}`, 5, 60 * 60 * 1000).allowed) {
    return jsonError("Trop de tentatives. Réessayez plus tard.", 429);
  }

  try {
    const body = await request.json();
    const phoneNumber = normalizePhone(String(body.phoneNumber ?? ""));

    if (!phoneNumber) {
      return jsonError("Numéro de téléphone invalide.", 400);
    }

    if (!rateLimit(`resend:phone:${phoneNumber}`, 3, 60 * 60 * 1000).allowed) {
      return jsonError("Trop de demandes pour ce numéro. Réessayez dans une heure.", 429);
    }

    const user = await prisma.user.findUnique({ where: { phoneNumber } });
    if (!user || user.isVerified) {
      return jsonOk();
    }

    const code = String(randomInt(100000, 1000000));
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationCode: code,
        verificationExpiry: expiry,
        verificationAttempts: 0,
      },
    });

    await sendWhatsAppCode(phoneNumber, code);
    return jsonOk();
  } catch {
    return jsonError("Une erreur est survenue. Réessayez plus tard.", 500);
  }
}
