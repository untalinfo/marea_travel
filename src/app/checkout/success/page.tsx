"use client";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { formatCOP } from "@/lib/utils";
import {
  ArrowRight,
  CheckCircle,
  Copy,
  CreditCard,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "MT-PEDIDO";
  const name = searchParams.get("name") || "Viajero";
  const total = searchParams.get("total") ? Number(searchParams.get("total")) : 0;
  const method = searchParams.get("method") || "transferencia";

  const [copied, setCopied] = useState(false);

  const copyOrder = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappPhone = "573000000000"; // Reemplazar con el número de Marea Travel
  const whatsappMsg = `*¡Hola Marea Travel! 🌊*\nAcabo de realizar la orden *${orderNumber}* a nombre de *${name}* por valor de *${formatCOP(
    total,
  )}*.\n\nMétodo seleccionado: *${
    method === "transferencia"
      ? "Transferencia Nequi/Bancolombia"
      : method === "contraentrega"
        ? "Pago Contra Entrega"
        : "Coordinar por WhatsApp"
  }*.\n\nQuedo atento/a para confirmar el comprobante y el envío. ¡Gracias!`;

  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      {/* Header de Éxito */}
      <div className="bg-marea-navy rounded-3xl border border-marea-sand/30 p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="w-20 h-20 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-xl">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono tracking-widest text-marea-sand uppercase">
            ¡Pedido Registrado con Éxito!
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            ¡Gracias por tu compra, <span className="gold-gradient-text">{name}</span>!
          </h1>
          <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Tu orden ha sido registrada en nuestro sistema de <strong>Marea Travel</strong>. Tus
            accesorios en Acero 316L pronto estarán listos para acompañarte en tus viajes.
          </p>
        </div>

        {/* Tarjeta con Número de Orden */}
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-marea-navy-dark border border-marea-steel-blue/40 text-slate-200">
          <span className="text-xs text-slate-400">Número de Orden:</span>
          <strong className="text-base font-mono font-bold text-marea-sand">{orderNumber}</strong>
          <button
            type="button"
            onClick={copyOrder}
            className="p-1.5 hover:text-white text-slate-400 transition-colors"
            title="Copiar número de orden"
          >
            <Copy className="w-4 h-4" />
          </button>
          {copied && <span className="text-[10px] text-emerald-400 font-bold">¡Copiado!</span>}
        </div>
      </div>

      {/* Instrucciones de Pago según el Método */}
      <div className="bg-marea-navy rounded-2xl border border-marea-steel-blue/30 p-6 sm:p-8 space-y-6">
        <h3 className="text-base font-bold text-white uppercase tracking-wider border-b border-marea-steel-blue/20 pb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-marea-sand" /> Pasos a Seguir para tu Entrega
        </h3>

        {method === "transferencia" && (
          <div className="space-y-4 text-sm text-slate-300">
            <p>
              Para despachar tu pedido, por favor realiza la transferencia por el total de{" "}
              <strong className="text-white font-mono text-base">{formatCOP(total)}</strong> a
              cualquiera de nuestras cuentas oficiales:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-marea-navy-dark border border-marea-steel-blue/40 space-y-1">
                <span className="text-xs font-bold text-marea-sand font-mono">
                  NEQUI / DAVIPLATA
                </span>
                <p className="text-base font-bold font-mono text-white">300 123 4567</p>
                <p className="text-[11px] text-slate-400">A nombre de: Oscar / Marea Travel</p>
              </div>

              <div className="p-4 rounded-xl bg-marea-navy-dark border border-marea-steel-blue/40 space-y-1">
                <span className="text-xs font-bold text-marea-sand font-mono">
                  BANCOLOMBIA (Ahorros)
                </span>
                <p className="text-base font-bold font-mono text-white">123-456789-00</p>
                <p className="text-[11px] text-slate-400">A nombre de: Marea Travel</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 pt-2">
              📸 Una vez hecha la transferencia, envíanos el comprobante por WhatsApp con el botón
              de abajo para activar el despacho de inmediato.
            </p>
          </div>
        )}

        {method === "contraentrega" && (
          <div className="space-y-3 text-sm text-slate-300">
            <p>
              Tu pedido ha sido agendado para <strong>Pago Contra Entrega</strong>.
            </p>
            <div className="p-4 rounded-xl bg-marea-navy-dark border border-marea-steel-blue/40 text-xs space-y-1.5 text-slate-300">
              <p>
                • <strong>Monto a pagar al recibir:</strong>{" "}
                <strong className="font-mono text-marea-sand">{formatCOP(total)}</strong>
              </p>
              <p>• La transportadora se comunicará al número que indicaste antes de la entrega.</p>
              <p>• Ten listo el valor exacto en efectivo o mediante transferencia al recibir.</p>
            </div>
          </div>
        )}

        {method === "whatsapp" && (
          <div className="space-y-3 text-sm text-slate-300">
            <p>
              Tu orden está lista para ser coordinada con un asesor de <strong>Marea Travel</strong>
              . Hacé clic abajo para abrir la conversación de WhatsApp con todos los detalles de tu
              pedido.
            </p>
          </div>
        )}

        {/* Botón Principal de WhatsApp */}
        <div className="pt-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 hover:scale-[1.01]"
          >
            <MessageCircle className="w-5 h-5" /> Enviar Comprobante / Confirmar por WhatsApp
          </a>
        </div>
      </div>

      {/* Badges de Garantía y Tiempos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400">
        <div className="p-4 rounded-xl bg-marea-navy border border-marea-steel-blue/20 flex items-center gap-3">
          <Truck className="w-5 h-5 text-marea-sand flex-shrink-0" />
          <span>Entrega de 2 a 4 días hábiles en ciudades principales.</span>
        </div>
        <div className="p-4 rounded-xl bg-marea-navy border border-marea-steel-blue/20 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>Acero Inoxidable 316L garantizado de por vida.</span>
        </div>
        <div className="p-4 rounded-xl bg-marea-navy border border-marea-steel-blue/20 flex items-center gap-3">
          <PackageCheck className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <span>Packaging protector listo para viajar.</span>
        </div>
      </div>

      {/* Volver a la Tienda */}
      <div className="text-center pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-marea-sand transition-colors"
        >
          Volver al Inicio de Marea Travel <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-marea-navy-dark text-slate-100 flex flex-col font-sans selection:bg-marea-sand selection:text-marea-navy-dark">
      <Navbar />

      <main className="flex-1">
        <Suspense
          fallback={
            <div className="py-24 text-center text-slate-400">Cargando confirmación...</div>
          }
        >
          <SuccessContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
