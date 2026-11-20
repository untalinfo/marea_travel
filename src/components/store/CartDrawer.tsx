"use client";

import { StoreImage } from "@/components/store/StoreImage";
import {
  FREE_SHIPPING_THRESHOLD_COP,
  HAS_WHATSAPP_NUMBER,
  WHATSAPP_NUMBER,
} from "@/lib/brand-assets";
import { formatCOP } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { ArrowRight, Copy, MessageCircle, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, getTotalPrice, clearCart } =
    useCartStore();

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const totalPrice = getTotalPrice();

  // Sync Zustand open state with native <dialog>.showModal()
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const handleDialogClose = useCallback(() => {
    closeCart();

    const active = document.activeElement;
    const dialog = dialogRef.current;
    const focusLost =
      !active ||
      active === document.body ||
      active === document.documentElement ||
      !active.isConnected ||
      Boolean(dialog?.contains(active));

    if (focusLost) {
      const fallbackTrigger = document.querySelector<HTMLElement>("[data-cart-trigger]");
      if (
        fallbackTrigger &&
        !(fallbackTrigger instanceof HTMLButtonElement && fallbackTrigger.disabled)
      ) {
        fallbackTrigger.focus();
      }
    }
  }, [closeCart]);

  // Fallback light-dismiss for browsers without `closedBy` support (e.g. Safari)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if ("closedBy" in HTMLDialogElement.prototype) return;

    const handleBackdropClick = (event: MouseEvent) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isDialogContent =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (isDialogContent) return;
      dialog.close();
    };

    dialog.addEventListener("click", handleBackdropClick);
    return () => dialog.removeEventListener("click", handleBackdropClick);
  }, []);

  const buildOrderMessage = () => {
    let message = "Hola, Marea Travel. Quiero confirmar el siguiente pedido:\n\n";
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.product.name} x${item.quantity} = ${formatCOP(
        item.product.price * item.quantity,
      )}\n`;
    });
    message += `\nTotal: ${formatCOP(totalPrice)}\n`;
    message +=
      "Medio de pago preferido: Nequi / Daviplata / Bancolombia / Contra entrega.\nQuedo atento para coordinar el envío en Colombia.";
    return message;
  };

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildOrderMessage())}`;

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
    <dialog
      ref={dialogRef}
      {...({ closedby: "any" } as Record<string, string>)}
      aria-labelledby="cart-dialog-title"
      onClose={handleDialogClose}
      className="m-0 ml-auto h-dvh max-h-dvh w-full max-w-md bg-surface text-ink border-l border-hairline p-0 shadow-2xl open:flex flex-col"
    >
      <div className="flex flex-col h-full w-full">
        {/* Header */}
        <div className="px-5 py-4 border-b border-hairline flex items-center justify-between gap-3 bg-canvas">
          <div className="flex items-center gap-2.5 min-w-0">
            <ShoppingBag className="w-5 h-5 text-ocean shrink-0" aria-hidden="true" />
            <h2 id="cart-dialog-title" className="font-display text-xl font-semibold text-ink">
              Tu carrito
            </h2>
            <span className="text-xs bg-surface border border-hairline text-ink-muted px-2.5 py-0.5 rounded-full tabular-nums">
              {items.length} {items.length === 1 ? "pieza" : "piezas"}
            </span>
          </div>

          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="p-2 rounded-full text-ink-muted hover:text-ink hover:bg-surface-alt transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-surface">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12 px-4">
              <div className="w-14 h-14 rounded-full bg-surface-alt border border-hairline flex items-center justify-center text-ocean">
                <ShoppingBag className="w-6 h-6" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <p className="font-display text-xl font-semibold text-ink">Tu carrito está vacío</p>
                <p className="text-sm text-ink-muted max-w-xs">
                  Descubre nuestras piezas en acero inoxidable 316L resistentes al agua de mar.
                </p>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="px-5 py-2.5 rounded-full bg-ink text-canvas text-xs font-semibold hover:bg-ocean transition-colors"
              >
                Explorar accesorios
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-ink-muted hover:text-ink underline underline-offset-4 transition-colors"
                >
                  Vaciar carrito
                </button>
              </div>

              {items.map(({ product, quantity }) => {
                const isAtMaxStock = quantity >= product.stockQuantity;
                return (
                  <div
                    key={product.id}
                    className="flex gap-3.5 p-3.5 rounded-xl bg-canvas border border-hairline items-center"
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-surface-alt border border-hairline shrink-0">
                      <StoreImage
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <h3 className="text-sm font-semibold text-ink truncate">{product.name}</h3>
                      <p className="text-xs font-semibold text-ink-muted tabular-nums">
                        {formatCOP(product.price)}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-2">
                          <div className="inline-flex items-center border border-control-border rounded-full bg-surface">
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              aria-label={`Disminuir cantidad de ${product.name}`}
                              className="p-1.5 text-ink-muted hover:text-ink transition-colors rounded-l-full"
                            >
                              <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                            <span className="px-2.5 text-xs font-semibold tabular-nums text-ink">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              disabled={isAtMaxStock}
                              aria-label={
                                isAtMaxStock
                                  ? `Cantidad máxima disponible de ${product.name}`
                                  : `Aumentar cantidad de ${product.name}`
                              }
                              className="p-1.5 text-ink-muted hover:text-ink transition-colors rounded-r-full disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                          </div>

                          {isAtMaxStock && (
                            <span className="text-[11px] font-medium text-ink-muted">
                              Máx. disponible
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          aria-label={`Eliminar ${product.name} del carrito`}
                          className="p-1.5 text-ink-muted hover:text-red-700 transition-colors rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Footer Summary */}
        {items.length > 0 && (
          <div className="p-5 border-t border-hairline bg-canvas space-y-4">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-ink-muted">
                <span>Subtotal</span>
                <span className="font-semibold text-ink tabular-nums">{formatCOP(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-ink-muted">
                <span>Envío en Colombia</span>
                <span className="font-semibold text-ocean">
                  {totalPrice >= FREE_SHIPPING_THRESHOLD_COP ? "Gratis" : "Por coordinar"}
                </span>
              </div>
              <div className="flex justify-between items-baseline text-base font-semibold text-ink pt-2 border-t border-hairline">
                <span>Total</span>
                <span className="text-lg tabular-nums">{formatCOP(totalPrice)}</span>
              </div>
            </div>

            <p className="text-[11px] text-ink-muted leading-relaxed">
              Medios de pago vía WhatsApp: Nequi, Daviplata, transferencia Bancolombia o contra
              entrega. Envío gratis desde $120.000 COP.
            </p>

            <div className="space-y-2.5">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full py-3.5 px-5 rounded-full bg-ink hover:bg-ocean text-canvas font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors"
              >
                Proceder al pago
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>

              {HAS_WHATSAPP_NUMBER ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-5 rounded-full border border-control-border bg-surface hover:bg-surface-alt text-ink font-medium text-xs inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-ocean" aria-hidden="true" />O confirmar
                  directo por WhatsApp
                </a>
              ) : (
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="w-full py-3 px-5 rounded-full border border-control-border bg-surface hover:bg-surface-alt text-ink font-medium text-xs inline-flex items-center justify-center gap-2 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-ocean" aria-hidden="true" />
                    {copiedSummary ? "Resumen copiado" : "Copiar resumen para WhatsApp"}
                  </button>
                  <output
                    className="block text-[11px] text-ink-muted text-center"
                    aria-live="polite"
                  >
                    {copiedSummary
                      ? "Resumen copiado al portapapeles."
                      : "Configura NEXT_PUBLIC_WHATSAPP_NUMBER para activar la confirmación por WhatsApp."}
                  </output>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}
