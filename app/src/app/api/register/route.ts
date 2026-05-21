import bcrypt from "bcryptjs";
import { randomInt } from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppCode } from "@/lib/whatsapp";
import { normalizePhone, isValidEmail, isValidPassword } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { jsonError, jsonOk, sameOriginGuard } from "@/lib/api";

export async function POST(request: Request) {
  const blocked = sameOriginGuard(request);
  if (blocked) return blocked;

  const ip = clientIp(request);
  if (!rateLimit(`register:ip:${ip}`, 10, 60 * 60 * 1000).allowed) {
    return jsonError("Trop de tentatives. Réessayez dans quelques minutes.", 429);
  }

  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const phoneNumber = normalizePhone(String(body.phoneNumber ?? ""));

    if (!isValidEmail(email)) {
      return jsonError("Adresse email invalide.", 400);
    }
    if (!isValidPassword(password)) {
      return jsonError(
        "Le mot de passe doit faire entre 8 et 72 caractères et contenir une lettre et un chiffre.",
        400,
      );
    }
    if (!phoneNumber) {
      return jsonError(
        "Numéro de téléphone invalide. Format attendu : 0612345678.",
        400,
      );
    }

    if (!rateLimit(`register:phone:${phoneNumber}`, 3, 60 * 60 * 1000).allowed) {
      return jsonError("Trop de demandes pour ce numéro. Réessayez plus tard.", 429);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const code = String(randomInt(100000, 1000000));
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    try {
      await prisma.user.create({
        data: {
          email,
          phoneNumber,
          passwordHash,
          balance: 0,
          isVerified: false,
          verificationCode: code,
          verificationExpiry: expiry,
          verificationAttempts: 0,
        },
      });
    } catch (err) {
      // P2002 = violation d'unicite (email ou phoneNumber deja pris).
      // Un seul aller-retour DB et atomique, contre la race findFirst+create.
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {
        return jsonError("Un compte existe déjà avec cet email ou ce numéro.", 409);
      }
      throw err;
    }

    let whatsappSent = true;
    try {
      await sendWhatsAppCode(phoneNumber, code);
    } catch (err) {
      whatsappSent = false;
      console.error("[register] envoi WhatsApp échoué :", err);
    }

    return jsonOk({ phoneNumber, whatsappSent });
  } catch (err) {
    console.error("[register] erreur inattendue :", err);
    return jsonError("Une erreur est survenue. Réessayez plus tard.", 500);
  }
}
