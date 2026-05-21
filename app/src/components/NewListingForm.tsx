"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, MapPin, Tag, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CATEGORIES, CATEGORY_IMAGES, CATEGORY_ICONS } from "@/lib/categories";

interface Particle {
  id: number;
  cat: string;
  left: number;
  size: number;
  delay: number;
  duration: number;
  rotate: number;
  drift: number;
}

interface BurstParticle {
  id: number;
  cat: string;
  bx: number;
  by: number;
  size: number;
  delay: number;
  duration: number;
  br: number;
}

interface CelebrationData {
  title: string;
  description: string;
  category: string;
  duration: string;
  postalCode: string;
}

function rnd(min: number, max: number) {
  return min + Math.random() * (max - min);
}

const KITSCH_EMOJIS = [
  { e: "⭐", t: "8%",  l: "4%",  s: 42, d: 0.6  },
  { e: "🔥", t: "12%", l: "88%", s: 52, d: 0.8  },
  { e: "💎", t: "72%", l: "6%",  s: 46, d: 1.0  },
  { e: "🌟", t: "78%", l: "90%", s: 38, d: 0.7  },
  { e: "👑", t: "4%",  l: "47%", s: 56, d: 0.5  },
  { e: "💫", t: "84%", l: "48%", s: 44, d: 0.9  },
  { e: "🎉", t: "42%", l: "2%",  s: 50, d: 0.65 },
  { e: "🎊", t: "38%", l: "93%", s: 48, d: 0.75 },
  { e: "⚡", t: "58%", l: "14%", s: 46, d: 1.1  },
  { e: "✨", t: "62%", l: "82%", s: 42, d: 0.85 },
  { e: "🌈", t: "24%", l: "22%", s: 54, d: 0.55 },
  { e: "🏆", t: "68%", l: "76%", s: 52, d: 0.95 },
  { e: "💥", t: "18%", l: "60%", s: 44, d: 1.2  },
  { e: "🎸", t: "50%", l: "89%", s: 48, d: 0.72 },
  { e: "🤩", t: "30%", l: "6%",  s: 50, d: 0.68 },
  { e: "🚀", t: "88%", l: "28%", s: 46, d: 0.78 },
];

