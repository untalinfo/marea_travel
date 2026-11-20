import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CartDrawer } from "@/components/store/CartDrawer";
import { CheckoutForm } from "@/components/store/CheckoutForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout Seguro | Marea Travel",
  description:
    "Completá tu pedido de accesorios en Acero Inoxidable 316L con envío a toda Colombia.",
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-marea-navy-dark text-slate-100 flex flex-col font-sans selection:bg-marea-sand selection:text-marea-navy-dark">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Finalizar Compra <span className="gold-gradient-text">Segura</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Envíos asegurados a toda Colombia. Garantía de por vida en Acero 316L.
          </p>
        </div>

        <CheckoutForm />
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
}
