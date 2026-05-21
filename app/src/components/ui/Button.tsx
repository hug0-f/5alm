import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary";
type Size = "default" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant = "primary",
  size = "default",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "font-[family-name:var(--font-poppins)] font-medium rounded-[12px] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.97]";

  const sizes: Record<Size, string> = {
    default: "px-6 py-3",
    sm: "px-4 py-2.5 text-sm",
  };

  const styles: Record<Variant, string> = {
    primary: "bg-primary text-white hover:bg-primary-hover hover:shadow-md",
    secondary:
      "border-2 border-primary text-primary bg-transparent hover:bg-blue-50",
  };

  return (
    <button className={`${base} ${sizes[size]} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
