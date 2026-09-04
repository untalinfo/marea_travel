"use client";

import { formatCOP } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types";
import { Check, Droplets, ShieldCheck, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="group bg-marea-navy/80 rounded-2xl border border-marea-steel-blue/30 overflow-hidden hover:border-marea-sand/50 transition-all duration-300 hover:shadow-2xl hover:shadow-marea-sand/10 flex flex-col">
      {/* Image Container con enlace a detalle */}
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-square w-full bg-marea-navy-dark overflow-hidden block"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.waterproof && (
            <span className="badge-waterproof text-marea-sand text-[10px] font-semibold tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
              <Droplets className="w-3 h-3 text-cyan-400" /> WATERPROOF
            </span>
          )}
          {product.originalPrice && (
            <span className="bg-red-900/80 backdrop-blur-md text-red-200 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit">
              OFERTA
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 z-10">
          <span className="bg-marea-navy-dark/90 text-slate-300 text-[10px] font-mono px-2 py-1 rounded-md border border-marea-steel-blue/40">
            Acero 316L
          </span>
        </div>
      </Link>

      {/* Content Container */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-marea-sand uppercase">
            {product.categoryName}
          </span>
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-base font-semibold text-white mt-1 group-hover:text-marea-sand transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-marea-steel-blue/20 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-white font-mono">
                {formatCOP(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-500 line-through font-mono">
                  {formatCOP(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Garantía de por vida
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={added}
            className={`px-3.5 py-2.5 rounded-xl font-medium text-xs flex items-center gap-2 transition-all duration-200 shadow-md ${
              added
                ? "bg-emerald-600 text-white"
                : "bg-marea-sand hover:bg-marea-sand-hover text-marea-navy-dark font-bold hover:scale-105 active:scale-95"
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" /> ¡Agregado!
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Agregar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
