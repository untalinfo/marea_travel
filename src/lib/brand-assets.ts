/**
 * Centraliza rutas visuales y configuración de contacto de Marea Travel.
 *
 * Para integrar las imágenes exportadas desde Google Flow (ver docs/GOOGLE_FLOW_PROMPTS.md):
 * 1. Guarda `public/images/hero-coastal.webp` y actualiza HERO_IMAGE_SRC.
 * 2. Guarda `public/images/story-craft.webp` y actualiza STORY_IMAGE_SRC.
 * 3. Sube los packshots 1:1 desde `/admin` al bucket `product-images` de Supabase.
 */
export const HERO_VIDEO_WEBM_SRC = "/videos/hero-coastal.webm";
export const HERO_VIDEO_MP4_SRC = "/videos/hero-coastal.mp4";
export const HERO_VIDEO_POSTER_SRC = "/images/hero-coastal-poster.webp";
export const STORY_IMAGE_SRC = "/images/story-craft.webp";
export const PRODUCT_FALLBACK_SRC = "/images/product-fallback.svg";

const rawWhatsApp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
export const WHATSAPP_NUMBER = rawWhatsApp.replace(/\D/g, "");
export const HAS_WHATSAPP_NUMBER = WHATSAPP_NUMBER.length >= 10;

export const FREE_SHIPPING_THRESHOLD_COP = 120_000;
