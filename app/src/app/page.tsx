import Link from "next/link";
import { redirect } from "next/navigation";
import { UserPlus, Search, Repeat, Clock, MapPin, ShieldCheck } from "lucide-react";
import { auth } from "@/auth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

const STEPS = [
  {
    icon: UserPlus,
    title: "Je crée mon compte",
    text: "Inscription en une minute, vérification du numéro par WhatsApp et une heure de crédit offerte pour démarrer.",
  },
  {
    icon: Search,
    title: "Je propose ou je cherche",
    text: "Je publie un service que je sais rendre, ou je parcours les annonces près de chez moi.",
  },
  {
    icon: Repeat,
    title: "J'échange du temps",
    text: "Le service rendu, les deux parties valident et l'heure est transférée automatiquement.",
  },
];

const ARGUMENTS = [
  {
    icon: Clock,
    title: "Une monnaie de temps",
    text: "Une heure rendue vaut une heure reçue, quel que soit le service. Pas d'argent, pas de spéculation.",
  },
  {
    icon: MapPin,
    title: "Près de chez vous",
    text: "Les échanges se font à l'échelle locale, filtrés par code postal et par catégorie.",
  },
  {
    icon: ShieldCheck,
    title: "Des échanges fiables",
    text: "Numéro vérifié à l'inscription et double validation pour sécuriser chaque transaction.",
  },
];

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <>
      <Navbar />

      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-text leading-tight animate-fade-in-up">
            Échangeons du temps,
            <br />
            <span className="text-success">créons du lien</span>
          </h1>
          <p className="mt-6 text-lg text-text-secondary max-w-2xl mx-auto animate-fade-in-up [animation-delay:120ms]">
            Lebontroc est une plateforme d&apos;échange de services près de chez
            vous. Une heure de votre temps vaut une heure du temps des autres,
            quel que soit le service rendu.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up [animation-delay:240ms]">
            <Link
              href="/inscription"
              className="bg-primary text-white rounded-[12px] px-6 py-3 font-medium hover:bg-primary-hover hover:shadow-md active:scale-[0.97] transition-all font-[family-name:var(--font-poppins)]"
            >
              Créer un compte
            </Link>
            <Link
              href="/annonces"
              className="border-2 border-primary text-primary rounded-[12px] px-6 py-3 font-medium hover:bg-blue-50 active:scale-[0.97] transition-all font-[family-name:var(--font-poppins)]"
            >
              Parcourir les annonces
            </Link>
          </div>
        </section>

        <section className="bg-surface border-y border-border py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-semibold text-center text-text mb-12">
              Comment ça marche
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {STEPS.map((step, i) => (
                <div
                  key={step.title}
                  className="text-center hover:scale-105 transition-transform duration-300"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-[16px] bg-[#EFF6FF] text-primary mb-4 transition-shadow duration-300 hover:shadow-md">
                    <step.icon size={26} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {i + 1}. {step.title}
                  </h3>
                  <p className="text-text-secondary">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-6">
            {ARGUMENTS.map((arg) => (
              <div
                key={arg.title}
                className="bg-surface rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-success mb-3">
                  <arg.icon size={28} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{arg.title}</h3>
                <p className="text-text-secondary text-sm">{arg.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
