"use client";

import { formatCOP } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import {
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, getTotalPrice, clearCart } =
    useCartStore();

  const [checkoutMode, setCheckoutMode] = useState<"whatsapp" | "online">("whatsapp");
  const totalPrice = getTotalPrice();

  if (!isOpen) return null;

  // Genera el mensaje estructurado de pedido para WhatsApp Business (muy efectivo en Colombia)
  const generateWhatsAppLink = () => {
    const phone = "573000000000"; // Número de WhatsApp Marea Travel
    let message = "*¡Hola Marea Travel! 🌊*\nQuiero realizar el siguiente pedido:\n\n";

    items.forEach((item, index) => {
      message += `${index + 1}. *${item.product.name}* x${item.quantity} = ${formatCOP(
        item.product.price * item.quantity,
      )}\n`;
    });

    message += `\n*Total a Pagar:* ${formatCOP(totalPrice)} COP\n`;
    message +=
      "*Garantía:* Acero Inoxidable 316L Waterproof\n\nQuedo atento para coordinar el envío en Colombia. ¡Gracias!";

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-marea-navy-dark border-l border-marea-steel-blue/30 text-white flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-marea-steel-blue/20 flex items-center justify-between bg-marea-navy">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-marea-sand" />
              <h2 className="text-lg font-bold font-sans tracking-wide">Tu Carrito de Compras</h2>
              <span className="text-xs bg-marea-steel-blue/40 text-marea-sand px-2 py-0.5 rounded-full font-mono">
                {items.length} {items.length === 1 ? "producto" : "productos"}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-marea-navy-light transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-slate-400">
                <div className="w-16 h-16 rounded-full bg-marea-navy-light flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-200">Tu carrito está vacío</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Descubrí nuestras piezas en acero inoxidable 316L resistentes al agua de mar.
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="mt-2 px-4 py-2 bg-marea-sand text-marea-navy-dark font-bold text-xs rounded-xl hover:bg-marea-sand-hover transition-colors"
                >
                  Explorar Accesorios
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 bg-marea-navy rounded-xl border border-marea-steel-blue/20 items-center"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-marea-navy-light flex-shrink-0">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate">{product.name}</h4>
                    <p className="text-xs text-marea-sand font-mono mt-0.5">
                      {formatCOP(product.price)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-marea-steel-blue/40 rounded-lg bg-marea-navy-dark">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-1 hover:text-marea-sand text-slate-400 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-white">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-1 hover:text-marea-sand text-slate-400 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-slate-500 hover:text-red-400 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-marea-steel-blue/30 bg-marea-navy space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-slate-200">{formatCOP(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Envío en Colombia</span>
                  <span className="text-emerald-400 font-medium">
                    {totalPrice >= 120000 ? "GRATIS" : "Por calcular"}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-marea-steel-blue/20">
                  <span>Total</span>
                  <span className="font-mono gold-gradient-text text-lg">
                    {formatCOP(totalPrice)} COP
                  </span>
                </div>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 bg-marea-navy-dark/60 p-2.5 rounded-lg border border-marea-steel-blue/20">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-marea-sand" /> Acero 316L Garantizado
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-marea-sand" /> Envíos Rápidos
                </span>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <a
                  href={generateWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-emerald-600/20 text-sm"
                >
                  <MessageCircle className="w-5 h-5" /> Confirmar Pedido por WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
