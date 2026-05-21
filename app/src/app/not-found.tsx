import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mb-8">
        <Logo height={56} decorative />
      </div>
      <h1 className="text-5xl font-bold text-primary mb-3">404</h1>
      <p className="text-text-secondary mb-8">
        Cette page n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="bg-primary text-white rounded-[12px] px-6 py-3 font-medium hover:bg-primary-hover transition-colors font-[family-name:var(--font-poppins)]"
      >
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
