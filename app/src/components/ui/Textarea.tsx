import { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function Textarea({
  label,
  error,
  id,
  className = "",
  ...props
}: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="font-[family-name:var(--font-poppins)] text-sm font-medium text-[#374151]"
      >
        {label}
      </label>
      <textarea
        id={id}
        rows={4}
        className={`bg-input-bg border-2 border-border rounded-[10px] px-3.5 py-2.5 text-text outline-none focus:border-primary transition-colors resize-y ${className}`}
        {...props}
      />
      {error && <span className="text-sm text-error">{error}</span>}
    </div>
  );
}
