import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CartDrawer } from "@/components/store/CartDrawer";
import { CheckoutForm } from "@/components/store/CheckoutForm";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Finalizar pedido | Marea Travel",
  description:
    "Completa tu pedido de accesorios en acero inoxidable 316L con envío asegurado a toda Colombia.",
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-ocean selection:text-canvas">
      <Navbar />

      <main className="flex-1 py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8 sm:space-y-10">
        <header className="space-y-3 border-b border-hairline pb-6">
          <Link
            href="/#catalogo"
            className="inline-flex items-center gap-1.5 min-h-11 py-2 text-xs font-medium text-ink-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            Volver a la colección
          </Link>

          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-text">
              Checkout seguro
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink tracking-tight">
              Finalizar pedido
            </h1>
            <p className="text-sm text-ink-muted max-w-2xl">
              Envíos asegurados a toda Colombia. Accesorios en acero inoxidable 316L con garantía de
              por vida.
            </p>
          </div>
        </header>

        <CheckoutForm />
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
}
