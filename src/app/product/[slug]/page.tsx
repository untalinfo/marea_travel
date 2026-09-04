import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CartDrawer } from "@/components/store/CartDrawer";
import { ProductDetailView } from "@/components/store/ProductDetailView";
import { getProductBySlug, getProducts } from "@/lib/supabase/db";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Producto no encontrado | Marea Travel",
    };
  }

  return {
    title: `${product.name} | Marea Travel`,
    description: product.description,
    openGraph: {
      title: `${product.name} - Acero Inoxidable 316L Waterproof`,
      description: product.description,
      images: [
        {
          url: product.images[0],
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const relatedProducts = allProducts.filter((p) => p.id !== product.id);

  return (
    <div className="min-h-screen bg-marea-navy-dark text-slate-100 flex flex-col font-sans selection:bg-marea-sand selection:text-marea-navy-dark">
      <Navbar />

      <main className="flex-1">
        <ProductDetailView product={product} relatedProducts={relatedProducts} />
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
}
