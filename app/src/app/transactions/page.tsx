import Link from "next/link";
import { redirect } from "next/navigation";
import { Inbox, ArrowRightLeft } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { CategoryIcon } from "@/components/CategoryIcon";
import { TransactionStatusBadge } from "@/components/TransactionStatus";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/connexion");
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        { beneficiaryId: session.user.id },
        { providerId: session.user.id },
      ],
    },
    include: {
      listing: { select: { id: true, title: true, category: true } },
      beneficiary: { select: { id: true, email: true } },
      provider: { select: { id: true, email: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <>
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">
        <h1 className="text-3xl font-semibold text-text mb-2">Mes échanges</h1>
        <p className="text-text-secondary text-sm mb-6">
          Toutes vos transactions, que vous soyez prestataire ou bénéficiaire.
        </p>

        {transactions.length === 0 ? (
          <Card>
            <div className="flex flex-col items-center text-center py-10 text-text-secondary">
              <Inbox size={48} className="mb-4 opacity-50" />
              <p className="text-lg font-medium text-text mb-1">
                Aucun échange pour le moment
              </p>
              <p className="text-sm">
                Vos réservations et celles des autres apparaîtront ici.
              </p>
              <Link
                href="/annonces"
                className="mt-4 text-primary text-sm font-medium hover:underline"
              >
                Parcourir les annonces
              </Link>
            </div>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {transactions.map((t) => {
              const isBeneficiary = t.beneficiaryId === session.user.id;
              const role = isBeneficiary ? "Bénéficiaire" : "Prestataire";
              const counterparty = isBeneficiary
                ? t.provider.email
                : t.beneficiary.email;
              return (
                <Link
                  key={t.id}
                  href={`/transactions/${t.id}`}
                  className="block hover:scale-[1.005] transition-transform"
                >
                  <Card className="!p-4">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex-shrink-0 text-primary">
                          <CategoryIcon category={t.listing.category} size={24} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-text font-medium truncate">
                            {t.listing.title}
                          </p>
                          <p className="text-text-secondary text-sm truncate">
                            {role} · {counterparty}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-text-secondary flex items-center gap-1">
                          <ArrowRightLeft size={14} />
                          {t.duration} h
                        </span>
                        <TransactionStatusBadge status={t.status} />
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
