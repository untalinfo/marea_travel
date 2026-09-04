import type { Product } from "@/types";
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

/**
 * Obtiene la lista de todos los productos activos directamente desde Supabase.
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const supabase = getSupabaseClient();

    const { data: products, error } = await supabase
      .from("products")
      .select(`
        id,
        name,
        slug,
        description,
        price,
        original_price,
        material,
        waterproof,
        is_featured,
        category:categories(slug, name),
        images:product_images(image_url)
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error consultando productos en Supabase:", error);
      return [];
    }

    if (!products || products.length === 0) {
      return [];
    }

    return products.map((p) => {
      const categoryData = Array.isArray(p.category) ? p.category[0] : p.category;
      const imagesData = Array.isArray(p.images) ? p.images.map((img) => img.image_url) : [];

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: Number(p.price),
        originalPrice: p.original_price ? Number(p.original_price) : undefined,
        category: (categoryData?.slug as Product["category"]) || "coleccion-marina",
        categoryName: categoryData?.name || "Colección Marina",
        images:
          imagesData.length > 0
            ? imagesData
            : [
                "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
              ],
        isFeatured: p.is_featured,
        material: p.material,
        waterproof: p.waterproof,
        inStock: true,
        stockQuantity: 10,
      };
    });
  } catch (err) {
    console.error("Excepción en getProducts:", err);
    return [];
  }
}

/**
 * Obtiene el detalle de un producto específico por su slug desde Supabase.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = getSupabaseClient();

    const { data: product, error } = await supabase
      .from("products")
      .select(`
        id,
        name,
        slug,
        description,
        price,
        original_price,
        material,
        waterproof,
        is_featured,
        category:categories(slug, name),
        images:product_images(image_url)
      `)
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error || !product) {
      return null;
    }

    const categoryData = Array.isArray(product.category) ? product.category[0] : product.category;
    const imagesData = Array.isArray(product.images)
      ? product.images.map((img) => img.image_url)
      : [];

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: Number(product.price),
      originalPrice: product.original_price ? Number(product.original_price) : undefined,
      category: (categoryData?.slug as Product["category"]) || "coleccion-marina",
      categoryName: categoryData?.name || "Colección Marina",
      images:
        imagesData.length > 0
          ? imagesData
          : [
              "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
            ],
      isFeatured: product.is_featured,
      material: product.material,
      waterproof: product.waterproof,
      inStock: true,
      stockQuantity: 10,
    };
  } catch (err) {
    console.error(`Error buscando producto con slug ${slug}:`, err);
    return null;
  }
}
