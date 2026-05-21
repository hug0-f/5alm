import { CATEGORY_ICONS } from "@/lib/categories";
import { HelpingHand } from "lucide-react";

interface CategoryIconProps {
  category: string;
  size?: number;
  className?: string;
}

export function CategoryIcon({
  category,
  size = 18,
  className,
}: CategoryIconProps) {
  const Icon = CATEGORY_ICONS[category] ?? HelpingHand;
  return <Icon size={size} className={className} />;
}
