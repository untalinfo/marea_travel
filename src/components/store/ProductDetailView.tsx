"use client";

import { formatCOP } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Compass,
  Droplets,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailView({ product, relatedProducts }: ProductDetailViewProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const generateWhatsAppLink = () => {
    const phone = "573000000000"; // Reemplazar con el número oficial de Marea Travel
    const message = `*¡Hola Marea Travel! 🌊*\nMe interesa comprar:\n\n*Producto:* ${product.name}\n*Cantidad:* ${quantity}\n*Precio Unitario:* ${formatCOP(product.price)}\n*Total:* ${formatCOP(product.price * quantity)}\n\n¿Tienen disponibilidad para envío en Colombia? ¡Muchas gracias!`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumb / Back Link */}
      <div>
        <Link
          href="/#catalogo"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-marea-sand transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Volver a la Colección Marina
        </Link>
      </div>

      {/* Grid de Detalle Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Galería de Imágenes */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-marea-navy border border-marea-steel-blue/30 shadow-2xl">
            <Image
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center transition-all duration-500"
            />

            {/* Badges Superiores */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {product.waterproof && (
                <span className="badge-waterproof text-marea-sand text-xs font-semibold tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" /> 100% WATERPROOF
                </span>
              )}
              {product.originalPrice && (
                <span className="bg-red-900/90 backdrop-blur-md text-red-200 text-xs font-bold px-2.5 py-1 rounded-full w-fit">
                  OFERTA ESPECIAL
                </span>
              )}
            </div>

            <div className="absolute top-4 right-4 z-10">
              <span className="bg-marea-navy-dark/90 text-slate-300 text-xs font-mono px-3 py-1.5 rounded-lg border border-marea-steel-blue/40 shadow-md">
                Acero 316L
              </span>
            </div>
          </div>

          {/* Miniaturas si hay más de 1 imagen */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    selectedImageIndex === idx
                      ? "border-marea-sand scale-105 shadow-lg shadow-marea-sand/20"
                      : "border-marea-steel-blue/40 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Miniatura ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información y Compra */}
        <div className="space-y-8">
          {/* Categoría y Título */}
          <div className="space-y-2 border-b border-marea-steel-blue/20 pb-6">
            <span className="text-xs font-mono tracking-widest text-marea-sand uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-marea-sand" />
              {product.categoryName}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {product.name}
            </h1>

            {/* Precios */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-extrabold text-white font-mono gold-gradient-text">
                {formatCOP(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-base text-slate-500 line-through font-mono">
                  {formatCOP(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Diseño & Esencia de Viaje
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">{product.description}</p>
          </div>

          {/* Badges Rápidos */}
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-marea-navy border border-marea-steel-blue/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Garantía de por vida</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-marea-navy border border-marea-steel-blue/30">
              <Truck className="w-4 h-4 text-marea-sand flex-shrink-0" />
              <span>Envíos a toda Colombia</span>
            </div>
          </div>

          {/* Selector de Cantidad y Acciones */}
          <div className="space-y-4 pt-4 border-t border-marea-steel-blue/20">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-slate-300">Cantidad:</span>
              <div className="flex items-center border border-marea-steel-blue/40 rounded-xl bg-marea-navy">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 text-slate-400 hover:text-white transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold font-mono text-white">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 text-slate-400 hover:text-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Botones de Compra */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={added}
                className={`flex-1 py-4 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl ${
                  added
                    ? "bg-emerald-600 text-white"
                    : "bg-marea-sand hover:bg-marea-sand-hover text-marea-navy-dark hover:scale-[1.02] active:scale-[0.98] shadow-marea-sand/20"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" /> ¡Agregado al Carrito!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" /> Agregar al Carrito
                  </>
                )}
              </button>

              <a
                href={generateWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-emerald-600/20"
              >
                <MessageCircle className="w-5 h-5" /> Pedir por WhatsApp
              </a>
            </div>
          </div>

          {/* Ficha Técnica / Accordion de Beneficios */}
          <div className="border-t border-marea-steel-blue/20 pt-6 space-y-4">
            <h4 className="text-xs font-bold text-marea-sand uppercase tracking-wider">
              ¿Por qué elegir esta pieza Marea Travel?
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Acero Inoxidable 316L:</strong> El mismo material usado en buceo y
                  relojería marina de alta gama.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Hipoalergénico total:</strong> Diseñado para pieles sensibles sin causar
                  manchas verdes ni picazón.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Packaging de viaje incluido:</strong> Se entrega con caja y bolsita de
                  protección para mochileros y viajeros.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Selling / Productos Relacionados */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-marea-steel-blue/20 pt-16 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono tracking-widest text-marea-sand uppercase flex items-center justify-center gap-1.5">
              <Compass className="w-4 h-4" /> Completá tu set
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Otras piezas para tu próxima aventura
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.slice(0, 3).map((rel) => (
              <div
                key={rel.id}
                className="group bg-marea-navy/60 rounded-2xl border border-marea-steel-blue/30 overflow-hidden hover:border-marea-sand/40 transition-all p-4 flex gap-4 items-center"
              >
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-marea-navy-dark flex-shrink-0">
                  <Image
                    src={rel.images[0]}
                    alt={rel.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-mono text-marea-sand uppercase">
                    {rel.categoryName}
                  </span>
                  <h4 className="text-sm font-semibold text-white truncate group-hover:text-marea-sand transition-colors">
                    {rel.name}
                  </h4>
                  <p className="text-xs font-mono text-slate-300 mt-0.5">{formatCOP(rel.price)}</p>
                  <Link
                    href={`/product/${rel.slug}`}
                    className="inline-flex items-center gap-1 text-[11px] text-marea-sand font-bold mt-1.5 hover:underline"
                  >
                    Ver detalles →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
