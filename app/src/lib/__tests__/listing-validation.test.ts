import { parseListingInput } from "@/lib/listing-validation";

const valide = {
  title: "Cours de guitare",
  description: "Je propose des cours pour débutants, tous niveaux bienvenus.",
  duration: 2,
  category: "Musique",
  postalCode: "75011",
};

describe("parseListingInput", () => {
  it("accepte une annonce complète et valide", () => {
    const result = parseListingInput(valide);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.title).toBe("Cours de guitare");
      expect(result.data.duration).toBe(2);
    }
  });

  it("retire les espaces autour des champs texte", () => {
    const result = parseListingInput({ ...valide, title: "  Cours de guitare  " });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.title).toBe("Cours de guitare");
    }
  });

  it("rejette un titre trop court ou trop long", () => {
    expect(parseListingInput({ ...valide, title: "ab" }).ok).toBe(false);
    expect(parseListingInput({ ...valide, title: "x".repeat(121) }).ok).toBe(false);
  });

  it("rejette une description trop courte", () => {
    expect(parseListingInput({ ...valide, description: "court" }).ok).toBe(false);
  });

  it("rejette une durée invalide", () => {
    expect(parseListingInput({ ...valide, duration: 0 }).ok).toBe(false);
    expect(parseListingInput({ ...valide, duration: -1 }).ok).toBe(false);
    expect(parseListingInput({ ...valide, duration: 101 }).ok).toBe(false);
    expect(parseListingInput({ ...valide, duration: "abc" }).ok).toBe(false);
  });

  it("rejette une catégorie inconnue", () => {
    expect(parseListingInput({ ...valide, category: "Inexistante" }).ok).toBe(false);
  });

  it("rejette un code postal invalide", () => {
    expect(parseListingInput({ ...valide, postalCode: "750" }).ok).toBe(false);
  });
});
