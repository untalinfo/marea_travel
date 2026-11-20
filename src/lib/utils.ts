/**
 * Formatea valores numéricos a Pesos Colombianos (COP) de manera determinista
 * entre servidor (SSR) y navegador (Cliente), evitando diferencias de hidratación.
 * Ej: 79000 -> "$ 79.000 COP"
 */
export function formatCOP(amount: number): string {
  const rounded = Math.round(amount);
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `$ ${formatted} COP`;
}
