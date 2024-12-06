import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateCode() {
  const code = Array.from(
    { length: 6 },
    () => '1234567890abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 36)]
  ).join('')

  return code
}
