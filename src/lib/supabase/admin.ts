import { PRODUCT_FALLBACK_SRC } from "@/lib/brand-assets";
import type { AdminProduct, ProductImageItem } from "@/types";
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

function normalizeProductImageUrls(imageUrls: string[]): string[] {
  return Array.from(
    new Set(
      imageUrls
        .map((url) => url.trim())
        .filter((url) => url.length > 0 && url !== PRODUCT_FALLBACK_SRC),
    ),
  );
}

export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

export interface NewProductInput {
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  price: number;
  originalPrice?: number;
  material: string;
  waterproof: boolean;
  isFeatured: boolean;
  isActive: boolean;
  imageUrls: string[];
  stockQuantity: number;
  sku: string;
}

export interface UpdateProductInput {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  imageUrls: string[];
  previousImageIds?: string[];
}

/**
 * Obtiene todas las categorías disponibles para el selector.
 */
export async function getCategories(): Promise<CategoryOption[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug")
      .order("name");

    if (error || !data) {
      console.error("Error obteniendo categorías:", error);
      return [];
    }

    return data;
  } catch (err) {
    console.error("Error en getCategories:", err);
    return [];
  }
}

/**
 * Obtiene todos los productos (activos e inactivos) para la gestión en /admin.
 */
export async function getAdminProducts(): Promise<AdminProduct[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
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
        is_active,
        category:categories(slug, name),
        images:product_images(id, image_url, is_primary, display_order),
        variants:product_variants(stock_quantity, sku)
      `)
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.error("Error obteniendo inventario en admin:", error);
      return [];
    }

    return data.map((p) => {
      const categoryData = Array.isArray(p.category) ? p.category[0] : p.category;
      const rawImages = Array.isArray(p.images) ? [...p.images] : [];
      rawImages.sort((a, b) => {
        if (Boolean(a.is_primary) !== Boolean(b.is_primary)) {
          return a.is_primary ? -1 : 1;
        }
        return (a.display_order ?? 0) - (b.display_order ?? 0);
      });

      const imageRecords: ProductImageItem[] = rawImages
        .filter((img) => Boolean(img.image_url?.trim()))
        .map((img, idx) => ({
          id: String(img.id),
          imageUrl: img.image_url.trim(),
          displayOrder: img.display_order ?? idx + 1,
          isPrimary: Boolean(img.is_primary),
        }));

      const imageUrls = imageRecords.map((img) => img.imageUrl);

      const variants = Array.isArray(p.variants) ? p.variants : [];
      const stockQuantity =
        variants.length > 0
          ? variants.reduce((sum, v) => sum + Math.max(0, Number(v.stock_quantity) || 0), 0)
          : 10;

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: Number(p.price),
        originalPrice: p.original_price ? Number(p.original_price) : undefined,
        category: (categoryData?.slug as AdminProduct["category"]) || "coleccion-marina",
        categoryName: categoryData?.name || "Colección Marina",
        images: imageUrls.length > 0 ? imageUrls : [PRODUCT_FALLBACK_SRC],
        imageRecords,
        isFeatured: p.is_featured,
        isActive: Boolean(p.is_active),
        material: p.material,
        waterproof: p.waterproof,
        inStock: stockQuantity > 0,
        stockQuantity,
        sku: variants[0]?.sku || undefined,
      };
    });
  } catch (err) {
    console.error("Excepción en getAdminProducts:", err);
    return [];
  }
}

/**
 * Sube una imagen directamente al bucket 'product-images' de Supabase Storage.
 * Retorna la URL pública accesible o el mensaje de error exacto.
 */
export async function uploadProductImage(
  file: File,
): Promise<{ url: string | null; error?: string }> {
  try {
    const supabase = getSupabaseClient();

    const rawExt = file.name.includes(".") ? (file.name.split(".").pop() ?? "") : "";
    const fileExt = rawExt.replace(/[^a-z0-9]/gi, "").toLowerCase() || "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || undefined,
      });

    if (uploadError) {
      console.error("Error subiendo imagen al storage de Supabase:", uploadError);
      return { url: null, error: uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage.from("product-images").getPublicUrl(filePath);

    return { url: publicUrlData.publicUrl };
  } catch (err) {
    console.error("Excepción en uploadProductImage:", err);
    return {
      url: null,
      error: err instanceof Error ? err.message : "Error inesperado al subir la imagen.",
    };
  }
}

/**
 * Inserta un nuevo producto completo (producto + imagen principal + stock),
 * propagando errores de tablas dependientes para evitar registros incompletos.
 */
export async function createAdminProduct(
  input: NewProductInput,
): Promise<{ success: boolean; error?: string; productId?: string }> {
  try {
    const supabase = getSupabaseClient();
    const productId = crypto.randomUUID();

    // 1. Insertar en tabla products
    const { error: productError } = await supabase.from("products").insert({
      id: productId,
      category_id: input.categoryId,
      name: input.name,
      slug: input.slug,
      description: input.description,
      price: input.price,
      original_price: input.originalPrice || null,
      material: input.material,
      waterproof: input.waterproof,
      is_featured: input.isFeatured,
      is_active: input.isActive,
    });

    if (productError) {
      console.error("Error creando producto:", productError);
      return { success: false, error: productError.message };
    }

    // 2. Insertar imágenes reales en product_images (sin persistir el fallback)
    const urlsToInsert = normalizeProductImageUrls(input.imageUrls);

    if (urlsToInsert.length > 0) {
      const imageRows = urlsToInsert.map((url, idx) => ({
        id: crypto.randomUUID(),
        product_id: productId,
        image_url: url,
        display_order: idx + 1,
        is_primary: idx === 0,
      }));

      const { error: imageError } = await supabase.from("product_images").insert(imageRows);

      if (imageError) {
        console.error("Error asociando imágenes al producto:", imageError);
        await supabase.from("products").delete().eq("id", productId);
        return {
          success: false,
          error: `No se pudieron registrar las imágenes del producto: ${imageError.message}`,
        };
      }
    }

    // 3. Insertar variante de stock en product_variants
    const sku = input.sku.trim() || `MT-${Date.now().toString().slice(-6)}`;
    const { error: variantError } = await supabase.from("product_variants").insert({
      id: crypto.randomUUID(),
      product_id: productId,
      sku,
      color: "Plateado",
      size: "Única",
      stock_quantity: input.stockQuantity,
    });

    if (variantError) {
      console.error("Error asociando variante de stock:", variantError);
      await supabase.from("products").delete().eq("id", productId);
      return {
        success: false,
        error: `No se pudo registrar el inventario/SKU: ${variantError.message}`,
      };
    }

    return { success: true, productId };
  } catch (err) {
    console.error("Excepción en createAdminProduct:", err);
    return { success: false, error: "Ocurrió un error inesperado al guardar el producto." };
  }
}

/**
 * Actualiza nombre, precios y galería de imágenes de un producto existente.
 * Inserta las nuevas imágenes antes de eliminar las anteriores para evitar dejar el producto sin fotos.
 */
export async function updateAdminProduct(
  input: UpdateProductInput,
): Promise<{ success: boolean; error?: string }> {
  try {
    const trimmedName = input.name.trim();
    if (!trimmedName) {
      return { success: false, error: "El nombre del producto es obligatorio." };
    }

    if (!Number.isFinite(input.price) || input.price <= 0) {
      return { success: false, error: "El precio de venta debe ser mayor a $0 COP." };
    }

    if (
      input.originalPrice !== undefined &&
      input.originalPrice !== null &&
      (!Number.isFinite(input.originalPrice) || input.originalPrice <= input.price)
    ) {
      return {
        success: false,
        error: "El precio anterior debe ser mayor al precio de venta.",
      };
    }

    const cleanedUrls = normalizeProductImageUrls(input.imageUrls);
    const supabase = getSupabaseClient();

    // 1. Obtener IDs actuales de imágenes en BD antes de modificar
    const { data: existingImages, error: existingImagesError } = await supabase
      .from("product_images")
      .select("id")
      .eq("product_id", input.id);

    if (existingImagesError) {
      console.error("Error consultando imágenes actuales del producto:", existingImagesError);
      return {
        success: false,
        error: `No se pudieron consultar las imágenes actuales del producto: ${existingImagesError.message}`,
      };
    }

    const previousIds = Array.isArray(existingImages)
      ? existingImages.map((img) => String(img.id))
      : [];

    if (cleanedUrls.length === 0 && previousIds.length > 0) {
      return {
        success: false,
        error: "Agrega al menos una imagen real del producto.",
      };
    }

    // 2. Actualizar datos principales en public.products (verificando filas afectadas ante RLS)
    const { data: updatedRows, error: productError } = await supabase
      .from("products")
      .update({
        name: trimmedName,
        price: input.price,
        original_price: input.originalPrice ?? null,
      })
      .eq("id", input.id)
      .select("id");

    if (productError) {
      console.error("Error actualizando producto:", productError);
      return { success: false, error: productError.message };
    }

    if (!updatedRows || updatedRows.length === 0) {
      return {
        success: false,
        error:
          "Supabase bloqueó la actualización del producto por políticas RLS. Ejecuta supabase/admin_policies.sql en tu SQL Editor.",
      };
    }

    // 3. Sincronizar galería solo si hay imágenes reales para guardar
    if (cleanedUrls.length > 0) {
      const newImageRows = cleanedUrls.map((url, idx) => ({
        id: crypto.randomUUID(),
        product_id: input.id,
        image_url: url,
        display_order: idx + 1,
        is_primary: idx === 0,
      }));

      const { error: insertImagesError } = await supabase
        .from("product_images")
        .insert(newImageRows);

      if (insertImagesError) {
        console.error("Error insertando nuevas imágenes:", insertImagesError);
        return {
          success: false,
          error: `Se actualizó el producto, pero no se pudieron guardar las imágenes: ${insertImagesError.message}`,
        };
      }

      // 4. Eliminar las filas anteriores si existían (verificando filas eliminadas ante RLS)
      if (previousIds.length > 0) {
        const { data: deletedRows, error: deleteOldError } = await supabase
          .from("product_images")
          .delete()
          .eq("product_id", input.id)
          .in("id", previousIds)
          .select("id");

        if (deleteOldError || !deletedRows || deletedRows.length === 0) {
          console.error("Error eliminando imágenes anteriores:", deleteOldError);
          // Revertir las imágenes recién insertadas para evitar duplicados
          await supabase
            .from("product_images")
            .delete()
            .eq("product_id", input.id)
            .in(
              "id",
              newImageRows.map((row) => row.id),
            );
          return {
            success: false,
            error: deleteOldError
              ? `No se pudieron reemplazar las imágenes anteriores: ${deleteOldError.message}`
              : "Supabase bloqueó la eliminación de las imágenes anteriores por políticas RLS. Ejecuta supabase/admin_policies.sql en tu SQL Editor.",
          };
        }
      }
    }

    return { success: true };
  } catch (err) {
    console.error("Excepción en updateAdminProduct:", err);
    return { success: false, error: "Ocurrió un error inesperado al actualizar el producto." };
  }
}

/**
 * Elimina un producto por su ID.
 */
export async function deleteAdminProduct(productId: string): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from("products").delete().eq("id", productId);
    return !error;
  } catch (err) {
    console.error("Error eliminando producto:", err);
    return false;
  }
}

/**
 * Cambia el estado activo/inactivo de un producto.
 */
export async function toggleProductStatus(
  productId: string,
  currentStatus: boolean,
): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from("products")
      .update({ is_active: !currentStatus })
      .eq("id", productId);
    return !error;
  } catch (err) {
    console.error("Error cambiando estado del producto:", err);
    return false;
  }
}
