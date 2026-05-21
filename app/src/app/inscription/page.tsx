"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function InscriptionPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phoneNumber, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        setLoading(false);
        return;
      }

      const params = new URLSearchParams({ phone: data.phoneNumber });
      if (data.whatsappSent === false) params.set("waError", "1");
      router.push(`/verification?${params.toString()}`);
    } catch {
      setError("Impossible de contacter le serveur.");
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 animate-fade-in-up">
        <Logo height={64} decorative />
      </div>

      <Card className="w-full max-w-md animate-fade-in-up [animation-delay:100ms]">
        <h1 className="text-2xl font-semibold mb-1">Créer un compte</h1>
        <p className="text-text-secondary text-sm mb-6">
          Vous recevrez un code par WhatsApp pour vérifier votre numéro.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="email"
            label="Adresse email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="phone"
            label="Numéro de téléphone"
            type="tel"
            placeholder="0612345678"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <Input
            id="password"
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-error text-sm">{error}</p>}

          <Button type="submit" disabled={loading} className="mt-2">
            {loading ? "Création en cours..." : "Créer mon compte"}
          </Button>
        </form>

        <p className="text-sm text-text-secondary mt-6 text-center">
          Déjà un compte ?{" "}
          <Link href="/connexion" className="text-primary font-medium">
            Se connecter
          </Link>
        </p>
      </Card>
    </main>
  );
}
