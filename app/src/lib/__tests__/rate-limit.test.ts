import { rateLimit, clientIp } from "@/lib/rate-limit";

describe("rateLimit", () => {
  it("autorise le premier appel sur une clé", () => {
    const result = rateLimit("test:premier", 3, 60_000);
    expect(result.allowed).toBe(true);
    expect(result.retryAfter).toBe(0);
  });

  it("autorise les appels tant que la limite n'est pas atteinte", () => {
    expect(rateLimit("test:limite", 3, 60_000).allowed).toBe(true);
    expect(rateLimit("test:limite", 3, 60_000).allowed).toBe(true);
    expect(rateLimit("test:limite", 3, 60_000).allowed).toBe(true);
  });

  it("bloque l'appel qui dépasse la limite", () => {
    rateLimit("test:depasse", 2, 60_000);
    rateLimit("test:depasse", 2, 60_000);
    const bloque = rateLimit("test:depasse", 2, 60_000);
    expect(bloque.allowed).toBe(false);
    expect(bloque.retryAfter).toBeGreaterThan(0);
  });

  it("compte chaque clé indépendamment", () => {
    rateLimit("test:cleA", 1, 60_000);
    const cleA = rateLimit("test:cleA", 1, 60_000);
    const cleB = rateLimit("test:cleB", 1, 60_000);
    expect(cleA.allowed).toBe(false);
    expect(cleB.allowed).toBe(true);
  });

  it("réautorise les appels une fois la fenêtre écoulée", () => {
    jest.useFakeTimers();
    try {
      rateLimit("test:fenetre", 1, 1_000);
      expect(rateLimit("test:fenetre", 1, 1_000).allowed).toBe(false);
      jest.advanceTimersByTime(1_100);
      expect(rateLimit("test:fenetre", 1, 1_000).allowed).toBe(true);
    } finally {
      jest.useRealTimers();
    }
  });
});

describe("clientIp", () => {
  it("extrait la première IP de l'en-tête x-forwarded-for", () => {
    const request = new Request("http://localhost", {
      headers: { "x-forwarded-for": "203.0.113.7, 10.0.0.1" },
    });
    expect(clientIp(request)).toBe("203.0.113.7");
  });

  it("retombe sur x-real-ip si x-forwarded-for est absent", () => {
    const request = new Request("http://localhost", {
      headers: { "x-real-ip": "203.0.113.9" },
    });
    expect(clientIp(request)).toBe("203.0.113.9");
  });

  it("renvoie 'unknown' si aucun en-tête d'IP n'est présent", () => {
    const request = new Request("http://localhost");
    expect(clientIp(request)).toBe("unknown");
  });
});
