import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CartDrawer } from "@/components/store/CartDrawer";
import { HeroBanner } from "@/components/store/HeroBanner";
import { ProductCatalog } from "@/components/store/ProductCatalog";
import { getProducts } from "@/lib/supabase/db";
import { CheckCircle2, Compass, Droplets, ShieldCheck } from "lucide-react";

export const revalidate = 60; // ISR: revalidar catálogo cada 60 segundos

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-marea-navy-dark text-slate-100 flex flex-col font-sans selection:bg-marea-sand selection:text-marea-navy-dark">
      {/* Global Navbar */}
      <Navbar />

      {/* Hero Banner */}
      <main suppressHydrationWarning className="flex-1">
        <HeroBanner />

        {/* Catálogo con datos de Supabase + filtro interactivo */}
        <ProductCatalog initialProducts={products} />

        {/* Sección Garantía del Acero 316L */}
        <section id="garantia" className="py-20 bg-marea-navy border-y border-marea-steel-blue/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="text-xs font-mono tracking-widest text-marea-sand uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-marea-sand" /> Material Grado Marino
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                  ¿Por qué solo usamos <br />
                  <span className="gold-gradient-text">Acero Inoxidable 316L?</span>
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  A diferencia de la bisutería tradicional o la plata que se oscurece con la sal del
                  mar o el sudor, el <strong>Acero 316L</strong> es la aleación usada en
                  instrumental quirúrgico y relojes de buceo profesional.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-marea-sand flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        100% Resistente al Agua (Waterproof)
                      </h4>
                      <p className="text-xs text-slate-400">
                        Bañate en el mar, turco, ducha o piscina sin quitártelo.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-marea-sand flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Hipoalergénico</h4>
                      <p className="text-xs text-slate-400">
                        No causa irritaciones ni alergias en pieles sensibles.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-marea-sand flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Cero Mantenimiento</h4>
                      <p className="text-xs text-slate-400">
                        No requiere químicos para brillar ni pierde su color original.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Card */}
              <div className="relative rounded-3xl overflow-hidden border border-marea-sand/30 shadow-2xl bg-marea-navy-dark p-8 space-y-6">
                <div className="absolute top-0 right-0 w-48 h-48 bg-marea-sand/10 rounded-full blur-3xl" />
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-marea-sand/20 border border-marea-sand/50 flex items-center justify-center text-marea-sand">
                    <Droplets className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Test de Resistencia Marina</h3>
                    <p className="text-xs text-marea-sand font-mono">
                      Certificación 316L Sea-Grade
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-300 border-t border-marea-steel-blue/30 pt-4">
                  <div className="flex justify-between py-1 border-b border-marea-steel-blue/20">
                    <span>Resistencia a la Salinidad</span>
                    <span className="font-bold text-emerald-400">Excelente (100%)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-marea-steel-blue/20">
                    <span>Resistencia al Sudor / Deporte</span>
                    <span className="font-bold text-emerald-400">Excelente (100%)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Durabilidad en Viajes Extremos</span>
                    <span className="font-bold text-marea-sand">Garantía de por vida</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección Historia de Marca (@oskarinfo) */}
        <section id="historia" className="py-20 px-4 max-w-5xl mx-auto text-center space-y-8">
          <div className="w-16 h-16 rounded-full bg-marea-navy border border-marea-sand/40 flex items-center justify-center text-marea-sand mx-auto shadow-xl">
            <Compass className="w-8 h-8 text-marea-sand" />
          </div>

          <div className="space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-mono tracking-widest text-marea-sand uppercase">
              Detrás de Marea Travel
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              De un desarrollador viajero para amantes del mar.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Hola, soy <strong>@oskarinfo</strong>. Como desarrollador web y apasionado por
              explorar nuevos destinos, siempre busqué accesorios que reflejaran mi conexión con el
              océano y que resistieran el ritmo de viajar sin arruinarse con el agua salada.
            </p>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              <strong>Marea Travel</strong> nació para crear piezas minimalistas de alta durabilidad
              que podés llevar puestas en la playa, en una reunión de código o en un avión hacia tu
              próximo destino.
            </p>
          </div>

          <div className="pt-4">
            <a
              href="https://instagram.com/oskarinfo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-marea-navy hover:bg-marea-navy-light border border-marea-sand/40 text-marea-sand rounded-xl font-medium text-xs transition-all hover:scale-105"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <title>Instagram @oskarinfo</title>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>{" "}
              Seguir la aventura en @oskarinfo
            </a>
          </div>
        </section>
      </main>

      {/* Global Shopping Cart Side Drawer */}
      <CartDrawer />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
