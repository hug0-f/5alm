import {
  normalizePhone,
  isValidEmail,
  isValidPostalCode,
  isValidPassword,
} from "@/lib/validation";

describe("normalizePhone", () => {
  it("convertit un numéro français 0X en format E.164", () => {
    expect(normalizePhone("0612345678")).toBe("+33612345678");
    expect(normalizePhone("0712345678")).toBe("+33712345678");
  });

  it("accepte un numéro déjà au format +33", () => {
    expect(normalizePhone("+33612345678")).toBe("+33612345678");
  });

  it("ignore les espaces, points et tirets", () => {
    expect(normalizePhone("06 12 34 56 78")).toBe("+33612345678");
    expect(normalizePhone("06.12.34.56.78")).toBe("+33612345678");
    expect(normalizePhone("06-12-34-56-78")).toBe("+33612345678");
  });

  it("rejette un numéro invalide", () => {
    expect(normalizePhone("123")).toBeNull();
    expect(normalizePhone("")).toBeNull();
    expect(normalizePhone("0012345678")).toBeNull();
    expect(normalizePhone("0012345678901")).toBeNull();
  });

  it("rejette un numéro commençant par 0 après l'indicatif", () => {
    expect(normalizePhone("0012345678")).toBeNull();
  });
});

describe("isValidEmail", () => {
  it("accepte une adresse bien formée", () => {
    expect(isValidEmail("utilisateur@exemple.fr")).toBe(true);
    expect(isValidEmail("a.b@domaine.com")).toBe(true);
  });

  it("rejette une adresse mal formée", () => {
    expect(isValidEmail("invalide")).toBe(false);
    expect(isValidEmail("a@b")).toBe(false);
    expect(isValidEmail("@domaine.fr")).toBe(false);
    expect(isValidEmail("a b@domaine.fr")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });
});

describe("isValidPostalCode", () => {
  it("accepte un code postal à 5 chiffres", () => {
    expect(isValidPostalCode("75001")).toBe(true);
    expect(isValidPostalCode("13001")).toBe(true);
  });

  it("ignore les espaces autour", () => {
    expect(isValidPostalCode(" 75001 ")).toBe(true);
  });

  it("rejette tout ce qui n'est pas exactement 5 chiffres", () => {
    expect(isValidPostalCode("1234")).toBe(false);
    expect(isValidPostalCode("123456")).toBe(false);
    expect(isValidPostalCode("7500a")).toBe(false);
    expect(isValidPostalCode("")).toBe(false);
  });
});

describe("isValidPassword", () => {
  it("accepte un mot de passe avec lettre, chiffre et 8+ caractères", () => {
    expect(isValidPassword("MotDePasse1")).toBe(true);
    expect(isValidPassword("abcdefg1")).toBe(true);
  });

  it("rejette un mot de passe trop court", () => {
    expect(isValidPassword("Abc123")).toBe(false);
  });

  it("rejette un mot de passe sans chiffre", () => {
    expect(isValidPassword("abcdefghij")).toBe(false);
  });

  it("rejette un mot de passe sans lettre", () => {
    expect(isValidPassword("12345678")).toBe(false);
  });

  it("rejette un mot de passe de plus de 72 caractères", () => {
    expect(isValidPassword("a1" + "x".repeat(71))).toBe(false);
  });
});
