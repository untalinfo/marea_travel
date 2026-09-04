"use client";

import { useCartStore } from "@/store/cartStore";
import { Compass, Menu, ShieldCheck, ShoppingBag, Truck, Waves, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { openCart, getTotalItems } = useCartStore();
  const totalItems = mounted ? getTotalItems() : 0;

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Banner de Envíos & Garantía */}
      <div className="bg-marea-navy-dark text-slate-300 text-xs py-2 px-4 border-b border-marea-steel-blue/20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 text-marea-sand" />
            <span>Envíos a toda Colombia | PSE, Nequi y Tarjetas</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-marea-sand" /> Acero Inoxidable 316L (Resistente
              al agua de mar)
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`w-full transition-all duration-300 border-b ${
          isScrolled
            ? "bg-marea-navy/95 backdrop-blur-md border-marea-steel-blue/30 py-3 shadow-xl"
            : "bg-marea-navy border-marea-steel-blue/20 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-marea-navy-light to-marea-steel-blue/40 border border-marea-sand/40 flex items-center justify-center text-marea-sand transition-transform group-hover:scale-105 shadow-md">
              <Waves className="w-5 h-5 text-marea-sand" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-wider text-white flex items-center gap-1.5 font-sans">
                MAREA <span className="gold-gradient-text">TRAVEL</span>
              </span>
              <span className="text-[10px] tracking-widest text-slate-400 font-mono uppercase">
                Waterproof Accessories
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <Link
              href="/"
              className="hover:text-marea-sand transition-colors py-1 border-b-2 border-transparent hover:border-marea-sand"
            >
              Inicio
            </Link>
            <Link
              href="#catalogo"
              className="hover:text-marea-sand transition-colors py-1 border-b-2 border-transparent hover:border-marea-sand flex items-center gap-1"
            >
              <Compass className="w-4 h-4 text-marea-sand" />
              Colección Marina
            </Link>
            <Link
              href="#garantia"
              className="hover:text-marea-sand transition-colors py-1 border-b-2 border-transparent hover:border-marea-sand"
            >
              Acero 316L
            </Link>
            <Link
              href="#historia"
              className="hover:text-marea-sand transition-colors py-1 border-b-2 border-transparent hover:border-marea-sand"
            >
              Historia (@oskarinfo)
            </Link>
          </div>

          {/* Actions & Cart Icon */}
          <div className="flex items-center gap-4">
            <button
              onClick={openCart}
              className="relative p-2.5 text-slate-200 hover:text-marea-sand bg-marea-navy-light/60 hover:bg-marea-navy-light border border-marea-steel-blue/30 rounded-full transition-all flex items-center justify-center group"
              aria-label="Ver Carrito de Compras"
            >
              <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-marea-sand text-marea-navy-dark text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white"
              aria-label="Abrir Menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-marea-navy-dark border-b border-marea-steel-blue/30 px-4 pt-4 pb-6 space-y-3 mt-3 animate-in slide-in-from-top duration-200">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-marea-navy-light hover:text-marea-sand"
            >
              Inicio
            </Link>
            <Link
              href="#catalogo"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-marea-navy-light hover:text-marea-sand"
            >
              Colección Marina & Accesorios
            </Link>
            <Link
              href="#garantia"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-marea-navy-light hover:text-marea-sand"
            >
              Garantía Acero 316L (Waterproof)
            </Link>
            <Link
              href="#historia"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-marea-navy-light hover:text-marea-sand"
            >
              Nuestra Historia (@oskarinfo)
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
