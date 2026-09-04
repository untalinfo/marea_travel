import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!rawUrl || !rawKey) {
    throw new Error("Faltan las variables de entorno de Supabase en .env.local");
  }

  const supabaseUrl = rawUrl.trim().replace(/^["']|["']$/g, "");
  const supabaseAnonKey = rawKey.trim().replace(/^["']|["']$/g, "");

  return createClient(supabaseUrl, supabaseAnonKey);
}

export interface CreateOrderInput {
  customer: {
    fullName: string;
    email: string;
    phone: string;
    documentId: string;
    department: string;
    city: string;
    addressLine: string;
  };
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
  totalAmount: number;
  paymentGateway: "transferencia" | "contraentrega" | "whatsapp";
  notes?: string;
}

export interface CreateOrderResult {
  success: boolean;
  orderNumber?: string;
  orderId?: string;
  error?: string;
}

/**
 * Crea una orden en Supabase generando los IDs del lado del cliente.
 * Al no usar .select() (RETURNING clause), cumple estrictamente con la política
 * RLS de inserción pública sin requerir permisos de lectura sobre datos ajenos.
 */
export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  try {
    const supabase = getSupabaseClient();

    const customerId = crypto.randomUUID();
    const orderId = crypto.randomUUID();
    const timestampSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `MT-${timestampSuffix}`;

    // 1. Insertar el cliente en la tabla `customers` (sin .select())
    const { error: customerError } = await supabase.from("customers").insert({
      id: customerId,
      full_name: input.customer.fullName,
      email: input.customer.email,
      phone: input.customer.phone,
      address_line: `${input.customer.addressLine} (C.C. ${input.customer.documentId})`,
      city: input.customer.city,
      department: input.customer.department,
    });

    if (customerError) {
      console.error("Error registrando cliente en Supabase:", customerError);
      return { success: false, error: "No se pudo registrar la información del cliente." };
    }

    // 2. Crear la orden en la tabla `orders` (sin .select())
    const { error: orderError } = await supabase.from("orders").insert({
      id: orderId,
      customer_id: customerId,
      order_number: orderNumber,
      status: "pendiente",
      total_amount: input.totalAmount,
      payment_gateway: input.paymentGateway,
      notes: input.notes || null,
    });

    if (orderError) {
      console.error("Error creando orden en Supabase:", orderError);
      return { success: false, error: "No se pudo generar la orden de compra." };
    }

    // 3. Insertar los items de la orden en `order_items`
    const orderItemsToInsert = input.items.map((item) => ({
      id: crypto.randomUUID(),
      order_id: orderId,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.unitPrice,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItemsToInsert);

    if (itemsError) {
      console.error("Error guardando items de la orden en Supabase:", itemsError);
    }

    return {
      success: true,
      orderNumber,
      orderId,
    };
  } catch (err) {
    console.error("Excepción en createOrder:", err);
    return {
      success: false,
      error: "Ocurrió un error inesperado procesando tu pedido.",
    };
  }
}
