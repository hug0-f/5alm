import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EditListingForm } from "@/components/EditListingForm";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ModifierAnnoncePage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/connexion");
  }

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) {
    notFound();
  }
  if (listing.authorId !== session.user.id) {
    redirect(`/annonces/${id}`);
  }

  return (
    <>
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10">
        <h1 className="text-3xl font-semibold text-text mb-6">
          Modifier l&apos;annonce
        </h1>
        <EditListingForm
          id={listing.id}
          initial={{
            title: listing.title,
            description: listing.description,
            duration: listing.duration,
            category: listing.category,
            postalCode: listing.postalCode,
          }}
        />
      </main>

      <Footer />
    </>
  );
}
