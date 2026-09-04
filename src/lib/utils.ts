import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatea valores numéricos a Pesos Colombianos (COP) de manera 100% determinista
 * entre el servidor (SSR) y el navegador (Cliente), evitando errores de hidratación.
 * Ej: 79000 -> "$ 79.000 COP"
 */
export function formatCOP(amount: number): string {
  const rounded = Math.round(amount);
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `$ ${formatted} COP`;
}
