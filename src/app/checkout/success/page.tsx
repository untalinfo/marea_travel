"use client";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { HAS_WHATSAPP_NUMBER, WHATSAPP_NUMBER } from "@/lib/brand-assets";
import { formatCOP } from "@/lib/utils";
import {
  ArrowRight,
  Check,
  CheckCircle2,
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

const FALLBACK_WHATSAPP_NUMBER = "573000000000";

type PaymentMethod = "transferencia" | "contraentrega" | "whatsapp";

function normalizePaymentMethod(raw: string | null): PaymentMethod {
  if (raw === "transferencia" || raw === "contraentrega" || raw === "whatsapp") {
    return raw;
  }
  return "transferencia";
}

function copyTextFallback(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  document.body.appendChild(textarea);
  textarea.select();

  let succeeded = false;
  try {
    succeeded = document.execCommand("copy");
  } catch {
    succeeded = false;
  } finally {
    document.body.removeChild(textarea);
  }
  return succeeded;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "MT-PEDIDO";
  const name = searchParams.get("name") || "Viajero";
  const parsedTotal = searchParams.get("total") ? Number(searchParams.get("total")) : 0;
  const total = Number.isFinite(parsedTotal) && parsedTotal >= 0 ? parsedTotal : 0;
  const method = normalizePaymentMethod(searchParams.get("method"));

  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const copyOrder = async () => {
    setCopyError(null);
    let succeeded = false;

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(orderNumber);
        succeeded = true;
      } catch {
        succeeded = false;
      }
    }

    if (!succeeded && typeof document !== "undefined") {
      succeeded = copyTextFallback(orderNumber);
    }

    if (succeeded) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } else {
      setCopied(false);
      setCopyError(
        "No se pudo copiar automáticamente. Selecciona el número y cópialo manualmente.",
      );
    }
  };

  const whatsappPhone = HAS_WHATSAPP_NUMBER ? WHATSAPP_NUMBER : FALLBACK_WHATSAPP_NUMBER;
  const paymentMethodLabel =
    method === "transferencia"
      ? "Transferencia bancaria / Nequi / Bancolombia / PSE"
      : method === "contraentrega"
        ? "Pago contra entrega"
        : "Coordinar por WhatsApp";

  const whatsappMsg = [
    "Hola, Marea Travel.",
    `Acabo de realizar la orden ${orderNumber} a nombre de ${name} por valor de ${formatCOP(total)}.`,
    "",
    `Método seleccionado: ${paymentMethodLabel}.`,
    "",
    "Quedo atento para confirmar el pago y coordinar el envío.",
  ].join("\n");

  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      {/* Confirmación principal */}
      <section className="bg-surface rounded-2xl border border-hairline p-8 sm:p-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-surface-alt border border-hairline flex items-center justify-center text-ocean mx-auto">
          <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
        </div>

        <div className="space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sand-text">
            Pedido registrado
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink tracking-tight">
            Gracias por tu compra, {name}
          </h1>
          <p className="text-sm text-ink-muted max-w-lg mx-auto leading-relaxed">
            Tu orden quedó registrada en Marea Travel. Conserva tu número de referencia para hacer
            seguimiento y confirmar el despacho.
          </p>
        </div>

        {/* Número de orden con botón de copiado accesible */}
        <div className="inline-flex flex-wrap items-center justify-center gap-3 px-5 py-3 rounded-2xl bg-canvas border border-hairline">
          <span className="text-xs font-medium text-ink-muted">Número de orden</span>
          <strong className="text-base font-mono font-semibold text-ink tracking-wide">
            {orderNumber}
          </strong>
          <button
            type="button"
            onClick={copyOrder}
            aria-label={`Copiar número de orden ${orderNumber}`}
            className="inline-flex items-center gap-1.5 min-h-9 px-3 py-1.5 rounded-full bg-surface border border-control-border text-xs font-semibold text-ink hover:border-ink hover:bg-surface-alt transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-ocean" aria-hidden="true" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-ocean" aria-hidden="true" />
                Copiar
              </>
            )}
          </button>
          <output aria-live="polite" className="sr-only">
            {copied ? `Número de orden ${orderNumber} copiado al portapapeles.` : copyError || ""}
          </output>
        </div>

        {copyError && (
          <p role="alert" className="text-xs font-medium text-red-900">
            {copyError}
          </p>
        )}
      </section>

      {/* Instrucciones según método de pago */}
      <section className="bg-surface rounded-2xl border border-hairline p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 border-b border-hairline pb-4">
          <CreditCard className="w-5 h-5 text-ocean shrink-0" aria-hidden="true" />
          <h2 className="font-display text-xl font-semibold text-ink">
            Siguientes pasos para tu entrega
          </h2>
        </div>

        {method === "transferencia" && (
          <div className="space-y-4 text-sm text-ink-muted">
            <p>
              Para activar el despacho de tu pedido, realiza la transferencia por{" "}
              <strong className="font-semibold text-ink tabular-nums">{formatCOP(total)}</strong> a
              cualquiera de nuestras cuentas oficiales:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-canvas border border-hairline space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-sand-text">
                  Nequi / Daviplata
                </p>
                <p className="text-base font-mono font-semibold text-ink">300 123 4567</p>
                <p className="text-xs text-ink-muted">Titular: Oscar / Marea Travel</p>
              </div>

              <div className="p-4 rounded-xl bg-canvas border border-hairline space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-sand-text">
                  Bancolombia (Ahorros)
                </p>
                <p className="text-base font-mono font-semibold text-ink">123-456789-00</p>
                <p className="text-xs text-ink-muted">Titular: Marea Travel</p>
              </div>
            </div>

            <p className="text-xs text-ink-muted leading-relaxed">
              Una vez realizada la transferencia, comparte el comprobante por WhatsApp usando el
              botón inferior para programar el envío.
            </p>
          </div>
        )}

        {method === "contraentrega" && (
          <div className="space-y-4 text-sm text-ink-muted">
            <p>
              Tu pedido quedó programado bajo la modalidad de{" "}
              <strong className="font-semibold text-ink">pago contra entrega</strong>.
            </p>
            <ul className="p-4 rounded-xl bg-canvas border border-hairline text-xs space-y-2 text-ink-muted list-disc pl-8">
              <li>
                Monto a pagar al recibir:{" "}
                <strong className="font-semibold text-ink tabular-nums">{formatCOP(total)}</strong>.
              </li>
              <li>
                La transportadora se comunicará al teléfono registrado antes de realizar la entrega.
              </li>
              <li>
                Ten listo el valor exacto en efectivo o transferencia al momento de recibir el
                paquete.
              </li>
            </ul>
          </div>
        )}

        {method === "whatsapp" && (
          <div className="space-y-3 text-sm text-ink-muted">
            <p>
              Tu orden quedó guardada para ser coordinada directamente con un asesor de{" "}
              <strong className="font-semibold text-ink">Marea Travel</strong>. Abre la conversación
              en WhatsApp con los detalles precargados para confirmar medio de pago y envío.
            </p>
          </div>
        )}

        <div className="pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-12 py-3.5 px-6 bg-ink hover:bg-ocean text-surface font-semibold text-sm rounded-full transition-colors inline-flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            {method === "transferencia"
              ? "Enviar comprobante por WhatsApp"
              : "Confirmar pedido por WhatsApp"}
          </a>
        </div>
      </section>

      {/* Información de envío y garantía */}
      <section aria-label="Garantía y tiempos de envío">
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-ink-muted">
          <li className="p-4 rounded-2xl bg-surface border border-hairline flex items-start gap-3">
            <Truck className="w-4 h-4 text-ocean shrink-0 mt-0.5" aria-hidden="true" />
            <span>Entrega de 2 a 4 días hábiles en ciudades principales de Colombia.</span>
          </li>
          <li className="p-4 rounded-2xl bg-surface border border-hairline flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-ocean shrink-0 mt-0.5" aria-hidden="true" />
            <span>Acero inoxidable 316L resistente al agua y con garantía de por vida.</span>
          </li>
          <li className="p-4 rounded-2xl bg-surface border border-hairline flex items-start gap-3">
            <PackageCheck className="w-4 h-4 text-sand-text shrink-0 mt-0.5" aria-hidden="true" />
            <span>Empaque protector diseñado para acompañarte en cada viaje.</span>
          </li>
        </ul>
      </section>

      {/* Volver al inicio */}
      <div className="text-center pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 min-h-11 py-2 text-xs font-semibold text-ink-muted hover:text-ink transition-colors"
        >
          Volver al inicio de Marea Travel
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans selection:bg-ocean selection:text-canvas">
      <Navbar />

      <main className="flex-1">
        <Suspense
          fallback={
            <div className="py-24 text-center text-sm text-ink-muted">Cargando confirmación...</div>
          }
        >
          <SuccessContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
