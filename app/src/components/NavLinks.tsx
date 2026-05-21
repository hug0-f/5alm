"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinksProps {
  isLoggedIn: boolean;
}

export function NavLinks({ isLoggedIn }: NavLinksProps) {
  const pathname = usePathname();

  function cls(href: string) {
    const active = pathname === href || pathname.startsWith(href + "/");
    return `text-sm font-medium transition-colors duration-200 ${
      active ? "text-primary" : "text-text hover:text-primary"
    }`;
  }

  return (
    <>
      <Link href="/annonces" className={cls("/annonces")}>
        Les annonces
      </Link>
      {isLoggedIn && (
        <Link href="/mes-annonces" className={cls("/mes-annonces")}>
          Mes annonces
        </Link>
      )}
      {isLoggedIn && (
        <Link href="/transactions" className={cls("/transactions")}>
          Mes échanges
        </Link>
      )}
      {isLoggedIn && (
        <Link href="/dashboard" className={cls("/dashboard")}>
          Mon tableau de bord
        </Link>
      )}
    </>
  );
}
