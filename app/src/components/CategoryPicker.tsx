"use client";

import { useState } from "react";
import { CATEGORIES, CATEGORY_ICONS, CATEGORY_IMAGES } from "@/lib/categories";

interface CategoryPickerProps {
  value: string;
  onChange: (cat: string) => void;
  required?: boolean;
}

export function CategoryPicker({ value, onChange, required }: CategoryPickerProps) {
  const [animating, setAnimating] = useState<string | null>(null);

  function handleSelect(cat: string) {
    onChange(cat);
    setAnimating(cat);
    setTimeout(() => setAnimating(null), 400);
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-text">
        Catégorie {required && <span className="text-error">*</span>}
      </label>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
        {CATEGORIES.map((cat) => {
          const imgSrc = CATEGORY_IMAGES[cat];
          const Icon = CATEGORY_ICONS[cat];
          const isSelected = value === cat;
          const isAnimating = animating === cat;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleSelect(cat)}
              className={[
                "flex flex-col items-center gap-1.5 rounded-xl border-2 p-2.5 text-center transition-all duration-200",
                "hover:scale-105 hover:-translate-y-0.5 hover:shadow-md cursor-pointer",
                isSelected
                  ? "border-primary bg-primary/10 scale-105 shadow-md"
                  : "border-border bg-surface hover:border-primary/40",
                isAnimating ? "animate-pop" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={cat}
                  className="h-10 w-10 object-contain"
                  draggable={false}
                />
              ) : (
                <Icon size={40} className={isSelected ? "text-primary" : "text-text-secondary"} />
              )}
              <span
                className={`text-[11px] leading-tight font-medium ${
                  isSelected ? "text-primary" : "text-text-secondary"
                }`}
              >
                {cat}
              </span>
            </button>
          );
        })}
      </div>
      {value && (
        <p className="text-xs text-text-secondary">
          Catégorie choisie : <span className="font-semibold text-primary">{value}</span>
        </p>
      )}
    </div>
  );
}
