"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  listingId: string;
  duration: number;
  userBalance: number;
}

// Bouton "Réserver" affiche sur le detail d'une annonce. Reserve aux comptes
// verifies, et bloque l'auto-echange en amont cote serveur.
//
// Le solde affiche est indicatif : la verification reelle se fait au moment
// du transfert (cf. /api/transactions/[id]/validate).
export function ReserveButton({ listingId, duration, userBalance }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const balanceWarning = userBalance < duration;

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Impossible de créer la réservation.");
        setLoading(false);
        return;
      }
      router.push(`/transactions/${data.id}`);
    } catch {
      setError("Une erreur réseau est survenue.");
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      {balanceWarning && (
        <p className="text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-[8px] mb-3">
          Attention : votre solde actuel ({userBalance} h) est inférieur à la
          durée de cette annonce ({duration} h). Vous pourrez créer la
          réservation, mais vous devrez avoir assez d&apos;heures au moment de
          la valider pour finaliser l&apos;échange.
        </p>
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="bg-primary text-white rounded-[12px] px-5 py-2.5 text-sm font-medium hover:bg-primary-hover transition-colors font-[family-name:var(--font-poppins)] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Création..." : "Réserver ce service"}
      </button>
      {error && (
        <p className="text-sm text-error mt-2">{error}</p>
      )}
    </div>
  );
}
