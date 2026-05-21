import { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: readonly string[];
  placeholder?: string;
}

export function Select({
  label,
  options,
  placeholder,
  id,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="font-[family-name:var(--font-poppins)] text-sm font-medium text-[#374151]"
      >
        {label}
      </label>
      <select
        id={id}
        className={`bg-input-bg border-2 border-border rounded-[10px] px-3.5 py-2.5 text-text outline-none focus:border-primary transition-colors ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
