// Helpers de validation pour les transactions (F4).

export type TransactionInput = {
  listingId: string;
};

export function parseTransactionInput(
  body: unknown,
):
  | { ok: true; data: TransactionInput }
  | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Requête invalide." };
  }
  const { listingId } = body as Record<string, unknown>;

  if (typeof listingId !== "string" || listingId.trim().length === 0) {
    return { ok: false, error: "Annonce manquante." };
  }
  return { ok: true, data: { listingId: listingId.trim() } };
}

export const TRANSACTION_STATUS = {
  OUVERTE: "OUVERTE",
  FINALISEE: "FINALISEE",
  ANNULEE: "ANNULEE",
} as const;

export type TransactionStatus =
  (typeof TRANSACTION_STATUS)[keyof typeof TRANSACTION_STATUS];
