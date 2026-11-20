"use client";

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
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function CheckoutForm() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [department, setDepartment] = useState("Bogotá D.C.");
  const [city, setCity] = useState("Bogotá D.C.");
  const [addressLine, setAddressLine] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentGateway, setPaymentGateway] = useState<
    "transferencia" | "contraentrega" | "whatsapp"
  >("transferencia");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Actualizar lista de ciudades cuando cambia el departamento
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
  const shippingCost = subtotal >= 120000 ? 0 : 12000;
  const total = subtotal + shippingCost;

  if (!mounted) {
    return (
      <div className="py-20 flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-marea-sand animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-24 text-center max-w-md mx-auto space-y-6 px-4">
        <div className="w-20 h-20 rounded-full bg-marea-navy border border-marea-steel-blue/30 flex items-center justify-center text-slate-500 mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Tu carrito está vacío</h2>
          <p className="text-sm text-slate-400">
            Aún no agregaste ninguna pieza de Acero 316L para realizar el checkout.
          </p>
        </div>
        <Link
          href="/#catalogo"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-marea-sand hover:bg-marea-sand-hover text-marea-navy-dark font-extrabold text-sm rounded-xl transition-all shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a la Tienda
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validaciones básicas
    if (
      !fullName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !documentId.trim() ||
      !addressLine.trim()
    ) {
      setErrorMessage("Por favor completá todos los campos obligatorios para el envío.");
      return;
    }

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
        setIsSubmitting(false);
        return;
      }

      // Limpiar carrito local
      clearCart();

      // Redirigir a página de éxito
      router.push(
        `/checkout/success?orderNumber=${result.orderNumber}&name=${encodeURIComponent(
          fullName,
        )}&total=${total}&method=${paymentGateway}&phone=${encodeURIComponent(phone)}`,
      );
    } catch (err) {
      console.error("Error al finalizar orden:", err);
      setErrorMessage("Ocurrió un error inesperado. Por favor intenta nuevamente.");
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmitOrder}
      className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
    >
      {/* Columna Izquierda: Formulario de Envío y Pago */}
      <div className="lg:col-span-7 space-y-8">
        {/* Notificación de Error si existe */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-950/80 border border-red-800/60 text-red-200 text-sm">
            {errorMessage}
          </div>
        )}

        {/* Sección 1: Datos de Contacto */}
        <div className="bg-marea-navy/90 rounded-2xl border border-marea-steel-blue/30 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-marea-steel-blue/20 pb-4">
            <span className="w-7 h-7 rounded-full bg-marea-sand text-marea-navy-dark font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Datos Personales y Contacto
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="text-xs font-semibold text-slate-300">
                Nombre y Apellido <span className="text-marea-sand">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej: Laura Gómez"
                className="w-full bg-marea-navy-dark border border-marea-steel-blue/40 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-marea-sand transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="documentId" className="text-xs font-semibold text-slate-300">
                Cédula de Ciudadanía / NIT <span className="text-marea-sand">*</span>
              </label>
              <input
                id="documentId"
                type="text"
                required
                value={documentId}
                onChange={(e) => setDocumentId(e.target.value)}
                placeholder="Para factura y guía de envío"
                className="w-full bg-marea-navy-dark border border-marea-steel-blue/40 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-marea-sand transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-slate-300">
                Correo Electrónico <span className="text-marea-sand">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full bg-marea-navy-dark border border-marea-steel-blue/40 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-marea-sand transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-xs font-semibold text-slate-300">
                Teléfono / WhatsApp <span className="text-marea-sand">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej: 3001234567"
                className="w-full bg-marea-navy-dark border border-marea-steel-blue/40 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-marea-sand transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Sección 2: Dirección de Envío en Colombia */}
        <div className="bg-marea-navy/90 rounded-2xl border border-marea-steel-blue/30 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-marea-steel-blue/20 pb-4">
            <span className="w-7 h-7 rounded-full bg-marea-sand text-marea-navy-dark font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Lugar de Entrega (Colombia)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="department" className="text-xs font-semibold text-slate-300">
                Departamento <span className="text-marea-sand">*</span>
              </label>
              <select
                id="department"
                value={department}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                className="w-full bg-marea-navy-dark border border-marea-steel-blue/40 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-marea-sand transition-colors"
              >
                {COLOMBIA_LOCATIONS.map((loc) => (
                  <option key={loc.department} value={loc.department}>
                    {loc.department}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="city" className="text-xs font-semibold text-slate-300">
                Ciudad / Municipio <span className="text-marea-sand">*</span>
              </label>
              <select
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-marea-navy-dark border border-marea-steel-blue/40 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-marea-sand transition-colors"
              >
                {availableCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label htmlFor="addressLine" className="text-xs font-semibold text-slate-300">
                Dirección Completa (Calle, Carrera, N°, Barrio, Apto/Torre){" "}
                <span className="text-marea-sand">*</span>
              </label>
              <input
                id="addressLine"
                type="text"
                required
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                placeholder="Ej: Calle 127 # 15-30, Apto 402, Torre 1"
                className="w-full bg-marea-navy-dark border border-marea-steel-blue/40 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-marea-sand transition-colors"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label htmlFor="notes" className="text-xs font-semibold text-slate-300">
                Instrucciones de Entrega (Opcional)
              </label>
              <input
                id="notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej: Dejar en portería o tocar el timbre de la reja blanca"
                className="w-full bg-marea-navy-dark border border-marea-steel-blue/40 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-marea-sand transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Sección 3: Método de Pago */}
        <div className="bg-marea-navy/90 rounded-2xl border border-marea-steel-blue/30 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-marea-steel-blue/20 pb-4">
            <span className="w-7 h-7 rounded-full bg-marea-sand text-marea-navy-dark font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Método de Pago
            </h3>
          </div>

          <div className="space-y-3">
            {/* Opción Transferencia / PSE */}
            <label
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                paymentGateway === "transferencia"
                  ? "border-marea-sand bg-marea-sand/10"
                  : "border-marea-steel-blue/30 bg-marea-navy-dark hover:border-marea-steel-blue/60"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentGateway === "transferencia"}
                onChange={() => setPaymentGateway("transferencia")}
                className="mt-1 text-marea-sand focus:ring-marea-sand"
              />
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">
                    Transferencia Bancaria / Nequi / Bancolombia / PSE
                  </span>
                  <CreditCard className="w-4 h-4 text-marea-sand" />
                </div>
                <p className="text-xs text-slate-400">
                  Te mostramos el número de cuenta y QR para transferir sin comisiones al confirmar
                  el pedido.
                </p>
              </div>
            </label>

            {/* Opción Contraentrega */}
            <label
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                paymentGateway === "contraentrega"
                  ? "border-marea-sand bg-marea-sand/10"
                  : "border-marea-steel-blue/30 bg-marea-navy-dark hover:border-marea-steel-blue/60"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentGateway === "contraentrega"}
                onChange={() => setPaymentGateway("contraentrega")}
                className="mt-1 text-marea-sand focus:ring-marea-sand"
              />
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Pago Contra Entrega</span>
                  <Truck className="w-4 h-4 text-marea-sand" />
                </div>
                <p className="text-xs text-slate-400">
                  Pagas en efectivo o transferencia cuando la transportadora (Interrapidísimo/Envía)
                  entregue el paquete en tu puerta.
                </p>
              </div>
            </label>

            {/* Opción WhatsApp Directo */}
            <label
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                paymentGateway === "whatsapp"
                  ? "border-marea-sand bg-marea-sand/10"
                  : "border-marea-steel-blue/30 bg-marea-navy-dark hover:border-marea-steel-blue/60"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentGateway === "whatsapp"}
                onChange={() => setPaymentGateway("whatsapp")}
                className="mt-1 text-marea-sand focus:ring-marea-sand"
              />
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">
                    Coordinar con Asesor por WhatsApp
                  </span>
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-xs text-slate-400">
                  Guardamos tu orden y te atendemos personalmente por WhatsApp para resolver
                  cualquier duda.
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Columna Derecha: Resumen del Pedido */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-marea-navy rounded-2xl border border-marea-steel-blue/30 p-6 sm:p-8 space-y-6 sticky top-28 shadow-xl">
          <h3 className="text-base font-bold text-white uppercase tracking-wider border-b border-marea-steel-blue/20 pb-4">
            Resumen de Compra ({items.length} {items.length === 1 ? "pieza" : "piezas"})
          </h3>

          {/* Lista de Productos en el Pedido */}
          <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-3 items-center">
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-marea-navy-dark flex-shrink-0 border border-marea-steel-blue/30">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                  <span className="absolute bottom-0 right-0 bg-marea-sand text-marea-navy-dark text-[10px] font-bold px-1.5 rounded-tl-md">
                    x{quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-white truncate">{product.name}</h4>
                  <span className="text-[10px] font-mono text-slate-400">
                    Acero 316L Waterproof
                  </span>
                  <p className="text-xs font-mono font-bold text-marea-sand mt-0.5">
                    {formatCOP(product.price * quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Cálculos */}
          <div className="border-t border-marea-steel-blue/20 pt-4 space-y-2.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono text-white font-medium">{formatCOP(subtotal)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1">
                Envío nacional en Colombia
                <span className="text-[10px] text-slate-500">(Interrapidísimo/Envía)</span>
              </span>
              <span className="font-mono font-bold">
                {shippingCost === 0 ? (
                  <span className="text-emerald-400">¡GRATIS! 🎉</span>
                ) : (
                  formatCOP(shippingCost)
                )}
              </span>
            </div>

            {shippingCost > 0 && (
              <p className="text-[11px] text-marea-sand bg-marea-sand/10 p-2 rounded-lg">
                💡 Agregá {formatCOP(120000 - subtotal)} más para obtener{" "}
                <strong>ENVÍO GRATIS</strong>.
              </p>
            )}

            <div className="border-t border-marea-steel-blue/20 pt-3 flex justify-between items-baseline text-white">
              <span className="text-base font-bold">Total a Pagar</span>
              <span className="text-xl font-extrabold font-mono gold-gradient-text">
                {formatCOP(total)}
              </span>
            </div>
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-marea-sand hover:bg-marea-sand-hover text-marea-navy-dark font-extrabold text-sm rounded-xl transition-all shadow-xl shadow-marea-sand/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Procesando Pedido...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" /> Confirmar y Finalizar Pedido
              </>
            )}
          </button>

          {/* Trust Badges */}
          <div className="pt-2 border-t border-marea-steel-blue/20 space-y-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Garantía incondicional de por vida en Acero 316L.</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-marea-sand flex-shrink-0" />
              <span>Tus datos están protegidos y cifrados con seguridad bancaria.</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
