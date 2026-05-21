import { HTMLAttributes } from "react";

export function Card({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-surface rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
