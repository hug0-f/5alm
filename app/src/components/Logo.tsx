import Link from "next/link";
import Image from "next/image";

const RATIO = 1575 / 378;

interface LogoProps {
  height?: number;
  decorative?: boolean;
}

export function Logo({ height = 40, decorative = false }: LogoProps) {
  const width = Math.round(height * RATIO);

  const img = (
    <Image
      src="/logo.png"
      alt="Lebontroc"
      width={width}
      height={height}
      priority
      style={{ height, width: "auto" }}
    />
  );

  if (decorative) return img;

  return (
    <Link href="/" aria-label="Accueil Lebontroc">
      {img}
    </Link>
  );
}
