import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NewListingForm } from "@/components/NewListingForm";

export const dynamic = "force-dynamic";

export default async function NouvelleAnnoncePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/connexion");
  }

  return (
    <>
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
        <h1 className="text-3xl font-semibold text-text mb-6">
          Publier une annonce
        </h1>
        <NewListingForm />
      </main>

      <Footer />
    </>
  );
}
