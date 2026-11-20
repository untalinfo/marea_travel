"use client";

import { StoreImage } from "@/components/store/StoreImage";
import { HAS_WHATSAPP_NUMBER, WHATSAPP_NUMBER } from "@/lib/brand-assets";
import { formatCOP } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types";
import { ArrowLeft, Check, Copy, MessageCircle, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailView({ product, relatedProducts }: ProductDetailViewProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [mounted, setMounted] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart);
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartQty = mounted
    ? (items.find((item) => item.product.id === product.id)?.quantity ?? 0)
    : 0;
  const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.price);
  const isOutOfStock = !product.inStock || product.stockQuantity <= 0;
  const remainingStock = Math.max(0, product.stockQuantity - cartQty);
  const isMaxInCart = !isOutOfStock && remainingStock === 0;
  const maxSelectableQuantity = Math.max(1, remainingStock);
  const clampedQuantity = Math.min(Math.max(1, quantity), maxSelectableQuantity);

  useEffect(() => {
    setQuantity((q) => Math.min(Math.max(1, q), maxSelectableQuantity));
  }, [maxSelectableQuantity]);

  const imageOccurrenceMap = new Map<string, number>();
  const galleryImages = product.images.map((src) => {
    const count = (imageOccurrenceMap.get(src) ?? 0) + 1;
    imageOccurrenceMap.set(src, count);
    return {
      src,
      key: count === 1 ? src : `${src}#${count}`,
    };
  });

  const buildOrderMessage = () =>
    `Hola, Marea Travel. Quiero confirmar disponibilidad para este producto:\n\n• Producto: ${product.name}\n• Cantidad: ${clampedQuantity}\n• Valor unitario: ${formatCOP(product.price)}\n• Total: ${formatCOP(product.price * clampedQuantity)}\n\nQuedo atento para coordinar el envío en Colombia.`;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildOrderMessage())}`;

  const handleAddToCart = () => {
    if (isOutOfStock || isMaxInCart) return;
    addToCart(product, clampedQuantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(buildOrderMessage());
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    } catch {
      setCopiedSummary(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16">
      {/* Breadcrumb */}
      <div>
        <Link
          href="/#catalogo"
          className="inline-flex items-center gap-2 text-xs font-semibold text-ink-muted hover:text-ink transition-colors group"
        >
          <ArrowLeft
            className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          Volver a la colección
        </Link>
      </div>

      {/* Main 2-column detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-surface-alt border border-hairline">
            <StoreImage
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover object-center"
            />

            {hasDiscount && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-surface/95 border border-hairline text-ink text-xs font-semibold">
                Oferta
              </span>
            )}
          </div>

          {galleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {galleryImages.map((item, idx) => {
                const isSelected = selectedImageIndex === idx;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    aria-label={`Ver imagen ${idx + 1} de ${product.name}`}
                    aria-current={isSelected ? "true" : undefined}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-colors ${
                      isSelected ? "border-ink" : "border-hairline opacity-75 hover:opacity-100"
                    }`}
                  >
                    <StoreImage
                      src={item.src}
                      alt={`${product.name} — vista ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Info & Purchase */}
        <div className="lg:col-span-6 space-y-7">
          <div className="space-y-2 border-b border-hairline pb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sand-text">
              {product.categoryName}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 pt-2 flex-wrap">
              <span className="text-2xl sm:text-3xl font-semibold text-ink tabular-nums">
                {formatCOP(product.price)}
              </span>
              {hasDiscount && product.originalPrice && (
                <span className="text-base text-ink-muted line-through tabular-nums">
                  {formatCOP(product.originalPrice)}
                </span>
              )}
            </div>

            <p className="text-xs font-medium text-ocean pt-1">
              {product.inStock ? "Disponible para envío en Colombia" : "Temporalmente agotado"}
            </p>
          </div>

          <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
            {product.description}
          </p>

          {/* Quantity & Actions */}
          <div className="space-y-4 pt-2 border-t border-hairline">
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs font-semibold text-ink uppercase tracking-wider">
                Cantidad
              </span>
              <div className="inline-flex items-center border border-control-border rounded-full bg-surface">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={isOutOfStock || isMaxInCart || clampedQuantity <= 1}
                  aria-label="Disminuir cantidad"
                  className="p-2.5 text-ink-muted hover:text-ink transition-colors rounded-l-full disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" aria-hidden="true" />
                </button>
                <span className="px-4 text-sm font-semibold tabular-nums text-ink">
                  {clampedQuantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(maxSelectableQuantity, q + 1))}
                  disabled={isOutOfStock || isMaxInCart || clampedQuantity >= remainingStock}
                  aria-label="Aumentar cantidad"
                  className="p-2.5 text-ink-muted hover:text-ink transition-colors rounded-r-full disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={added || isOutOfStock || isMaxInCart}
                className={`flex-1 py-3.5 px-6 rounded-full font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors ${
                  isOutOfStock || isMaxInCart
                    ? "bg-surface-alt text-ink-muted cursor-not-allowed"
                    : added
                      ? "bg-ocean text-canvas"
                      : "bg-ink text-canvas hover:bg-ocean"
                }`}
              >
                {isOutOfStock ? (
                  "Agotado"
                ) : isMaxInCart ? (
                  "En máx. stock"
                ) : added ? (
                  <>
                    <Check className="w-4 h-4" aria-hidden="true" />
                    Agregado al carrito
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                    Agregar al carrito
                  </>
                )}
              </button>

              {HAS_WHATSAPP_NUMBER ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-6 rounded-full border border-ink text-ink hover:bg-surface-alt font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  Pedir por WhatsApp
                </a>
              ) : (
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="py-3.5 px-6 rounded-full border border-ink text-ink hover:bg-surface-alt font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <Copy className="w-4 h-4" aria-hidden="true" />
                  {copiedSummary ? "Resumen copiado" : "Copiar resumen"}
                </button>
              )}
            </div>

            {!HAS_WHATSAPP_NUMBER && (
              <output className="block text-xs text-ink-muted" aria-live="polite">
                {copiedSummary
                  ? "Resumen copiado al portapapeles."
                  : "Configura NEXT_PUBLIC_WHATSAPP_NUMBER para habilitar el enlace directo a WhatsApp."}
              </output>
            )}
          </div>

          {/* Scannable Specs */}
          <div className="border-t border-hairline pt-6 space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-sand-text">
              Especificaciones de la pieza
            </h2>
            <dl className="divide-y divide-hairline text-sm border-y border-hairline">
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-ink-muted">Material</dt>
                <dd className="font-medium text-ink text-end">{product.material}</dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-ink-muted">Resistencia al agua</dt>
                <dd className="font-medium text-ink text-end">
                  {product.waterproof ? "Apto para mar, piscina y ducha" : "Uso diario"}
                </dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-ink-muted">Garantía</dt>
                <dd className="font-medium text-ink text-end">
                  Por cambio de color o defectos de fabricación
                </dd>
              </div>
              <div className="py-3 flex justify-between gap-4">
                <dt className="text-ink-muted">Envío en Colombia</dt>
                <dd className="font-medium text-ink text-end">
                  2 a 5 días hábiles · Gratis desde $120.000 COP
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-hairline pt-14 space-y-8">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sand-text">
              Completa tu combinación
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
              Otras piezas en acero 316L
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.slice(0, 3).map((rel) => (
              <Link
                key={rel.id}
                href={`/product/${rel.slug}`}
                className="group bg-surface rounded-2xl border border-hairline hover:border-ink/40 transition-colors p-4 flex gap-4 items-center"
              >
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-surface-alt shrink-0 border border-hairline">
                  <StoreImage
                    src={rel.images[0]}
                    alt={rel.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-[11px] uppercase tracking-wider text-sand-text font-semibold">
                    {rel.categoryName}
                  </p>
                  <h3 className="font-display text-lg font-semibold text-ink truncate group-hover:text-ocean transition-colors">
                    {rel.name}
                  </h3>
                  <p className="text-xs font-semibold text-ink-muted tabular-nums">
                    {formatCOP(rel.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
