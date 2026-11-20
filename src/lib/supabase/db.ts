import { PRODUCT_FALLBACK_SRC } from "@/lib/brand-assets";
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

interface RawImageRow {
  image_url: string;
  is_primary?: boolean | null;
  display_order?: number | null;
}

interface RawVariantRow {
  stock_quantity?: number | null;
}

function mapImages(images: RawImageRow[] | RawImageRow | null | undefined): string[] {
  if (!Array.isArray(images) || images.length === 0) {
    return [PRODUCT_FALLBACK_SRC];
  }

  const sorted = [...images].sort((a, b) => {
    if (Boolean(a.is_primary) !== Boolean(b.is_primary)) {
      return a.is_primary ? -1 : 1;
    }
    return (a.display_order ?? 0) - (b.display_order ?? 0);
  });

  const urls = sorted.map((img) => img.image_url).filter((url) => Boolean(url?.trim()));
  return urls.length > 0 ? urls : [PRODUCT_FALLBACK_SRC];
}

function mapStock(variants: RawVariantRow[] | RawVariantRow | null | undefined): {
  inStock: boolean;
  stockQuantity: number;
} {
  if (!Array.isArray(variants) || variants.length === 0) {
    return { inStock: true, stockQuantity: 10 };
  }

  const total = variants.reduce((sum, v) => sum + Math.max(0, Number(v.stock_quantity) || 0), 0);
  return {
    inStock: total > 0,
    stockQuantity: total,
  };
}

/**
 * Obtiene la lista de productos activos directamente desde Supabase.
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
        images:product_images(image_url, is_primary, display_order),
        variants:product_variants(stock_quantity)
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
      const stock = mapStock(p.variants);

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: Number(p.price),
        originalPrice: p.original_price ? Number(p.original_price) : undefined,
        category: (categoryData?.slug as Product["category"]) || "coleccion-marina",
        categoryName: categoryData?.name || "Colección Marina",
        images: mapImages(p.images),
        isFeatured: p.is_featured,
        material: p.material,
        waterproof: p.waterproof,
        inStock: stock.inStock,
        stockQuantity: stock.stockQuantity,
      };
    });
  } catch (err) {
    console.error("Excepción en getProducts:", err);
    return [];
  }
}

/**
 * Obtiene el detalle de un producto activo específico por su slug desde Supabase.
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
        images:product_images(image_url, is_primary, display_order),
        variants:product_variants(stock_quantity)
      `)
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error || !product) {
      return null;
    }

    const categoryData = Array.isArray(product.category) ? product.category[0] : product.category;
    const stock = mapStock(product.variants);

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: Number(product.price),
      originalPrice: product.original_price ? Number(product.original_price) : undefined,
      category: (categoryData?.slug as Product["category"]) || "coleccion-marina",
      categoryName: categoryData?.name || "Colección Marina",
      images: mapImages(product.images),
      isFeatured: product.is_featured,
      material: product.material,
      waterproof: product.waterproof,
      inStock: stock.inStock,
      stockQuantity: stock.stockQuantity,
    };
  } catch (err) {
    console.error(`Error buscando producto con slug ${slug}:`, err);
    return null;
  }
}