export function NewListingForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [burstParticles, setBurstParticles] = useState<BurstParticle[]>([]);
  const [celebrating, setCelebrating] = useState(false);
  const [celebrationData, setCelebrationData] = useState<CelebrationData | null>(null);
  const [showKitsch, setShowKitsch] = useState(false);
  const nextId = useRef(0);

  const filledFields = [title, description, duration, category, postalCode].filter(Boolean).length;
  const progressPercent = (filledFields / 5) * 100;
  const progressColor =
    filledFields === 5
      ? "bg-success"
      : filledFields >= 4
      ? "bg-info"
      : filledFields >= 2
      ? "bg-warning"
      : "bg-primary";

  function spawnParticles(cat: string) {
    const count = 8;
    const slotWidth = 88 / count;
    const slots = Array.from({ length: count }, (_, i) => i).sort(() => Math.random() - 0.5);
    const newParticles: Particle[] = slots.map((slot) => ({
      id: nextId.current++,
      cat,
      left: 6 + slot * slotWidth + rnd(1, slotWidth * 0.5),
      size: rnd(65, 95),
      delay: rnd(0, 500),
      duration: rnd(1800, 2600),
      rotate: rnd(-18, 18),
      drift: rnd(-50, 50),
    }));
    setParticles((prev) => [...prev, ...newParticles]);
  }

  function spawnBurstParticles(cat: string) {
    const count = 24;
    const newParticles: BurstParticle[] = Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + rnd(-0.15, 0.15);
      const distance = rnd(180, 420);
      return {
        id: nextId.current++,
        cat,
        bx: Math.cos(angle) * distance,
        by: Math.sin(angle) * distance,
        size: rnd(60, 92),
        delay: rnd(0, 200),
        duration: rnd(900, 1500),
        br: rnd(-50, 50),
      };
    });
    setBurstParticles(newParticles);
  }

  function removeParticle(id: number) {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    setCategory(val);
    if (val) spawnParticles(val);
    if (val === "Autre") {
      setShowKitsch(true);
      setTimeout(() => setShowKitsch(false), 3800);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, duration, category, postalCode }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        setLoading(false);
        return;
      }

      setCelebrationData({ title, description, category, duration, postalCode });
      setCelebrating(true);
      spawnBurstParticles(category);
      setTimeout(() => router.push(`/annonces/${data.id}`), 3000);
    } catch {
      setError("Impossible de contacter le serveur.");
      setLoading(false);
    }
  }

  return (
    <>
      {/* Fly-up particles on category change */}
      {particles.map((p) => {
        const imgSrc = CATEGORY_IMAGES[p.cat];
        const Icon = CATEGORY_ICONS[p.cat];
        return (
          <div
            key={p.id}
            className="pointer-events-none fixed bottom-0 z-50"
            style={{
              left: `${p.left}%`,
              "--drift": `${p.drift}px`,
              animation: `fly-up ${p.duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${p.delay}ms forwards`,
            } as React.CSSProperties}
            onAnimationEnd={() => removeParticle(p.id)}
          >
            <div
              className="flex items-center justify-center rounded-2xl bg-white/90 shadow-lg ring-1 ring-primary/15"
              style={{ width: p.size, height: p.size, transform: `rotate(${p.rotate}deg)` }}
            >
              {imgSrc ? (
                <img src={imgSrc} alt={p.cat} className="h-4/5 w-4/5 object-contain" draggable={false} />
              ) : Icon ? (
                <Icon size={p.size * 0.6} className="text-primary" />
              ) : null}
            </div>
          </div>
        );
      })}

      {/* Kitsch overlay for "Autre" */}
      {showKitsch && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center overflow-hidden cursor-pointer"
          style={{ animation: "overlay-in 0.15s ease-out both" }}
          onClick={() => setShowKitsch(false)}
        >
          {/* Rainbow flashing background */}
          <div
            className="absolute inset-0"
            style={{ animation: "rainbow-bg 0.42s linear infinite" }}
          />

          {/* Spinning emoji decorations */}
          {KITSCH_EMOJIS.map((item, i) => (
            <div
              key={i}
              className="absolute select-none pointer-events-none"
              style={{
                top: item.t,
                left: item.l,
                fontSize: item.s,
                animation: `kitsch-spin ${item.d}s linear infinite`,
                filter: "drop-shadow(0 0 6px white) drop-shadow(0 0 12px rgba(255,255,255,0.5))",
              }}
            >
              {item.e}
            </div>
          ))}

          {/* Central card */}
          <div
            className="relative z-10 flex flex-col items-center gap-3 text-center px-4 max-w-sm w-full"
            style={{ animation: "card-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.05s both" }}
          >
            <div
              className="text-7xl"
              style={{ animation: "kitsch-bounce 0.45s ease-in-out infinite" }}
            >
              🏆
            </div>

            <div
              className="rounded-2xl p-6 w-full"
              style={{
                background: "rgba(0,0,0,0.55)",
                border: "4px solid #ffd700",
                boxShadow:
                  "0 0 25px #ffd700, 0 0 60px rgba(255,215,0,0.35), inset 0 0 25px rgba(255,215,0,0.08)",
                backdropFilter: "blur(6px)",
              }}
            >
              <h2
                className="text-4xl font-black text-white leading-tight"
                style={{
                  fontFamily: "Impact, Arial Black, 'Arial Narrow', sans-serif",
                  textShadow: "3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000",
                  animation: "kitsch-flash 0.22s ease-in-out infinite",
                  letterSpacing: "3px",
                }}
              >
                EXCELLENT<br />CHOIX !!!
              </h2>

              <p
                className="text-xl font-extrabold mt-3"
                style={{
                  animation: "rainbow-text 0.38s linear infinite",
                  textShadow: "2px 2px 0 #000",
                  fontFamily: "Impact, Arial Black, sans-serif",
                }}
              >
                ★ CATÉGORIE : AUTRE ★
              </p>

              <p
                className="mt-2 text-base font-bold text-yellow-300"
                style={{
                  textShadow: "1px 1px 0 #000",
                  fontFamily: "Impact, Arial Black, sans-serif",
                  letterSpacing: "1px",
                }}
              >
                LE CHOIX DES VRAIS<br />CONNAISSEURS
              </p>

              <div className="mt-3 text-2xl" style={{ animation: "kitsch-flash 0.35s ease-in-out infinite" }}>
                ⭐⭐⭐⭐⭐
              </div>

              <p
                className="mt-2 text-xs text-yellow-200/80 uppercase tracking-widest"
                style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
              >
                🥇 Certifié Qualité Supérieure™ 🥇
              </p>
            </div>

            <p
              className="text-white/55 text-xs font-bold uppercase tracking-widest"
              style={{ animation: "kitsch-flash 0.6s ease-in-out infinite" }}
            >
              Cliquez pour fermer
            </p>
          </div>
        </div>
      )}

      {/* Publication success overlay */}
      {celebrating && celebrationData && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ animation: "overlay-in 0.3s ease-out both" }}
        >
          {/* Blurred backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          {/* Burst particles */}
          {burstParticles.map((p) => {
            const imgSrc = CATEGORY_IMAGES[p.cat];
            const Icon = CATEGORY_ICONS[p.cat];
            return (
              <div
                key={p.id}
                className="pointer-events-none absolute top-1/2 left-1/2"
                style={{
                  "--bx": `${p.bx}px`,
                  "--by": `${p.by}px`,
                  "--br": `${p.br}deg`,
                  animation: `burst-out ${p.duration}ms cubic-bezier(0.2, 0.8, 0.3, 1) ${p.delay}ms forwards`,
                } as React.CSSProperties}
              >
                <div
                  className="flex items-center justify-center rounded-2xl bg-white/95 shadow-2xl ring-1 ring-white/30"
                  style={{ width: p.size, height: p.size }}
                >
                  {imgSrc ? (
                    <img src={imgSrc} alt="" className="h-4/5 w-4/5 object-contain" draggable={false} />
                  ) : Icon ? (
                    <Icon size={p.size * 0.55} className="text-primary" />
                  ) : null}
                </div>
              </div>
            );
          })}

          {/* Centered success content */}
          <div className="relative flex flex-col items-center gap-5 px-6 max-w-sm w-full">
            {/* Checkmark */}
            <div
              className="w-20 h-20 rounded-full bg-success flex items-center justify-center shadow-2xl ring-4 ring-success/30"
              style={{ animation: "card-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.05s both" }}
            >
              <CheckCircle size={42} className="text-white" strokeWidth={2.5} />
            </div>

            {/* Title */}
            <div
              className="text-center"
              style={{ animation: "fade-in-up 0.4s ease-out 0.3s both" }}
            >
              <h2 className="text-3xl font-bold text-white font-[family-name:var(--font-poppins)]">
                Annonce publiée !
              </h2>
              <p className="text-white/55 mt-1 text-sm">{celebrationData.title}</p>
            </div>

            {/* Mini listing preview */}
            <div
              className="w-full rounded-[16px] overflow-hidden shadow-2xl"
              style={{ animation: "card-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s both" }}
            >
              <div className="flex items-center gap-2 bg-[#EFF6FF] text-primary px-5 py-3">
                <CategoryIcon category={celebrationData.category} size={18} />
                <span className="text-sm font-medium">{celebrationData.category}</span>
              </div>
              <div className="bg-white p-4">
                <h3 className="font-[family-name:var(--font-poppins)] font-semibold text-text mb-1 line-clamp-1">
                  {celebrationData.title}
                </h3>
                <p className="text-text-secondary text-xs line-clamp-2 mb-3 leading-relaxed">
                  {celebrationData.description}
                </p>
                <div className="flex items-center justify-between text-xs text-text-secondary pt-2 border-t border-border">
                  <span className="flex items-center gap-1 font-medium text-text">
                    <Clock size={13} />
                    {celebrationData.duration} h
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={13} />
                    {celebrationData.postalCode}
                  </span>
                </div>
              </div>
            </div>

            {/* Redirect progress bar */}
            <div
              className="w-full"
              style={{ animation: "fade-in-up 0.4s ease-out 0.85s both" }}
            >
              <p className="text-white/40 text-xs text-center mb-2">Redirection en cours...</p>
              <div className="h-[3px] bg-white/15 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white/80 rounded-full"
                  style={{ animation: "redirect-bar 2.4s linear 0.6s both" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form + preview layout */}
      <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              id="title"
              label="Titre"
              placeholder="Ex : Aide au déménagement"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Textarea
              id="description"
              label="Description"
              placeholder="Décrivez le service que vous proposez ou recherchez."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <Input
              id="duration"
              label="Durée estimée (en heures)"
              type="number"
              min="0.5"
              step="0.5"
              placeholder="2"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
            <Select
              id="category"
              label="Catégorie"
              options={CATEGORIES}
              placeholder="Choisir une catégorie"
              value={category}
              onChange={handleCategoryChange}
              required
            />
            <Input
              id="postalCode"
              label="Code postal"
              placeholder="75001"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />

            {error && <p className="text-error text-sm">{error}</p>}

            <Button type="submit" disabled={loading} className="mt-2">
              {loading ? "Publication..." : "Publier l'annonce"}
            </Button>
          </form>
        </Card>

        <div className="flex flex-col gap-4 lg:sticky lg:top-24">
          {/* Progress */}
          <div className="bg-surface rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-5">
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="font-[family-name:var(--font-poppins)] font-medium text-text">
                Progression
              </span>
              <span className="text-text-secondary tabular-nums">{filledFields} / 5</span>
            </div>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${progressColor}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {filledFields === 5 && (
              <p className="text-success text-sm mt-3 font-medium flex items-center gap-1.5 animate-fade-in-up">
                <CheckCircle size={15} />
                Prêt à publier !
              </p>
            )}
          </div>

          {/* Preview */}
          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-2 px-1">
              Aperçu
            </p>
            <div className="rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
              <div
                className={`flex items-center gap-2 px-5 py-3 transition-colors duration-300 ${
                  category ? "bg-[#EFF6FF] text-primary" : "bg-border/30 text-text-secondary/50"
                }`}
              >
                {category ? (
                  <CategoryIcon category={category} size={18} />
                ) : (
                  <Tag size={18} />
                )}
                <span className="text-sm font-medium">{category || "Catégorie"}</span>
              </div>

              <div className="p-5 bg-surface">
                <h3
                  className={`font-[family-name:var(--font-poppins)] font-semibold text-lg mb-2 transition-colors duration-200 ${
                    title ? "text-text" : "text-text-secondary/35"
                  }`}
                >
                  {title || "Titre de l'annonce"}
                </h3>
                <p
                  className={`text-sm line-clamp-2 mb-4 leading-relaxed transition-colors duration-200 ${
                    description ? "text-text-secondary" : "text-text-secondary/35"
                  }`}
                >
                  {description || "Votre description apparaîtra ici..."}
                </p>
                <div className="flex items-center justify-between text-sm pt-3 border-t border-border">
                  <span
                    className={`flex items-center gap-1.5 font-medium transition-colors duration-200 ${
                      duration ? "text-text" : "text-text-secondary/35"
                    }`}
                  >
                    <Clock size={15} />
                    {duration ? `${duration} h` : "-- h"}
                  </span>
                  <span
                    className={`flex items-center gap-1.5 transition-colors duration-200 ${
                      postalCode ? "text-text-secondary" : "text-text-secondary/35"
                    }`}
                  >
                    <MapPin size={15} />
                    {postalCode || "-----"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
