export function normalizePhone(input: string): string | null {
  const cleaned = input.replace(/[\s.-]/g, "");

  if (/^\+33[1-9]\d{8}$/.test(cleaned)) {
    return cleaned;
  }
  if (/^0[1-9]\d{8}$/.test(cleaned)) {
    return "+33" + cleaned.slice(1);
  }
  return null;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPostalCode(code: string): boolean {
  return /^\d{5}$/.test(code.trim());
}

export function isValidPassword(password: string): boolean {
  return (
    password.length >= 8 &&
    password.length <= 72 &&
    /[a-zA-Z]/.test(password) &&
    /\d/.test(password)
  );
}
