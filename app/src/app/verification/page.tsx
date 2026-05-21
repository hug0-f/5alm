"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function VerificationForm() {
  const router = useRouter();
  const params = useSearchParams();
  const phone = params.get("phone") ?? "";
  const waError = params.get("waError") === "1";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone, code }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Code incorrect.");
        setLoading(false);
        return;
      }

      router.push("/connexion?verified=1");
    } catch {
      setError("Impossible de contacter le serveur.");
      setLoading(false);
    }
  }

  async function handleResend() {
    setResendMessage("");
    setError("");
    setResendLoading(true);
    try {
      const res = await fetch("/api/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone }),
      });
      if (res.ok) {
        setResendMessage("Un nouveau code a été envoyé.");
      } else {
        const data = await res.json();
        setError(data.error ?? "Impossible d'envoyer le code.");
      }
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md animate-fade-in-up [animation-delay:100ms]">
      <h1 className="text-2xl font-semibold mb-1">Vérification du numéro</h1>
      <p className="text-text-secondary text-sm mb-6">
        Un code vous a été envoyé sur WhatsApp au {phone}. Saisissez-le pour
        activer votre compte et recevoir votre première heure de crédit.
      </p>

      {waError && (
        <div className="bg-[#FEF3C7] text-[#92400E] text-sm rounded-[10px] px-4 py-3 mb-4">
          L&apos;envoi du code WhatsApp a échoué. Cliquez sur « Renvoyer le code »
          ci-dessous pour réessayer.
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="code"
          label="Code reçu par WhatsApp"
          inputMode="numeric"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />

        {error && <p className="text-error text-sm">{error}</p>}
        {resendMessage && (
          <p className="text-sm text-[#166534]">{resendMessage}</p>
        )}

        <Button type="submit" disabled={loading} className="mt-2">
          {loading ? "Vérification..." : "Valider mon numéro"}
        </Button>
      </form>

      <p className="text-sm text-text-secondary mt-4 text-center">
        Pas reçu le code ?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={resendLoading}
          className="text-primary font-medium disabled:opacity-50"
        >
          {resendLoading ? "Envoi..." : "Renvoyer le code"}
        </button>
      </p>
    </Card>
  );
}

export default function VerificationPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 animate-fade-in-up">
        <Logo height={64} decorative />
      </div>
      <Suspense fallback={<p className="text-text-secondary">Chargement...</p>}>
        <VerificationForm />
      </Suspense>
    </main>
  );
}
