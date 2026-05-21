import { isValidCategory } from "@/lib/categories";
import { isValidPostalCode } from "@/lib/validation";

export type ListingInput = {
  title: string;
  description: string;
  duration: number;
  category: string;
  postalCode: string;
};

export type ParseResult =
  | { ok: true; data: ListingInput }
  | { ok: false; error: string };

export function parseListingInput(body: Record<string, unknown>): ParseResult {
  const title = String(body.title ?? "").trim();
  const description = String(body.description ?? "").trim();
  const duration = Number(body.duration);
  const category = String(body.category ?? "").trim();
  const postalCode = String(body.postalCode ?? "").trim();

  if (title.length < 3 || title.length > 120) {
    return { ok: false, error: "Le titre doit faire entre 3 et 120 caractères." };
  }
  if (description.length < 10 || description.length > 2000) {
    return {
      ok: false,
      error: "La description doit faire entre 10 et 2000 caractères.",
    };
  }
  if (!Number.isFinite(duration) || duration <= 0 || duration > 100) {
    return {
      ok: false,
      error: "La durée doit être un nombre d'heures compris entre 0 et 100.",
    };
  }
  if (!isValidCategory(category)) {
    return { ok: false, error: "Catégorie invalide." };
  }
  if (!isValidPostalCode(postalCode)) {
    return { ok: false, error: "Code postal invalide (5 chiffres attendus)." };
  }

  return {
    ok: true,
    data: { title, description, duration, category, postalCode },
  };
}
