import {
  parseTransactionInput,
  TRANSACTION_STATUS,
} from "@/lib/transaction-validation";

describe("parseTransactionInput", () => {
  it("accepte un corps avec un listingId valide", () => {
    const result = parseTransactionInput({ listingId: "cuid123" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.listingId).toBe("cuid123");
    }
  });

  it("retire les espaces autour du listingId", () => {
    const result = parseTransactionInput({ listingId: "  cuid123  " });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.listingId).toBe("cuid123");
    }
  });

  it("rejette un corps sans listingId", () => {
    expect(parseTransactionInput({}).ok).toBe(false);
  });

  it("rejette un listingId vide", () => {
    expect(parseTransactionInput({ listingId: "" }).ok).toBe(false);
    expect(parseTransactionInput({ listingId: "   " }).ok).toBe(false);
  });

  it("rejette un listingId qui n'est pas une chaîne", () => {
    expect(parseTransactionInput({ listingId: 123 }).ok).toBe(false);
  });

  it("rejette un corps qui n'est pas un objet", () => {
    expect(parseTransactionInput(null).ok).toBe(false);
    expect(parseTransactionInput("texte").ok).toBe(false);
  });
});

describe("TRANSACTION_STATUS", () => {
  it("expose les trois statuts du cycle de vie d'une transaction", () => {
    expect(TRANSACTION_STATUS.OUVERTE).toBe("OUVERTE");
    expect(TRANSACTION_STATUS.FINALISEE).toBe("FINALISEE");
    expect(TRANSACTION_STATUS.ANNULEE).toBe("ANNULEE");
  });
});
