import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="font-[family-name:var(--font-poppins)] text-sm font-medium text-[#374151]"
      >
        {label}
      </label>
      <input
        id={id}
        className={`bg-input-bg border-2 border-border rounded-[10px] px-3.5 py-2.5 text-text outline-none focus:border-primary transition-colors ${className}`}
        {...props}
      />
      {error && <span className="text-sm text-error">{error}</span>}
    </div>
  );
}
