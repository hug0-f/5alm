"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface ListingFilterProps {
  defaultCategory?: string;
  defaultPostalCode?: string;
}

export function ListingFilter({
  defaultCategory = "",
  defaultPostalCode = "",
}: ListingFilterProps) {
  const router = useRouter();
  const [category, setCategory] = useState(defaultCategory);
  const [postalCode, setPostalCode] = useState(defaultPostalCode);

  function applyFilters(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (postalCode) params.set("postalCode", postalCode);
    router.push(`/annonces?${params.toString()}`);
  }

  function reset() {
    setCategory("");
    setPostalCode("");
    router.push("/annonces");
  }

  return (
    <form
      onSubmit={applyFilters}
      className="bg-surface rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-5 flex flex-col sm:flex-row sm:items-end gap-4"
    >
      <div className="flex-1">
        <Select
          id="filter-category"
          label="Catégorie"
          options={CATEGORIES}
          placeholder="Toutes les catégories"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      <div className="flex-1">
        <Input
          id="filter-postal"
          label="Code postal"
          placeholder="Tous"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm">Filtrer</Button>
        <Button type="button" variant="secondary" size="sm" onClick={reset}>
          Réinitialiser
        </Button>
      </div>
    </form>
  );
}
