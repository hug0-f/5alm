"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Logo } from "@/components/Logo";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function ConnexionForm() {
  const params = useSearchParams();
  const justVerified = params.get("verified") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <Card className="w-full max-w-md animate-fade-in-up [animation-delay:100ms]">
      <h1 className="text-2xl font-semibold mb-1">Se connecter</h1>
      <p className="text-text-secondary text-sm mb-6">
        Accédez à votre tableau de bord et à vos échanges.
      </p>

      {justVerified && (
        <div className="bg-[#F0FDF4] text-[#166534] text-sm rounded-[10px] px-4 py-3 mb-4">
          Votre numéro est vérifié. Vous pouvez maintenant vous connecter.
        </div>
      )}

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
          id="password"
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-error text-sm">{error}</p>}

        <Button type="submit" disabled={loading} className="mt-2">
          {loading ? "Connexion..." : "Se connecter"}
        </Button>
      </form>

      <p className="text-sm text-text-secondary mt-6 text-center">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="text-primary font-medium">
          Créer un compte
        </Link>
      </p>
    </Card>
  );
}

export default function ConnexionPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 animate-fade-in-up">
        <Logo height={64} decorative />
      </div>
      <Suspense fallback={<p className="text-text-secondary">Chargement...</p>}>
        <ConnexionForm />
      </Suspense>
    </main>
  );
}
