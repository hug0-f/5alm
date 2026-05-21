import Link from "next/link";
import { Plus, SearchX } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { isValidCategory } from "@/lib/categories";
import { isValidPostalCode } from "@/lib/validation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ListingCard } from "@/components/ListingCard";
import { ListingFilter } from "@/components/ListingFilter";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ category?: string; postalCode?: string }>;
}

export default async function AnnoncesPage({ searchParams }: PageProps) {
  const { category, postalCode } = await searchParams;
  const safeCategory = category && isValidCategory(category) ? category : undefined;
  const safePostal =
    postalCode && isValidPostalCode(postalCode) ? postalCode : undefined;

  const listings = await prisma.listing.findMany({
    where: {
      status: "ACTIVE",
      ...(safeCategory ? { category: safeCategory } : {}),
      ...(safePostal ? { postalCode: safePostal } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-text">Les annonces</h1>
            <p className="text-text-secondary text-sm mt-1">
              {listings.length} annonce{listings.length > 1 ? "s" : ""}{" "}
              disponible{listings.length > 1 ? "s" : ""}
            </p>
          </div>
          <Link
            href="/annonces/nouvelle"
            className="flex items-center gap-2 bg-primary text-white rounded-[12px] px-4 py-2 text-sm font-medium hover:bg-primary-hover transition-colors font-[family-name:var(--font-poppins)] whitespace-nowrap"
          >
            <Plus size={18} />
            Publier
          </Link>
        </div>

        <div className="mb-8">
          <ListingFilter
            defaultCategory={safeCategory}
            defaultPostalCode={safePostal}
          />
        </div>

        {listings.length === 0 ? (
          <div className="flex flex-col items-center text-center py-20 text-text-secondary">
            <SearchX size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium text-text mb-1">
              Aucune annonce trouvée
            </p>
            <p>
              Aucune annonce ne correspond à votre recherche pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map((l) => (
              <ListingCard
                key={l.id}
                id={l.id}
                title={l.title}
                description={l.description}
                duration={l.duration}
                category={l.category}
                postalCode={l.postalCode}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
