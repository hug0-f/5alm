import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Check, Clock, MapPin, User } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { CategoryIcon } from "@/components/CategoryIcon";
import { TransactionStatusBadge } from "@/components/TransactionStatus";
import { TransactionActions } from "@/components/TransactionActions";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TransactionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/connexion");
  }

  const transaction = await prisma.transaction.findUnique({
    where: { id },
    include: {
      listing: {
        select: {
          id: true,
          title: true,
          category: true,
          postalCode: true,
          duration: true,
        },
      },
      beneficiary: { select: { id: true, email: true } },
      provider: { select: { id: true, email: true } },
    },
  });

  if (!transaction) {
    notFound();
  }

  const userId = session.user.id;
  const isBeneficiary = transaction.beneficiaryId === userId;
  const isProvider = transaction.providerId === userId;
  if (!isBeneficiary && !isProvider) {
    notFound();
  }

  const isOpen = transaction.status === "OUVERTE";
  const userAlreadyValidated = isBeneficiary
    ? transaction.beneficiaryValidated
    : transaction.providerValidated;

  const canValidate = isOpen && !userAlreadyValidated;
  // Seul le prestataire peut refuser, et seulement avant que la transaction
  // soit finalisee.
  const canRefuse = isOpen && isProvider && !transaction.providerValidated;

  return (
    <>
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
        <Link
          href="/transactions"
          className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:underline mb-4"
        >
          <ArrowLeft size={16} />
          Retour à mes échanges
        </Link>

        <Card>
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 text-primary">
              <CategoryIcon category={transaction.listing.category} size={20} />
              <span className="text-sm font-medium bg-[#EFF6FF] px-3 py-1 rounded-full">
                {transaction.listing.category}
              </span>
            </div>
            <TransactionStatusBadge status={transaction.status} />
          </div>

          <h1 className="text-2xl font-semibold text-text mb-2">
            {transaction.listing.title}
          </h1>
          <Link
            href={`/annonces/${transaction.listing.id}`}
            className="text-sm text-primary hover:underline"
          >
            Voir l&apos;annonce
          </Link>

          <div className="flex flex-wrap gap-6 text-sm text-text-secondary mt-6">
            <span className="flex items-center gap-1.5">
              <Clock size={16} />
              <strong className="text-text">{transaction.duration} h</strong>{" "}
              à transférer
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={16} />
              <strong className="text-text">
                {transaction.listing.postalCode}
              </strong>
            </span>
          </div>

          <hr className="my-6 border-border" />

          <h2 className="text-lg font-semibold text-text mb-3">Participants</h2>

          <div className="flex flex-col gap-3">
            <ParticipantRow
              label="Bénéficiaire (reçoit le service)"
              email={transaction.beneficiary.email}
              validated={transaction.beneficiaryValidated}
              isCurrentUser={isBeneficiary}
            />
            <ParticipantRow
              label="Prestataire (rend le service)"
              email={transaction.provider.email}
              validated={transaction.providerValidated}
              isCurrentUser={isProvider}
            />
          </div>

          {isOpen && (
            <>
              <hr className="my-6 border-border" />
              <h2 className="text-lg font-semibold text-text mb-2">
                À faire
              </h2>
              <p className="text-sm text-text-secondary">
                Une fois que les deux parties ont validé, le transfert de{" "}
                <strong>{transaction.duration} h</strong> sera exécuté
                automatiquement.
                {userAlreadyValidated && (
                  <>
                    {" "}
                    Vous avez déjà validé, on attend{" "}
                    {isBeneficiary ? "le prestataire" : "le bénéficiaire"}.
                  </>
                )}
              </p>
              <TransactionActions
                transactionId={transaction.id}
                canValidate={canValidate}
                canRefuse={canRefuse}
              />
            </>
          )}

          {transaction.status === "FINALISEE" && (
            <>
              <hr className="my-6 border-border" />
              <p className="text-sm text-emerald-700 bg-emerald-50 px-3 py-2 rounded-[8px]">
                Échange finalisé. {transaction.duration} h ont été transférées
                du bénéficiaire vers le prestataire.
              </p>
            </>
          )}

          {transaction.status === "ANNULEE" && (
            <>
              <hr className="my-6 border-border" />
              <p className="text-sm text-text-secondary bg-gray-50 px-3 py-2 rounded-[8px]">
                Cette transaction a été annulée. Aucun transfert d&apos;heures
                n&apos;a été effectué.
              </p>
            </>
          )}
        </Card>
      </main>

      <Footer />
    </>
  );
}

function ParticipantRow({
  label,
  email,
  validated,
  isCurrentUser,
}: {
  label: string;
  email: string;
  validated: boolean;
  isCurrentUser: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-border last:border-0">
      <div className="flex items-center gap-2 min-w-0">
        <User size={18} className="text-text-secondary flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-xs text-text-secondary">{label}</p>
          <p className="text-sm text-text truncate">
            {email} {isCurrentUser && <span className="text-text-secondary">(vous)</span>}
          </p>
        </div>
      </div>
      {validated ? (
        <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-medium bg-emerald-50 px-2.5 py-1 rounded-full">
          <Check size={14} />
          Validé
        </span>
      ) : (
        <span className="text-text-secondary text-xs">En attente</span>
      )}
    </div>
  );
}
