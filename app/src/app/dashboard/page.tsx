import Link from "next/link";
import { redirect } from "next/navigation";
import { Clock, Megaphone, ListChecks } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/connexion");
  }

  const [user, listingsCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, balance: true, isVerified: true, phoneNumber: true },
    }),
    prisma.listing.count({ where: { authorId: session.user.id } }),
  ]);

  if (!user) {
    redirect("/connexion");
  }
  if (!user.isVerified) {
    redirect(`/verification?phone=${encodeURIComponent(user.phoneNumber)}`);
  }

  return (
    <>
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        <h1 className="text-3xl font-semibold text-text mb-1">
          Mon tableau de bord
        </h1>
        <p className="text-text-secondary mb-8">{user.email}</p>

        <div className="grid md:grid-cols-3 gap-6 animate-fade-in-up [animation-delay:80ms]">
          <Card className="flex flex-col border-l-4 border-primary">
            <div className="flex items-center gap-2 text-text-secondary text-sm mb-2">
              <Clock size={18} className="text-primary" />
              Mon solde
            </div>
            <p className="text-4xl font-bold text-primary">
              {user.balance}
              <span className="text-lg font-medium text-text-secondary ml-1">
                h
              </span>
            </p>
            <p className="text-text-secondary text-sm mt-3">
              Une heure rendue vaut une heure reçue, quel que soit le service.
            </p>
          </Card>

          <Card className="flex flex-col border-l-4 border-info">
            <div className="flex items-center gap-2 text-text-secondary text-sm mb-2">
              <ListChecks size={18} className="text-info" />
              Mes annonces
            </div>
            <p className="text-4xl font-bold text-info">{listingsCount}</p>
            <Link
              href="/mes-annonces"
              className="text-primary text-sm font-medium mt-3 hover:underline"
            >
              Gérer mes annonces
            </Link>
          </Card>

          <Card className="flex flex-col justify-between border-l-4 border-success">
            <div>
              <div className="flex items-center gap-2 text-text-secondary text-sm mb-2">
                <Megaphone size={18} className="text-success" />
                Échanger un service
              </div>
              <p className="text-text-secondary text-sm">
                Parcourez les annonces ou proposez vos propres services à la
                communauté.
              </p>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <Link
                href="/annonces"
                className="bg-primary text-white text-center rounded-[12px] px-4 py-2 text-sm font-medium hover:bg-primary-hover hover:shadow-md active:scale-[0.97] transition-all font-[family-name:var(--font-poppins)]"
              >
                Voir les annonces
              </Link>
              <Link
                href="/annonces/nouvelle"
                className="border-2 border-primary text-primary text-center rounded-[12px] px-4 py-2 text-sm font-medium hover:bg-blue-50 active:scale-[0.97] transition-all font-[family-name:var(--font-poppins)]"
              >
                Publier une annonce
              </Link>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  );
}
