type Status = "OUVERTE" | "FINALISEE" | "ANNULEE";

const STYLES: Record<Status, { bg: string; text: string; label: string }> = {
  OUVERTE: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    label: "En cours",
  },
  FINALISEE: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    label: "Finalisée",
  },
  ANNULEE: {
    bg: "bg-gray-100",
    text: "text-gray-600",
    label: "Annulée",
  },
};

export function TransactionStatusBadge({ status }: { status: string }) {
  const style = STYLES[status as Status] ?? STYLES.OUVERTE;
  return (
    <span
      className={`inline-block ${style.bg} ${style.text} text-xs font-medium px-3 py-1 rounded-full`}
    >
      {style.label}
    </span>
  );
}
