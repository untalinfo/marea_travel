"use client";
import { Compass, Droplets, MapPin, ShieldCheck } from "lucide-react";
import Image from "next/image";

export function HeroBanner() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-marea-navy-dark overflow-hidden py-20 px-4">
      {/* Background Image with Dark Blue Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80"
          alt="Marea Travel Ocean & Travel background"
          fill
          priority
          className="object-cover object-center opacity-25 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-marea-navy-dark via-marea-navy/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-marea-navy-dark/90 via-transparent to-marea-navy-dark/90" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-marea-navy/90 border border-marea-sand/40 text-marea-sand text-xs font-semibold tracking-wider uppercase backdrop-blur-md shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Compass className="w-4 h-4 text-marea-sand animate-spin-slow" />
          <span>Diseñados para Viajar & Resistir el Mar</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-none font-sans">
          Accesorios minimalistas <br />
          <span className="gold-gradient-text">a prueba de aventuras.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
          Piezas en{" "}
          <strong className="text-white font-medium">Acero Inoxidable 316L (Grado Marino)</strong>.
          Te acompañan en el mar, en el sudor de la montaña y en cada viaje sin perder su brillo
          jamás.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            href="#catalogo"
            className="w-full sm:w-auto px-8 py-4 bg-marea-sand hover:bg-marea-sand-hover text-marea-navy-dark font-extrabold text-sm rounded-2xl transition-all shadow-xl shadow-marea-sand/20 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <Compass className="w-5 h-5" /> Explorar Colección Marina
          </a>
          <a
            href="#historia"
            className="w-full sm:w-auto px-8 py-4 bg-marea-navy/80 hover:bg-marea-navy border border-marea-steel-blue/40 text-slate-200 font-semibold text-sm rounded-2xl transition-all backdrop-blur-md hover:border-marea-sand/50 flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4 text-marea-sand" /> Ver Historia (@oskarinfo)
          </a>
        </div>

        {/* Feature Badges */}
        <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto border-t border-marea-steel-blue/20 text-left">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-marea-navy/50 border border-marea-steel-blue/20">
            <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">100% Waterproof</h4>
              <p className="text-[11px] text-slate-400">Resiste agua salada y sudor</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-marea-navy/50 border border-marea-steel-blue/20">
            <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-marea-sand flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Acero Inoxidable 316L</h4>
              <p className="text-[11px] text-slate-400">No se oxida ni cambia de color</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-marea-navy/50 border border-marea-steel-blue/20">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Packaging de Viaje</h4>
              <p className="text-[11px] text-slate-400">Caja y pouch para llevar siempre</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
