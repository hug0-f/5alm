"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
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

function rnd(min: number, max: number) {
  return min + Math.random() * (max - min);
}

interface EditListingFormProps {
  id: string;
  initial: {
    title: string;
    description: string;
    duration: number;
    category: string;
    postalCode: string;
  };
}

export function EditListingForm({ id, initial }: EditListingFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [duration, setDuration] = useState(String(initial.duration));
  const [category, setCategory] = useState(initial.category);
  const [postalCode, setPostalCode] = useState(initial.postalCode);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const nextId = useRef(0);

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

  function removeParticle(id: number) {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          duration,
          category,
          postalCode,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        setLoading(false);
        return;
      }
      router.push(`/annonces/${id}`);
    } catch {
      setError("Impossible de contacter le serveur.");
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Voulez-vous vraiment supprimer cette annonce ?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/listings/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Suppression impossible.");
        setDeleting(false);
        return;
      }
      router.push("/mes-annonces");
    } catch {
      setError("Impossible de contacter le serveur.");
      setDeleting(false);
    }
  }

  return (
    <>
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
      <Card>
      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <Input
          id="title"
          label="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Textarea
          id="description"
          label="Description"
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
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
        <Select
          id="category"
          label="Catégorie"
          options={CATEGORIES}
          value={category}
          onChange={(e) => { setCategory(e.target.value); if (e.target.value) spawnParticles(e.target.value); }}
          required
        />
        <Input
          id="postalCode"
          label="Code postal"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          required
        />

        {error && <p className="text-error text-sm">{error}</p>}

        <div className="flex gap-3 mt-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Enregistrement..." : "Enregistrer"}
          </Button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="text-error text-sm font-medium hover:underline disabled:opacity-60"
          >
            {deleting ? "Suppression..." : "Supprimer l'annonce"}
          </button>
        </div>
      </form>
    </Card>
    </>
  );
}
