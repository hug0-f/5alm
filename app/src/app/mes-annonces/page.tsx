import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Pencil, Eye } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function MesAnnoncesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/connexion");
  }

  const listings = await prisma.listing.findMany({
    where: { authorId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-semibold text-text">Mes annonces</h1>
          <Link
            href="/annonces/nouvelle"
            className="flex items-center gap-2 bg-primary text-white rounded-[12px] px-4 py-2 text-sm font-medium hover:bg-primary-hover transition-colors font-[family-name:var(--font-poppins)] whitespace-nowrap"
          >
            <Plus size={18} />
            Publier
          </Link>
        </div>

        {listings.length === 0 ? (
          <Card>
            <p className="text-text-secondary">
              Vous n&apos;avez pas encore publié d&apos;annonce. Proposez un
              service pour commencer à échanger.
            </p>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {listings.map((l) => {
              return (
                <Card key={l.id} className="hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-200">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="hidden sm:flex items-center justify-center w-11 h-11 rounded-[12px] bg-[#EFF6FF] text-primary shrink-0">
                        <CategoryIcon category={l.category} size={20} />
                      </div>
                      <div className="min-w-0">
                        <h2 className="font-[family-name:var(--font-poppins)] font-semibold text-lg truncate">
                          {l.title}
                        </h2>
                        <p className="text-text-secondary text-sm">
                          {l.category} · {l.duration} h · {l.postalCode}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4 shrink-0">
                      <Link
                        href={`/annonces/${l.id}`}
                        className="flex items-center gap-1.5 text-primary text-sm font-medium hover:underline"
                      >
                        <Eye size={16} />
                        Voir
                      </Link>
                      <Link
                        href={`/annonces/${l.id}/modifier`}
                        className="flex items-center gap-1.5 text-primary text-sm font-medium hover:underline"
                      >
                        <Pencil size={16} />
                        Modifier
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
