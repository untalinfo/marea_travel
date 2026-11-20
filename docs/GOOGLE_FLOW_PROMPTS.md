# Guía de Recursos Visuales — Google Flow (Marea Travel)

Este documento reúne los **prompts exactos**, proporciones, dimensiones y rutas de integración para generar las fotografías editoriales y packshots de **Marea Travel** en Google Flow (Imagen / Whisk / Flow) y reemplazar los respaldos SVG locales sin romper referencias ni rutas.

> **Estado actual del proyecto:** Todos los espacios visuales cuentan con gráficos SVG editoriales locales en `public/images/` y protección automática con `<StoreImage>` (respaldo a `/images/product-fallback.svg`), por lo que la tienda compila y carga sin imágenes rotas (`naturalWidth > 0`) desde el primer momento.

---

## 1. Matriz de Activos para Google Flow

| # | Espacio en la tienda | Archivo o destino exacto | Proporción y resolución | Prompt listo para copiar y pegar en Google Flow |
|---|---|---|---|---|
| 1 | **Hero Editorial** (`HeroBanner.tsx`) | `public/images/hero-coastal.webp` | **4:5** (`1200×1500` px) o **16:9** (`1920×1080` px) | `Editorial fashion still-life photography of a minimalist brushed 316L silver stainless steel pendant necklace and fine link bracelet resting naturally on sun-warmed pale coastal limestone rock beside calm turquoise Colombian Caribbean water, Cartagena morning light, crisp metallic specular highlights, shallow depth of field, warm neutral tones (#F6F4EF stone and deep ocean blue), Kodak Portra 400 film aesthetic, no text, no watermarks, no logos.` |
| 2 | **Sección Materiales y Cuidado 316L** (`src/app/page.tsx`) | `public/images/story-craft.webp` | **4:3** (`1200×900` px) | `Close-up macro editorial product photography of crisp crystal saltwater droplets beading on a minimalist 316L polished stainless steel ocean wave pendant resting on wet coastal limestone and smooth grey sea stone, soft diffused afternoon sunlight, minimalist luxury coastal jewelry campaign, warm ivory and slate palette, razor sharp metallic focus, no text, no watermarks.` |
| 3 | **Producto 1: Cadena Dije Ballena Marea 316L** | Subir en `/admin` (bucket `product-images`) o `public/images/prod-cadena-ballena.webp` | **1:1** (`1024×1024` px) | `Clean studio e-commerce jewelry packshot on a warm off-white limestone pedestal (#F6F4EF background), minimalist 316L silver stainless steel fine chain necklace with a sculpted whale tail pendant, soft diffused coastal window daylight from the left, crisp natural shadow, high-detail brushed steel reflection, zero props clutter, no text, no logos.` |
| 4 | **Producto 2: Pulsera Ola Minimalista Steel** | Subir en `/admin` (bucket `product-images`) o `public/images/prod-pulsera-ola.webp` | **1:1** (`1024×1024` px) | `Clean studio e-commerce jewelry packshot on a warm off-white limestone pedestal (#F6F4EF background), delicate 316L silver stainless steel link bracelet featuring a minimalist curved ocean wave charm, soft diffused natural daylight, subtle limestone texture, sharp focus on metallic links, editorial minimalism, no text, no watermarks.` |
| 5 | **Producto 3: Anillo Brújula del Viajero** | Subir en `/admin` (bucket `product-images`) o `public/images/prod-anillo-brujula.webp` | **1:1** (`1024×1024` px) | `Clean studio e-commerce jewelry packshot on a warm off-white limestone pedestal (#F6F4EF background), unisex polished 316L stainless steel signet ring standing upright with a crisp minimalist compass rose engraving on the face, soft coastal studio lighting, subtle shadow on stone, sharp metal edges, no text, no props clutter.` |
| 6 | **Producto 4: Cadena Mantarraya Minimal** | Subir en `/admin` (bucket `product-images`) o `public/images/prod-cadena-mantarraya.webp` | **1:1** (`1024×1024` px) | `Clean studio e-commerce jewelry packshot on a warm off-white limestone pedestal (#F6F4EF background), fine 316L stainless steel chain necklace with a sleek geometric manta ray pendant arranged neatly in the center, soft diffused coastal daylight, subtle natural shadow, luxury minimalist aesthetic, no text, no logos.` |

---

## 2. Integración en la Aplicación (Paso a Paso)

### A. Integrar Hero y Fotografía de Materiales (`.webp` locales)
1. Descarga las imágenes #1 y #2 desde Google Flow y expórtalas en formato `.webp` (calidad `82–88`).
2. Guárdalas exactamente en:
   - `public/images/hero-coastal.webp`
   - `public/images/story-craft.webp`
3. Actualiza las constantes en `src/lib/brand-assets.ts`:
   ```ts
   export const HERO_IMAGE_SRC = "/images/hero-coastal.webp";
   export const STORY_IMAGE_SRC = "/images/story-craft.webp";
   ```
4. No es necesario tocar `HeroBanner.tsx` ni `src/app/page.tsx`: ambos consumen `HERO_IMAGE_SRC` y `STORY_IMAGE_SRC` con `<StoreImage>` y `sizes` optimizados.

### B. Integrar Fotografías de Productos desde `/admin` (Supabase Storage)
1. Ingresa a `http://localhost:3000/admin` (o tu dominio en producción) con tu PIN de administrador.
2. En la pestaña **Nuevo accesorio** (o actualizando los registros existentes en Supabase), utiliza el cargador **Seleccionar foto** para subir cada packshot `1:1` (#3 a #6) al bucket público `product-images` de Supabase Storage.
3. Si prefieres usar archivos locales temporales antes de cargarlos a Storage, colócalos en `public/images/` y pega la ruta `/images/prod-...webp` en el campo de URL externa.
4. `next.config.ts` ya autoriza `*.supabase.co` para `next/image`. Una vez reemplaces las URLs semilla de Unsplash en Supabase por tus archivos en `product-images`, puedes retirar `images.unsplash.com` de `next.config.ts`.
