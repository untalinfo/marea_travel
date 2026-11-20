# Marea Travel — E-commerce MVP

Tienda en línea de joyería y accesorios minimalistas en acero inoxidable 316L resistentes al agua, diseñada para el mercado colombiano.

## Stack Tecnológico

- **Framework:** Next.js 16 (App Router, Turbopack) + React 19 + TypeScript
- **Estilos:** Tailwind CSS v4 (sistema editorial *Sol, Sal y Acero*)
- **Base de datos y Storage:** Supabase (`@supabase/supabase-js`)
- **Estado del carrito:** Zustand (`persist` en `localStorage`)
- **Calidad de código:** Biome (`pnpm lint` / `pnpm format`)
- **Gestor de paquetes:** `pnpm` (no utilizar `npm` ni generar `package-lock.json`)

## Variables de Entorno (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key

# Panel administrativo (/admin)
NEXT_PUBLIC_ADMIN_PIN=tu_pin_seguro

# WhatsApp oficial para pedidos en Colombia (código país + número sin signos)
NEXT_PUBLIC_WHATSAPP_NUMBER=573001234567
```

## Comandos Principales

```bash
# Instalar dependencias
pnpm install

# Servidor de desarrollo
pnpm dev

# Verificación de lint y formato (Biome)
pnpm lint

# Verificación de tipos TypeScript
pnpm exec tsc --noEmit

# Compilación de producción
pnpm build
```

## Base de Datos y Políticas en Supabase

1. Ejecuta `supabase/schema.sql` en el SQL Editor de tu proyecto Supabase para crear tablas, RLS de catálogo y el bucket `product-images`.
2. Ejecuta `supabase/admin_policies.sql` para habilitar la lectura total, creación, edición, eliminación y carga de imágenes desde `/admin`.

## Recursos Visuales y Google Flow

La aplicación incluye recursos SVG locales en `public/images/` como respaldo inmediato. Para reemplazarlos con fotografía editorial generada en Google Flow (`.webp` y packshots 1:1 para subir desde `/admin`), consulta la guía paso a paso en `docs/GOOGLE_FLOW_PROMPTS.md`.
