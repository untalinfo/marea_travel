"use client";

import { ProductCard } from "@/components/store/ProductCard";
import type { Product } from "@/types";
import { Sparkles } from "lucide-react";
import { useState } from "react";

interface ProductCatalogProps {
  initialProducts: Product[];
}

export function ProductCatalog({ initialProducts }: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("todas");

  const categories: { id: string; label: string }[] = [
    { id: "todas", label: "Todos los Accesorios" },
    { id: "coleccion-marina", label: "🌊 Colección Marina" },
    { id: "cadenas", label: "Cadenas Minimalistas" },
    { id: "pulseras", label: "Pulseras" },
    { id: "anillos", label: "Anillos del Viajero" },
  ];

  const filteredProducts =
    selectedCategory === "todas"
      ? initialProducts
      : initialProducts.filter((p) => p.category === selectedCategory);

  return (
    <section id="catalogo" className="py-20 px-4 max-w-7xl mx-auto space-y-12">
      {/* Header del Catálogo */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-mono tracking-widest text-marea-sand uppercase flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-marea-sand" /> MVP Curado • Edición Limitada
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
          Colección <span className="gold-gradient-text">Marea Travel</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base">
          Piezas en Acero Inoxidable 316L. Diseñadas para llevar puestas en el mar, en tus viajes y
          todos los días.
        </p>
      </div>

      {/* Categorías Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
              selectedCategory === cat.id
                ? "bg-marea-sand text-marea-navy-dark border-marea-sand shadow-lg shadow-marea-sand/20 scale-105 font-bold"
                : "bg-marea-navy text-slate-300 border-marea-steel-blue/30 hover:border-marea-sand/40 hover:text-white"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid de Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
