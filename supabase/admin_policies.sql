-- ==============================================================================
-- POLÍTICAS DE ADMINISTRACIÓN (SOLO USUARIOS CON ROL admin)
-- ==============================================================================
-- Script idempotente: se puede copiar, pegar y ejecutar completo en el SQL Editor
-- de Supabase aunque algunas políticas ya existieran.
--
-- Las escrituras (INSERT/UPDATE/DELETE) en products, product_images,
-- product_variants y en el bucket 'product-images' quedan restringidas a usuarios
-- autenticados cuyo JWT tenga app_metadata.role = 'admin'.
--
-- CÓMO OTORGAR EL ROL ADMIN
-- 1. Crea el usuario en Supabase Dashboard > Authentication > Users (email + contraseña).
-- 2. Ejecuta (reemplazando el correo):
--
--    UPDATE auth.users
--    SET raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb
--    WHERE email = 'YOUR_EMAIL';
--
-- Se usa app_metadata (y NO user_metadata) porque app_metadata no puede ser
-- editado por el propio usuario. El usuario debe cerrar sesión y volver a
-- iniciarla para que su JWT incluya el nuevo rol.
-- ==============================================================================

-- 0. Asegurar que el bucket público 'product-images' exista
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 1. Función auxiliar: ¿el JWT actual pertenece a un administrador?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  SELECT COALESCE((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- 2. Eliminar TODAS las políticas permisivas anteriores (por su nombre exacto)
DROP POLICY IF EXISTS "Admin lectura total de productos" ON public.products;
DROP POLICY IF EXISTS "Admin insercion de productos" ON public.products;
DROP POLICY IF EXISTS "Admin actualizacion de productos" ON public.products;
DROP POLICY IF EXISTS "Admin eliminacion de productos" ON public.products;

DROP POLICY IF EXISTS "Admin insercion de imagenes" ON public.product_images;
DROP POLICY IF EXISTS "Admin actualizacion de imagenes" ON public.product_images;
DROP POLICY IF EXISTS "Admin eliminacion de imagenes" ON public.product_images;

DROP POLICY IF EXISTS "Admin insercion de variantes" ON public.product_variants;
DROP POLICY IF EXISTS "Admin actualizacion de variantes" ON public.product_variants;
DROP POLICY IF EXISTS "Admin eliminacion de variantes" ON public.product_variants;

DROP POLICY IF EXISTS "Lectura publica de imagenes en storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin subida de imagenes en storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin actualizacion de imagenes en storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin eliminacion de imagenes en storage" ON storage.objects;

-- 3. Productos: lectura total (incluye inactivos) solo para admins.
--    El catálogo público sigue usando "Lectura publica de productos" (schema.sql).
CREATE POLICY "Admin lectura total de productos" ON public.products
  FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admin insercion de productos" ON public.products
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin actualizacion de productos" ON public.products
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin eliminacion de productos" ON public.products
  FOR DELETE TO authenticated USING (public.is_admin());

-- 4. Imágenes de productos
CREATE POLICY "Admin insercion de imagenes" ON public.product_images
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin actualizacion de imagenes" ON public.product_images
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin eliminacion de imagenes" ON public.product_images
  FOR DELETE TO authenticated USING (public.is_admin());

-- 5. Variantes (stock y SKU)
CREATE POLICY "Admin insercion de variantes" ON public.product_variants
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin actualizacion de variantes" ON public.product_variants
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin eliminacion de variantes" ON public.product_variants
  FOR DELETE TO authenticated USING (public.is_admin());

-- 6. Storage bucket 'product-images': lectura pública, escritura solo admins
CREATE POLICY "Lectura publica de imagenes en storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admin subida de imagenes en storage" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());
CREATE POLICY "Admin actualizacion de imagenes en storage" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());
CREATE POLICY "Admin eliminacion de imagenes en storage" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'product-images' AND public.is_admin());

-- Nota: las políticas de pedidos de schema.sql (customers, orders, order_items)
-- permiten únicamente INSERT público para el checkout; no hay SELECT público, así
-- que este script no las modifica.
