"use client";

import { StoreImage } from "@/components/store/StoreImage";
import { formatCOP } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types";
import { Check, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartQty = mounted
    ? (items.find((item) => item.product.id === product.id)?.quantity ?? 0)
    : 0;
  const isOutOfStock = !product.inStock || product.stockQuantity <= 0;
  const isMaxInCart = !isOutOfStock && cartQty >= product.stockQuantity;
  const isButtonDisabled = added || isOutOfStock || isMaxInCart;

  const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.price);

  const handleAddToCart = () => {
    if (isOutOfStock || isMaxInCart) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <article className="group bg-surface rounded-2xl border border-hairline overflow-hidden hover:border-ink/35 transition-colors flex flex-col">
      {/* Clean product photo without pill clutter */}
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-square w-full bg-surface-alt overflow-hidden block"
      >
        <StoreImage
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
        />

        {hasDiscount && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-surface/95 border border-hairline text-ink text-[11px] font-semibold tracking-wide">
            Oferta
          </span>
        )}
      </Link>

      {/* Product details */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-1.5">
          <p className="text-[11px] uppercase tracking-[0.14em] text-sand-text font-semibold">
            {product.categoryName} ·{" "}
            {product.waterproof ? "Acero 316L · Apto para agua" : product.material}
          </p>

          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="font-display text-xl font-semibold text-ink group-hover:text-ocean transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-sm text-ink-muted line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-4 border-t border-hairline flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-base font-semibold text-ink tabular-nums">
                {formatCOP(product.price)}
              </span>
              {hasDiscount && product.originalPrice && (
                <span className="text-xs text-ink-muted line-through tabular-nums">
                  {formatCOP(product.originalPrice)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-ink-muted">
              {product.inStock ? "Disponible" : "Agotado"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isButtonDisabled}
            className={`px-4 py-2.5 rounded-full font-semibold text-xs inline-flex items-center gap-1.5 transition-colors ${
              isOutOfStock || isMaxInCart
                ? "bg-surface-alt text-ink-muted cursor-not-allowed"
                : added
                  ? "bg-ocean text-canvas"
                  : "bg-ink text-canvas hover:bg-ocean"
            }`}
          >
            {isOutOfStock ? (
              "Sin stock"
            ) : isMaxInCart ? (
              "En máx. stock"
            ) : added ? (
              <>
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                Agregado
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                Agregar
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
