"use client";

import { StoreImage } from "@/components/store/StoreImage";
import { FREE_SHIPPING_THRESHOLD_COP } from "@/lib/brand-assets";
import { COLOMBIA_LOCATIONS } from "@/lib/colombia";
import { createOrder } from "@/lib/supabase/orders";
import { formatCOP } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Loader2,
  Lock,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SHIPPING_COST_COP = 12_000;

type PaymentGateway = "transferencia" | "contraentrega" | "whatsapp";

const FIELD_CLASSES =
  "w-full min-h-11 bg-surface border border-control-border rounded-xl px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink transition-colors";

const LABEL_CLASSES = "block text-xs font-semibold text-ink";

export function CheckoutForm() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const submittingRef = useRef(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [department, setDepartment] = useState("Bogotá D.C.");
  const [city, setCity] = useState("Bogotá D.C.");
  const [addressLine, setAddressLine] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentGateway, setPaymentGateway] = useState<PaymentGateway>("transferencia");

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentDepartmentData = COLOMBIA_LOCATIONS.find((d) => d.department === department);
  const availableCities = currentDepartmentData?.cities || [];

  const handleDepartmentChange = (newDept: string) => {
    setDepartment(newDept);
    const deptObj = COLOMBIA_LOCATIONS.find((d) => d.department === newDept);
    if (deptObj && deptObj.cities.length > 0) {
      setCity(deptObj.cities[0]);
    } else {
      setCity("");
    }
  };

  const subtotal = mounted ? getTotalPrice() : 0;
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD_COP ? 0 : SHIPPING_COST_COP;
  const total = subtotal + shippingCost;
  const totalUnits = items.reduce((acc, item) => acc + item.quantity, 0);
  const isFormComplete =
    Boolean(fullName.trim()) &&
    Boolean(documentId.trim()) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    Boolean(phone.trim()) &&
    Boolean(department.trim()) &&
    Boolean(city.trim()) &&
    Boolean(addressLine.trim());

  if (!mounted || isRedirecting) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-ink-muted">
        <Loader2 className="w-7 h-7 text-ocean animate-spin" aria-hidden="true" />
        <span className="text-sm">
          {isRedirecting
            ? "Pedido confirmado. Redirigiendo a tu comprobante..."
            : "Cargando resumen de tu pedido..."}
        </span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-16 sm:py-24 text-center max-w-md mx-auto space-y-6 px-4">
        <div className="w-16 h-16 rounded-full bg-surface-alt border border-hairline flex items-center justify-center text-ocean mx-auto">
          <ShoppingBag className="w-7 h-7" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-semibold text-ink">Tu carrito está vacío</h2>
          <p className="text-sm text-ink-muted">
            Aún no has agregado piezas en acero inoxidable 316L para completar tu pedido.
          </p>
        </div>
        <Link
          href="/#catalogo"
          className="inline-flex items-center justify-center gap-2 min-h-11 px-6 py-3 bg-ink hover:bg-ocean text-surface font-semibold text-sm rounded-full transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Volver a la tienda
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current || isSubmitting) return;
    setErrorMessage(null);

    if (
      !fullName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !documentId.trim() ||
      !addressLine.trim()
    ) {
      setErrorMessage("Por favor completa todos los campos obligatorios para continuar.");
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      const orderData = {
        customer: {
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          documentId: documentId.trim(),
          department,
          city,
          addressLine: addressLine.trim(),
        },
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.product.price,
        })),
        totalAmount: total,
        paymentGateway,
        notes: notes.trim() || undefined,
      };

      const result = await createOrder(orderData);

      if (!result.success || !result.orderNumber) {
        setErrorMessage(
          result.error || "No se pudo procesar tu pedido. Por favor intenta de nuevo.",
        );
        submittingRef.current = false;
        setIsSubmitting(false);
        return;
      }

      setIsRedirecting(true);
      clearCart();

      router.push(
        `/checkout/success?orderNumber=${encodeURIComponent(result.orderNumber)}&name=${encodeURIComponent(
          fullName.trim(),
        )}&total=${total}&method=${paymentGateway}`,
      );
    } catch (err) {
      console.error("Error al finalizar orden:", err);
      setErrorMessage("Ocurrió un error inesperado. Por favor intenta nuevamente.");
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmitOrder}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
    >
      {/* Columna izquierda: Datos de contacto, envío y pago */}
      <div className="lg:col-span-7 space-y-6">
        {errorMessage && (
          <div
            role="alert"
            className="p-4 rounded-xl bg-red-50 border border-red-300 text-red-900 text-sm font-medium"
          >
            {errorMessage}
          </div>
        )}

        {/* Sección 1: Datos de contacto */}
        <fieldset className="bg-surface rounded-2xl border border-hairline p-6 sm:p-8 space-y-6">
          <legend className="sr-only">Datos de contacto</legend>
          <div className="flex items-center gap-3 border-b border-hairline pb-4">
            <span
              aria-hidden="true"
              className="w-7 h-7 rounded-full bg-ink text-surface font-semibold text-xs flex items-center justify-center shrink-0 tabular-nums"
            >
              1
            </span>
            <div>
              <h2 className="font-display text-xl font-semibold text-ink">Datos de contacto</h2>
              <p className="text-xs text-ink-muted">
                Para enviarte la confirmación y la guía de despacho.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="fullName" className={LABEL_CLASSES}>
                Nombre y apellido{" "}
                <span className="text-sand-text" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej. Laura Gómez"
                className={FIELD_CLASSES}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="documentId" className={LABEL_CLASSES}>
                Cédula de ciudadanía o NIT{" "}
                <span className="text-sand-text" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                id="documentId"
                name="documentId"
                type="text"
                required
                autoComplete="off"
                value={documentId}
                onChange={(e) => setDocumentId(e.target.value)}
                placeholder="Para factura y guía de envío"
                className={FIELD_CLASSES}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className={LABEL_CLASSES}>
                Correo electrónico{" "}
                <span className="text-sand-text" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className={FIELD_CLASSES}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="phone" className={LABEL_CLASSES}>
                Teléfono o WhatsApp{" "}
                <span className="text-sand-text" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                required
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej. 300 123 4567"
                className={FIELD_CLASSES}
              />
            </div>
          </div>
        </fieldset>

        {/* Sección 2: Dirección de envío en Colombia */}
        <fieldset className="bg-surface rounded-2xl border border-hairline p-6 sm:p-8 space-y-6">
          <legend className="sr-only">Dirección de envío en Colombia</legend>
          <div className="flex items-center gap-3 border-b border-hairline pb-4">
            <span
              aria-hidden="true"
              className="w-7 h-7 rounded-full bg-ink text-surface font-semibold text-xs flex items-center justify-center shrink-0 tabular-nums"
            >
              2
            </span>
            <div>
              <h2 className="font-display text-xl font-semibold text-ink">
                Dirección de envío en Colombia
              </h2>
              <p className="text-xs text-ink-muted">
                Despachos nacionales por Interrapidísimo o Envía.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="department" className={LABEL_CLASSES}>
                Departamento{" "}
                <span className="text-sand-text" aria-hidden="true">
                  *
                </span>
              </label>
              <select
                id="department"
                name="department"
                autoComplete="address-level1"
                value={department}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                className={FIELD_CLASSES}
              >
                {COLOMBIA_LOCATIONS.map((loc) => (
                  <option key={loc.department} value={loc.department}>
                    {loc.department}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="city" className={LABEL_CLASSES}>
                Ciudad o municipio{" "}
                <span className="text-sand-text" aria-hidden="true">
                  *
                </span>
              </label>
              <select
                id="city"
                name="city"
                autoComplete="address-level2"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={FIELD_CLASSES}
              >
                {availableCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label htmlFor="addressLine" className={LABEL_CLASSES}>
                Dirección completa (calle, carrera, número, barrio, apto o torre){" "}
                <span className="text-sand-text" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                id="addressLine"
                name="addressLine"
                type="text"
                required
                autoComplete="street-address"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                placeholder="Ej. Calle 127 # 15-30, Apto 402, Torre 1"
                className={FIELD_CLASSES}
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label htmlFor="notes" className={LABEL_CLASSES}>
                Instrucciones de entrega (opcional)
              </label>
              <input
                id="notes"
                name="notes"
                type="text"
                autoComplete="off"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. Dejar en portería o llamar antes de entregar"
                className={FIELD_CLASSES}
              />
            </div>
          </div>
        </fieldset>

        {/* Sección 3: Método de pago */}
        <fieldset className="bg-surface rounded-2xl border border-hairline p-6 sm:p-8 space-y-6">
          <legend className="sr-only">Método de pago</legend>
          <div className="flex items-center gap-3 border-b border-hairline pb-4">
            <span
              aria-hidden="true"
              className="w-7 h-7 rounded-full bg-ink text-surface font-semibold text-xs flex items-center justify-center shrink-0 tabular-nums"
            >
              3
            </span>
            <div>
              <h2 className="font-display text-xl font-semibold text-ink">Método de pago</h2>
              <p className="text-xs text-ink-muted">
                Elige cómo prefieres completar el pago de tu pedido.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label
              className={`flex items-start gap-3.5 p-4 rounded-xl border transition-colors cursor-pointer ${
                paymentGateway === "transferencia"
                  ? "border-ink bg-surface-alt/70"
                  : "border-hairline bg-surface hover:border-control-border"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="transferencia"
                checked={paymentGateway === "transferencia"}
                onChange={() => setPaymentGateway("transferencia")}
                className="mt-1 h-4 w-4 accent-ink shrink-0"
              />
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-ink">
                    Transferencia bancaria / Nequi / Bancolombia / PSE
                  </span>
                  <CreditCard className="w-4 h-4 text-ocean shrink-0" aria-hidden="true" />
                </div>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Al confirmar el pedido te mostramos los datos oficiales para transferir sin
                  comisiones adicionales.
                </p>
              </div>
            </label>

            <label
              className={`flex items-start gap-3.5 p-4 rounded-xl border transition-colors cursor-pointer ${
                paymentGateway === "contraentrega"
                  ? "border-ink bg-surface-alt/70"
                  : "border-hairline bg-surface hover:border-control-border"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="contraentrega"
                checked={paymentGateway === "contraentrega"}
                onChange={() => setPaymentGateway("contraentrega")}
                className="mt-1 h-4 w-4 accent-ink shrink-0"
              />
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-ink">Pago contra entrega</span>
                  <Truck className="w-4 h-4 text-ocean shrink-0" aria-hidden="true" />
                </div>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Pagas en efectivo o transferencia cuando la transportadora entregue el paquete en
                  tu dirección.
                </p>
              </div>
            </label>

            <label
              className={`flex items-start gap-3.5 p-4 rounded-xl border transition-colors cursor-pointer ${
                paymentGateway === "whatsapp"
                  ? "border-ink bg-surface-alt/70"
                  : "border-hairline bg-surface hover:border-control-border"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="whatsapp"
                checked={paymentGateway === "whatsapp"}
                onChange={() => setPaymentGateway("whatsapp")}
                className="mt-1 h-4 w-4 accent-ink shrink-0"
              />
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-ink">Coordinar por WhatsApp</span>
                  <MessageCircle className="w-4 h-4 text-ocean shrink-0" aria-hidden="true" />
                </div>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Registramos tu orden y continuamos la confirmación directamente con un asesor por
                  WhatsApp.
                </p>
              </div>
            </label>
          </div>
        </fieldset>
      </div>

      {/* Columna derecha: Resumen del pedido */}
      <aside aria-label="Resumen del pedido" className="lg:col-span-5">
        <div className="bg-surface rounded-2xl border border-hairline p-6 sm:p-8 space-y-6 lg:sticky lg:top-28">
          <div className="flex items-baseline justify-between gap-2 border-b border-hairline pb-4">
            <h2 className="font-display text-xl font-semibold text-ink">Resumen del pedido</h2>
            <span className="text-xs font-medium text-ink-muted tabular-nums">
              {totalUnits} {totalUnits === 1 ? "pieza" : "piezas"}
            </span>
          </div>

          <ul className="space-y-4 max-h-80 overflow-y-auto pr-1 divide-y divide-hairline/70">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="flex gap-3.5 items-center pt-4 first:pt-0">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-surface-alt shrink-0 border border-hairline">
                  <StoreImage
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                  <span className="absolute bottom-0 right-0 bg-ink text-surface text-[11px] font-semibold px-1.5 py-0.5 rounded-tl-lg tabular-nums">
                    x{quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="text-sm font-semibold text-ink truncate">{product.name}</p>
                  <p className="text-xs text-ink-muted">Acero inoxidable 316L</p>
                  <p className="text-sm font-semibold text-ink tabular-nums pt-0.5">
                    {formatCOP(product.price * quantity)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-hairline pt-4 space-y-2.5 text-sm">
            <div className="flex justify-between text-ink-muted">
              <span>Subtotal</span>
              <span className="font-medium text-ink tabular-nums">{formatCOP(subtotal)}</span>
            </div>

            <div className="flex justify-between items-baseline gap-2 text-ink-muted">
              <span>Envío nacional en Colombia</span>
              <span className="font-semibold tabular-nums">
                {shippingCost === 0 ? (
                  <span className="text-ocean">Gratis</span>
                ) : (
                  <span className="text-ink">{formatCOP(shippingCost)}</span>
                )}
              </span>
            </div>

            {shippingCost > 0 && (
              <p className="text-xs text-ink-muted bg-surface-alt border border-hairline px-3.5 py-2.5 rounded-xl">
                Agrega{" "}
                <strong className="font-semibold text-ink tabular-nums">
                  {formatCOP(FREE_SHIPPING_THRESHOLD_COP - subtotal)}
                </strong>{" "}
                más para obtener <strong className="font-semibold text-ocean">envío gratis</strong>.
              </p>
            )}

            <div className="border-t border-hairline pt-4 flex justify-between items-baseline text-ink">
              <span className="text-base font-semibold">Total a pagar</span>
              <span className="font-display text-2xl font-semibold tabular-nums text-ink">
                {formatCOP(total)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="submit"
              disabled={isSubmitting || !isFormComplete}
              className="w-full min-h-12 py-3.5 px-6 bg-ink hover:bg-ocean text-surface font-semibold text-sm rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-ink disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  Procesando pedido...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" aria-hidden="true" />
                  Confirmar pedido
                </>
              )}
            </button>
            {!isFormComplete && !isSubmitting && (
              <p className="text-xs text-ink-muted text-center">
                Completa los campos obligatorios (*) para habilitar la confirmación.
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-hairline space-y-2.5 text-xs text-ink-muted">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-ocean shrink-0 mt-0.5" aria-hidden="true" />
              <span>Garantía de por vida en piezas de acero inoxidable 316L.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-sand-text shrink-0 mt-0.5" aria-hidden="true" />
              <span>Tu pedido queda registrado con número de seguimiento inmediato.</span>
            </div>
          </div>
        </div>
      </aside>
    </form>
  );
}
