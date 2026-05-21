import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, MapPin, User } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { ReserveButton } from "@/components/ReserveButton";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { author: { select: { id: true, email: true } } },
  });

  if (!listing) {
    notFound();
  }

  const isOwner = session?.user?.id === listing.author.id;
  const isLoggedIn = Boolean(session?.user?.id);
  const isVerified = Boolean(session?.user?.isVerified);

  let userBalance = 0;
  if (isLoggedIn && !isOwner) {
    const me = await prisma.user.findUnique({
      where: { id: session!.user!.id },
      select: { balance: true },
    });
    userBalance = me?.balance ?? 0;
  }

  return (
    <>
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">
        <Link
          href="/annonces"
          className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:underline mb-4"
        >
          <ArrowLeft size={16} />
          Retour aux annonces
        </Link>

        <Card className="animate-fade-in-up">
          <div className="flex items-center gap-2 text-primary mb-4">
            <CategoryIcon category={listing.category} size={20} />
            <span className="text-sm font-medium bg-[#EFF6FF] px-3 py-1 rounded-full">
              {listing.category}
            </span>
          </div>

          <h1 className="text-3xl font-semibold text-text mb-4">
            {listing.title}
          </h1>

          <div className="flex flex-wrap gap-6 text-sm text-text-secondary mb-6">
            <span className="flex items-center gap-1.5">
              <Clock size={16} />
              Durée estimée :{" "}
              <strong className="text-text">{listing.duration} h</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={16} />
              <strong className="text-text">{listing.postalCode}</strong>
            </span>
          </div>

          <p className="text-text whitespace-pre-line leading-relaxed">
            {listing.description}
          </p>

          <hr className="my-6 border-border" />

          <p className="flex items-center gap-1.5 text-sm text-text-secondary">
            <User size={16} />
            {isLoggedIn
              ? `Proposé par ${listing.author.email}`
              : "Connectez-vous pour voir l'auteur de cette annonce."}
          </p>

          {isOwner ? (
            <Link
              href={`/annonces/${listing.id}/modifier`}
              className="inline-block border-2 border-primary text-primary rounded-[12px] px-5 py-2.5 text-sm font-medium hover:bg-blue-50 transition-colors font-[family-name:var(--font-poppins)] mt-6"
            >
              Modifier mon annonce
            </Link>
          ) : !isLoggedIn ? (
            <p className="text-text-secondary text-sm mt-6">
              <Link href="/connexion" className="text-primary hover:underline">
                Connectez-vous
              </Link>{" "}
              pour réserver ce service.
            </p>
          ) : !isVerified ? (
            <p className="text-text-secondary text-sm mt-6">
              Vous devez vérifier votre numéro avant de pouvoir réserver un
              service.
            </p>
          ) : (
            <ReserveButton
              listingId={listing.id}
              duration={listing.duration}
              userBalance={userBalance}
            />
          )}
        </Card>
      </main>

      <Footer />
    </>
  );
}
