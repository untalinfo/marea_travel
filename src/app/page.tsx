import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CartDrawer } from "@/components/store/CartDrawer";
import { HeroBanner } from "@/components/store/HeroBanner";
import { ProductCatalog } from "@/components/store/ProductCatalog";
import { StoreImage } from "@/components/store/StoreImage";
import { STORY_IMAGE_SRC } from "@/lib/brand-assets";
import { getProducts } from "@/lib/supabase/db";
import { Droplets, ShieldCheck, Truck } from "lucide-react";

export const revalidate = 60; // ISR: revalidar catálogo cada 60 segundos

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-ocean selection:text-canvas">
      <Navbar />

      <main className="flex-1">
        <HeroBanner />

        <ProductCatalog initialProducts={products} />

        {/* Sección Materiales y Cuidado 316L */}
        <section
          id="materiales"
          className="py-16 sm:py-24 bg-surface-alt/60 border-y border-hairline"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              <div className="lg:col-span-6 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sand-text">
                  Materiales y cuidado
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink">
                  Por qué elegimos acero quirúrgico 316L
                </h2>
                <p className="text-sm sm:text-base text-ink-muted leading-relaxed max-w-xl">
                  A diferencia de la bisutería con baño metálico que se oscurece con la sal o la
                  humedad, el acero inoxidable 316L mantiene su acabado original frente al clima
                  costero, el sudor y el uso diario.
                </p>
              </div>

              <div className="lg:col-span-6">
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-hairline bg-surface">
                  <StoreImage
                    src={STORY_IMAGE_SRC}
                    alt="Detalle de accesorio Marea Travel en acero inoxidable 316L con gotas de agua"
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover object-center"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-hairline">
              <div className="bg-surface rounded-2xl border border-hairline p-6 space-y-2.5">
                <ShieldCheck className="w-5 h-5 text-ocean" aria-hidden="true" />
                <h3 className="font-display text-xl font-semibold text-ink">
                  Acero quirúrgico 316L
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed">
                  Aleación hipoalergénica libre de níquel reactivo, pensada para pieles sensibles y
                  uso continuo sin manchar la piel.
                </p>
              </div>

              <div className="bg-surface rounded-2xl border border-hairline p-6 space-y-2.5">
                <Droplets className="w-5 h-5 text-ocean" aria-hidden="true" />
                <h3 className="font-display text-xl font-semibold text-ink">
                  Apto para mar y piscina
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed">
                  Puedes entrar al mar, la piscina o la ducha sin quitarte tus piezas. Basta con
                  enjuagar con agua dulce después de la playa.
                </p>
              </div>

              <div className="bg-surface rounded-2xl border border-hairline p-6 space-y-2.5">
                <Truck className="w-5 h-5 text-ocean" aria-hidden="true" />
                <h3 className="font-display text-xl font-semibold text-ink">
                  Envíos nacionales (2–5 días)
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed">
                  Despachos a toda Colombia en empaque de viaje reutilizable para guardar tus
                  accesorios en cualquier trayecto.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Historia de Marca */}
        <section id="historia" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="bg-surface rounded-2xl border border-hairline p-8 sm:p-12 space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sand-text">
              Sobre Marea Travel
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink">
              Hecho para quienes viajan ligero y cerca del agua.
            </h2>
            <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
              Marea Travel nace en Colombia con una idea sencilla: diseñar accesorios sobrios y
              duraderos inspirados en el Caribe y el Pacífico, que puedas usar tanto en una caminata
              por la costa como en la rutina de ciudad.
            </p>
            <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
              Cada pieza se fabrica en acero inoxidable 316L para evitar reemplazos frecuentes y
              acompañar tus viajes año tras año.
            </p>
          </div>
        </section>
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
}
