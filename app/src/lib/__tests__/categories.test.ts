import { isValidCategory, CATEGORIES } from "@/lib/categories";

describe("isValidCategory", () => {
  it("accepte toutes les catégories de la liste officielle", () => {
    for (const categorie of CATEGORIES) {
      expect(isValidCategory(categorie)).toBe(true);
    }
  });

  it("rejette une catégorie inconnue", () => {
    expect(isValidCategory("Inexistante")).toBe(false);
    expect(isValidCategory("")).toBe(false);
  });

  it("est sensible à la casse", () => {
    expect(isValidCategory("bricolage")).toBe(false);
    expect(isValidCategory("Bricolage")).toBe(true);
  });
});
