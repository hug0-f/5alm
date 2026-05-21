"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  transactionId: string;
  canValidate: boolean;
  canRefuse: boolean;
}

// Boutons "Valider" et "Refuser" affiches sur la page detail d'une transaction.
// L'API derriere gere les regles : idempotence, double validation atomique,
// solde verifie au moment du transfert.
export function TransactionActions({
  transactionId,
  canValidate,
  canRefuse,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<"validate" | "refuse" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function call(action: "validate" | "refuse") {
    setLoading(action);
    setError(null);
    try {
      const response = await fetch(
        `/api/transactions/${transactionId}/${action}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
      );
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        setLoading(null);
        return;
      }
      router.refresh();
      setLoading(null);
    } catch {
      setError("Une erreur réseau est survenue.");
      setLoading(null);
    }
  }

  if (!canValidate && !canRefuse) return null;

  return (
    <div className="mt-6 flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        {canValidate && (
          <button
            type="button"
            onClick={() => call("validate")}
            disabled={loading !== null}
            className="bg-primary text-white rounded-[12px] px-5 py-2.5 text-sm font-medium hover:bg-primary-hover transition-colors font-[family-name:var(--font-poppins)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading === "validate"
              ? "Validation..."
              : "Valider l'échange"}
          </button>
        )}
        {canRefuse && (
          <button
            type="button"
            onClick={() => call("refuse")}
            disabled={loading !== null}
            className="border-2 border-error text-error rounded-[12px] px-5 py-2.5 text-sm font-medium hover:bg-red-50 transition-colors font-[family-name:var(--font-poppins)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading === "refuse" ? "Refus..." : "Refuser"}
          </button>
        )}
      </div>
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}
