-- ==============================================================================
-- POLÍTICAS DE ADMINISTRACIÓN PARA CARGA Y EDICIÓN DE PRODUCTOS E IMÁGENES
-- ==============================================================================
-- Script idempotente: se puede copiar, pegar y ejecutar completo en el SQL Editor
-- de Supabase aunque algunas políticas ya existieran.

-- 0. Asegurar que el bucket público 'product-images' exista
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 1. Permitir leer, crear, editar y borrar productos desde el panel /admin
DROP POLICY IF EXISTS "Admin lectura total de productos" ON public.products;
DROP POLICY IF EXISTS "Admin insercion de productos" ON public.products;
DROP POLICY IF EXISTS "Admin actualizacion de productos" ON public.products;
DROP POLICY IF EXISTS "Admin eliminacion de productos" ON public.products;

CREATE POLICY "Admin lectura total de productos" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admin insercion de productos" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin actualizacion de productos" ON public.products FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Admin eliminacion de productos" ON public.products FOR DELETE USING (true);

-- 2. Permitir gestionar imágenes de productos
DROP POLICY IF EXISTS "Admin insercion de imagenes" ON public.product_images;
DROP POLICY IF EXISTS "Admin actualizacion de imagenes" ON public.product_images;
DROP POLICY IF EXISTS "Admin eliminacion de imagenes" ON public.product_images;

CREATE POLICY "Admin insercion de imagenes" ON public.product_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin actualizacion de imagenes" ON public.product_images FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Admin eliminacion de imagenes" ON public.product_images FOR DELETE USING (true);

-- 3. Permitir gestionar variantes (stock y SKU)
DROP POLICY IF EXISTS "Admin insercion de variantes" ON public.product_variants;
DROP POLICY IF EXISTS "Admin actualizacion de variantes" ON public.product_variants;
DROP POLICY IF EXISTS "Admin eliminacion de variantes" ON public.product_variants;

CREATE POLICY "Admin insercion de variantes" ON public.product_variants FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin actualizacion de variantes" ON public.product_variants FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Admin eliminacion de variantes" ON public.product_variants FOR DELETE USING (true);

-- 4. Permitir leer, subir, actualizar y eliminar imágenes en el Storage Bucket 'product-images'
DROP POLICY IF EXISTS "Lectura publica de imagenes en storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin subida de imagenes en storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin actualizacion de imagenes en storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin eliminacion de imagenes en storage" ON storage.objects;

CREATE POLICY "Lectura publica de imagenes en storage" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admin subida de imagenes en storage" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Admin actualizacion de imagenes en storage" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images') WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Admin eliminacion de imagenes en storage" ON storage.objects FOR DELETE USING (bucket_id = 'product-images');
