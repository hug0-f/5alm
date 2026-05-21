import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";

interface ListingCardProps {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  postalCode: string;
}

export function ListingCard({
  id,
  title,
  description,
  duration,
  category,
  postalCode,
}: ListingCardProps) {
  return (
    <Link
      href={`/annonces/${id}`}
      className="group flex flex-col bg-surface rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      <div className="flex items-center gap-2 bg-[#EFF6FF] text-primary px-5 py-3">
        <CategoryIcon category={category} size={18} />
        <span className="text-sm font-medium">{category}</span>
      </div>
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-[family-name:var(--font-poppins)] font-semibold text-lg text-text mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-text-secondary text-sm line-clamp-2 mb-4 flex-1">
          {description}
        </p>
        <div className="flex items-center justify-between text-sm text-text-secondary pt-3 border-t border-border">
          <span className="flex items-center gap-1.5 text-text font-medium">
            <Clock size={15} />
            {duration} h
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={15} />
            {postalCode}
          </span>
        </div>
      </div>
    </Link>
  );
}
