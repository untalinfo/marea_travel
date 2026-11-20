import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CartDrawer } from "@/components/store/CartDrawer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel de administración",
  description: "Gestión interna de inventario, accesorios y fotografías de Marea Travel.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-ocean selection:text-canvas">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <AdminDashboard />
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
}
