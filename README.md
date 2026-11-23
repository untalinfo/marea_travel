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
2. Ejecuta `supabase/admin_policies.sql`. Elimina las políticas abiertas anteriores y restringe la escritura (productos, imágenes, variantes y bucket `product-images`) a usuarios con rol `admin`. La lectura del catálogo y la creación de pedidos siguen siendo públicas.
3. Si algún precio quedó incorrecto, ejecuta `supabase/fix_prices.sql` para restaurar los precios de los cuatro productos semilla.

## Acceso al Panel Administrativo (`/admin`)

`/admin` usa Supabase Auth (correo + contraseña). La variable `NEXT_PUBLIC_ADMIN_PIN` ya no existe y puede eliminarse de tu `.env.local`. La verificación del rol en el navegador es solo de experiencia de usuario; la seguridad real la aplican las políticas RLS en Supabase.

1. En Supabase: **Authentication > Users > Add user** (correo y contraseña).
2. Ejecuta `supabase/admin_policies.sql` en el SQL Editor.
3. Otorga el rol de administrador (usa `app_metadata`, que el usuario no puede editar):

   ```sql
   UPDATE auth.users
   SET raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb
   WHERE email = 'TU_CORREO';
   ```

4. Inicia sesión en `/admin`. Si ya tenías una sesión abierta, ciérrala y vuelve a entrar para que el rol llegue al token.

Validaciones de precio en el panel: precio de venta mínimo de $15.000 COP y descuento máximo del 60% (`MIN_PRICE_COP` y `MAX_DISCOUNT_RATIO` en `src/lib/supabase/admin.ts`).

## Recursos Visuales y Google Flow

La aplicación incluye recursos SVG locales en `public/images/` como respaldo inmediato. Para reemplazarlos con fotografía editorial generada en Google Flow (`.webp` y packshots 1:1 para subir desde `/admin`), consulta la guía paso a paso en `docs/GOOGLE_FLOW_PROMPTS.md`.
