const WA_SERVICE_URL = process.env.WA_SERVICE_URL ?? "http://localhost:3001";

export async function sendWhatsAppCode(
  phoneNumber: string,
  code: string,
): Promise<void> {
  const message =
    `Votre code de vérification Lebontroc : *${code}*\n\n` +
    `Ce code est valable 10 minutes.`;

  const res = await fetch(`${WA_SERVICE_URL}/api/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phoneNumber, message }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? "Erreur service WhatsApp");
  }
}
