"use client";

import { ProductCard } from "@/components/store/ProductCard";
import type { Product } from "@/types";
import { useMemo, useState } from "react";

interface ProductCatalogProps {
  initialProducts: Product[];
}

export function ProductCatalog({ initialProducts }: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("todas");

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    for (const product of initialProducts) {
      if (product.category && !map.has(product.category)) {
        map.set(product.category, product.categoryName || product.category);
      }
    }

    return [
      { id: "todas", label: "Todas las piezas" },
      ...Array.from(map.entries()).map(([id, label]) => ({ id, label })),
    ];
  }, [initialProducts]);

  const filteredProducts =
    selectedCategory === "todas"
      ? initialProducts
      : initialProducts.filter((p) => p.category === selectedCategory);

  return (
    <section id="catalogo" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-hairline">
        <div className="space-y-3 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sand-text">
            Catálogo Marea Travel
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink">
            Piezas esenciales para llevar siempre puestas
          </h2>
          <p className="text-sm sm:text-base text-ink-muted">
            Selección en acero inoxidable 316L pensada para la playa, la ciudad y cada trayecto.
          </p>
        </div>

        {/* Category Filter */}
        <search aria-label="Filtrar colección por categoría" className="w-full md:w-auto">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors border ${
                    isSelected
                      ? "bg-ink text-canvas border-ink"
                      : "bg-surface text-ink-muted border-control-border hover:border-ink hover:text-ink"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </search>
      </div>

      {/* Product grid or clean empty state */}
      {filteredProducts.length === 0 ? (
        initialProducts.length === 0 && selectedCategory === "todas" ? (
          <div className="py-16 text-center space-y-4 bg-surface rounded-2xl border border-hairline mt-10 px-6">
            <p className="font-display text-2xl font-semibold text-ink">
              El catálogo está actualizándose en este momento.
            </p>
            <p className="text-sm text-ink-muted max-w-md mx-auto">
              Muy pronto verás nuestras piezas disponibles en acero inoxidable 316L para envío en
              Colombia.
            </p>
          </div>
        ) : (
          <div className="py-16 text-center space-y-4 bg-surface rounded-2xl border border-hairline mt-10 px-6">
            <p className="font-display text-2xl font-semibold text-ink">
              No encontramos piezas en esta categoría
            </p>
            <p className="text-sm text-ink-muted max-w-md mx-auto">
              Explora el catálogo completo para ver los accesorios disponibles en acero inoxidable
              316L.
            </p>
            {selectedCategory !== "todas" && (
              <button
                type="button"
                onClick={() => setSelectedCategory("todas")}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-ink text-canvas text-xs font-semibold hover:bg-ocean transition-colors"
              >
                Ver toda la colección
              </button>
            )}
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-10">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
