"use client";

import { useCartStore } from "@/store/cartStore";
import { Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/#catalogo", label: "Colección" },
  { href: "/#materiales", label: "Acero 316L" },
  { href: "/#historia", label: "Historia" },
] as const;

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const { openCart, getTotalItems } = useCartStore();
  const totalItems = mounted ? getTotalItems() : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full bg-canvas/95 backdrop-blur-sm border-b border-hairline">
      {/* Compact single-line announcement bar */}
      <div className="bg-ink text-canvas text-xs py-2 px-4">
        <p className="max-w-7xl mx-auto text-center tracking-wide truncate">
          Envíos a toda Colombia · Envío gratis desde $120.000 COP
        </p>
      </div>

      <nav aria-label="Navegación principal" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3.5 gap-4">
          {/* Brand wordmark */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <img
              src="/images/marea-mark.svg"
              alt=""
              width={36}
              height={36}
              aria-hidden="true"
              className="w-9 h-9 rounded-full"
            />
            <span className="font-display text-xl sm:text-2xl font-semibold tracking-[0.12em] text-ink uppercase">
              Marea Travel
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-7 text-sm font-medium text-ink-muted">
            {NAV_LINKS.map((item) => {
              const isCurrent = item.href === "/" && pathname === "/";
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isCurrent ? "page" : undefined}
                    className={`py-1.5 transition-colors border-b-2 ${
                      isCurrent
                        ? "text-ink border-sand font-semibold"
                        : "border-transparent hover:text-ink hover:border-hairline"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              data-cart-trigger
              onClick={openCart}
              aria-label={
                totalItems > 0
                  ? `Abrir carrito de compras (${totalItems} productos)`
                  : "Abrir carrito de compras"
              }
              className="relative inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-surface border border-control-border text-ink hover:border-ink transition-colors text-xs font-semibold"
            >
              <ShoppingBag className="w-4 h-4 text-ocean" aria-hidden="true" />
              <span className="hidden sm:inline">Carrito</span>
              {mounted && totalItems > 0 && (
                <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-ocean text-canvas text-[11px] font-bold tabular-nums">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={mobileMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
              className="md:hidden inline-flex items-center justify-center p-2.5 rounded-full border border-control-border bg-surface text-ink hover:border-ink transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile drawer list (same single <nav> landmark) */}
        {mobileMenuOpen && (
          <ul
            id="mobile-nav-menu"
            className="md:hidden border-t border-hairline py-4 space-y-1 bg-canvas"
          >
            {NAV_LINKS.map((item) => {
              const isCurrent = item.href === "/" && pathname === "/";
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isCurrent ? "page" : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isCurrent
                        ? "bg-surface text-ink font-semibold border border-hairline"
                        : "text-ink-muted hover:text-ink hover:bg-surface-alt/70"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </nav>
    </header>
  );
}
