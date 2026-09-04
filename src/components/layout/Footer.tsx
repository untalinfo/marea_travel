"use client";
import { Heart, MapPin, Waves } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer
      suppressHydrationWarning
      className="bg-marea-navy-dark text-slate-400 border-t border-marea-steel-blue/20 pt-16 pb-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-marea-steel-blue/20">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-marea-navy-light border border-marea-sand/40 flex items-center justify-center text-marea-sand">
                <Waves className="w-5 h-5 text-marea-sand" />
              </div>
              <span className="font-bold text-xl tracking-wider text-white">
                MAREA <span className="gold-gradient-text">TRAVEL</span>
              </span>
            </Link>

            <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
              Accesorios minimalistas en Acero Inoxidable 316L creados para apasionados por los
              viajes, el mar y la libertad. Diseñados para resistir cualquier agua y aventura.
            </p>

            {/* Founder Note */}
            <div className="p-4 rounded-xl bg-marea-navy border border-marea-steel-blue/30 text-xs space-y-2 max-w-md">
              <div className="flex items-center gap-2 text-marea-sand font-bold">
                <MapPin className="w-4 h-4" /> Impulsado por @oskarinfo
              </div>
              <p className="text-slate-300">
                &ldquo;Soy desarrollador web y viajero. Creé Marea Travel buscando accesorios que no
                tuviera que quitarme jamás, ni al meterme al mar ni al subir una montaña.&rdquo;
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Navegación
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="#catalogo" className="hover:text-marea-sand transition-colors">
                  Colección Marina
                </Link>
              </li>
              <li>
                <Link href="#garantia" className="hover:text-marea-sand transition-colors">
                  Garantía Acero 316L
                </Link>
              </li>
              <li>
                <Link href="#historia" className="hover:text-marea-sand transition-colors">
                  Historia de Marca
                </Link>
              </li>
              <li>
                <a
                  href="https://instagram.com/oskarinfo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-marea-sand transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4 text-marea-sand fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  @oskarinfo
                </a>
              </li>
            </ul>
          </div>

          {/* Payment Methods Colombia */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Formas de Pago en Colombia
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Aceptamos los principales medios de pago seguros:
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 bg-marea-navy border border-marea-steel-blue/30 rounded-md text-slate-200 font-mono">
                PSE
              </span>
              <span className="px-2.5 py-1 bg-marea-navy border border-marea-steel-blue/30 rounded-md text-slate-200 font-mono">
                Nequi
              </span>
              <span className="px-2.5 py-1 bg-marea-navy border border-marea-steel-blue/30 rounded-md text-slate-200 font-mono">
                Daviplata
              </span>
              <span className="px-2.5 py-1 bg-marea-navy border border-marea-steel-blue/30 rounded-md text-slate-200 font-mono">
                Mercado Pago
              </span>
              <span className="px-2.5 py-1 bg-marea-navy border border-marea-steel-blue/30 rounded-md text-slate-200 font-mono">
                Tarjetas Crédito/Débito
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Marea Travel Co. Todos los derechos reservados.</p>
          <div className="flex items-center gap-1">
            <span>Hecho con</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>por @oskarinfo para viajeros del mundo.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
