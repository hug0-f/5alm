import { auth, signOut } from "@/auth";
import { Logo } from "@/components/Logo";
import { NavLinks } from "@/components/NavLinks";
import Link from "next/link";

export async function Navbar() {
  const session = await auth();
  return (
    <header className="h-16 bg-surface shadow-[0_1px_4px_rgba(0,0,0,0.08)] sticky top-0 z-10">
      <div className="max-w-6xl mx-auto h-full px-4 flex items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-4">
          <NavLinks isLoggedIn={!!session?.user} />
          {session?.user ? (
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="text-text-secondary hover:text-error transition-colors text-sm"
              >
                Se déconnecter
              </button>
            </form>
          ) : (
            <>
              <Link
                href="/connexion"
                className="text-text hover:text-primary transition-colors duration-200 text-sm font-medium"
              >
                Se connecter
              </Link>
              <Link
                href="/inscription"
                className="bg-primary text-white rounded-[12px] px-4 py-2 text-sm font-medium hover:bg-primary-hover hover:shadow-md active:scale-[0.97] transition-all duration-200 font-[family-name:var(--font-poppins)]"
              >
                S&apos;inscrire
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
