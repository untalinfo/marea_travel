-- ==============================================================================
-- MAREA TRAVEL - ESQUEMA DE BASE DE DATOS PARA SUPABASE (POSTGRESQL)
-- ==============================================================================
-- Este script crea las tablas, políticas de seguridad (RLS), almacenamiento de imágenes
-- y datos iniciales para el e-commerce Marea Travel.
-- Instrucciones: Copiar y pegar todo este contenido en el SQL Editor de Supabase.
-- ==============================================================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. TABLA DE CATEGORÍAS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 2. TABLA DE PRODUCTOS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(12, 2) CHECK (original_price >= 0),
    material VARCHAR(150) DEFAULT 'Acero Inoxidable 316L' NOT NULL,
    waterproof BOOLEAN DEFAULT true NOT NULL,
    is_featured BOOLEAN DEFAULT false NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 3. TABLA DE VARIANTES DE PRODUCTO (Tallas/Colores/SKUs)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    color VARCHAR(50),
    size VARCHAR(50),
    price_override NUMERIC(12, 2) CHECK (price_override >= 0),
    stock_quantity INT DEFAULT 0 NOT NULL CHECK (stock_quantity >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 4. TABLA DE IMÁGENES DE PRODUCTOS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    display_order INT DEFAULT 0 NOT NULL,
    is_primary BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 5. TABLA DE CLIENTES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address_line TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 6. TABLA DE PEDIDOS (ORDERS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'pendiente' NOT NULL, -- pendiente, pagado, enviado, entregado, cancelado
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    payment_gateway VARCHAR(50) DEFAULT 'whatsapp' NOT NULL, -- whatsapp, mercadopago, wompi, pse
    payment_id VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 7. TABLA DE DETALLE DE PEDIDOS (ORDER ITEMS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- POLÍTICAS DE SEGURIDAD RLS (ROW LEVEL SECURITY)
-- ==============================================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 1. Lectura pública para el catálogo (Cualquier visitante puede ver productos e imágenes)
CREATE POLICY "Lectura publica de categorias" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Lectura publica de productos" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Lectura publica de variantes" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Lectura publica de imagenes" ON public.product_images FOR SELECT USING (true);

-- 2. Inserción de pedidos (Cualquier cliente puede crear una orden y cliente durante el checkout)
CREATE POLICY "Insercion publica de clientes" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Insercion publica de ordenes" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Insercion publica de items de orden" ON public.order_items FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- CONFIGURACIÓN DE STORAGE BUCKET (IMÁGENES DE PRODUCTOS)
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Lectura publica de imagenes en storage" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-images');

-- ==============================================================================
-- SEED DATA (DATOS INICIALES DEL MVP MARINO)
-- ==============================================================================

-- Insertar Categorías
INSERT INTO public.categories (id, name, slug, description) VALUES
('11111111-1111-1111-1111-111111111111', 'Colección Marina', 'coleccion-marina', 'Accesorios inspirados en criaturas y elementos del océano.'),
('22222222-2222-2222-2222-222222222222', 'Cadenas', 'cadenas', 'Cadenas minimalistas de acero inoxidable 316L.'),
('33333333-3333-3333-3333-333333333333', 'Pulseras', 'pulseras', 'Pulseras marineras y de eslabones finos.'),
('44444444-4444-4444-4444-444444444444', 'Anillos', 'anillos', 'Anillos del viajero resistentes al agua salada.')
ON CONFLICT (slug) DO NOTHING;

-- Insertar Productos MVP
INSERT INTO public.products (id, category_id, name, slug, description, price, original_price, material, waterproof, is_featured, is_active) VALUES
(
    'a1b2c3d4-0001-4000-8000-000000000001',
    '11111111-1111-1111-1111-111111111111',
    'Cadena Dije Ballena Marea 316L',
    'cadena-dije-ballena-marea-316l',
    'Cadena minimalista con dije de cola de ballena esculpida en acero inoxidable 316L. Ultra resistente al agua salada, sudor y sol.',
    79000.00,
    95000.00,
    'Acero Inoxidable 316L (Grado Marino)',
    true,
    true,
    true
),
(
    'a1b2c3d4-0002-4000-8000-000000000002',
    '33333333-3333-3333-3333-333333333333',
    'Pulsera Ola Minimalista Steel',
    'pulsera-ola-minimalista-steel',
    'Pulsera de eslabones finos con silueta de ola marina. Diseñada para acompañarte en la playa, en el mar o en la montaña.',
    65000.00,
    79000.00,
    'Acero Inoxidable 316L',
    true,
    true,
    true
),
(
    'a1b2c3d4-0003-4000-8000-000000000003',
    '44444444-4444-4444-4444-444444444444',
    'Anillo Brújula del Viajero',
    'anillo-brujula-del-viajero',
    'Anillo unisex grabado con la rosa de los vientos. Tu recordatorio diario de mantener la dirección en cualquier aventura.',
    58000.00,
    NULL,
    'Acero Inoxidable 316L Pulido',
    true,
    true,
    true
),
(
    'a1b2c3d4-0004-4000-8000-000000000004',
    '11111111-1111-1111-1111-111111111111',
    'Cadena Mantarraya Minimal',
    'cadena-mantarraya-minimal',
    'Dije geométrico de mantarraya marina sobre cadena delicada. Resistencia extrema al agua de mar y al sol de verano.',
    82000.00,
    99000.00,
    'Acero Inoxidable 316L',
    true,
    true,
    true
)
ON CONFLICT (slug) DO NOTHING;

-- Insertar Imágenes de Producto
INSERT INTO public.product_images (product_id, image_url, display_order, is_primary) VALUES
('a1b2c3d4-0001-4000-8000-000000000001', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80', 1, true),
('a1b2c3d4-0002-4000-8000-000000000002', 'https://images.unsplash.com/photo-1611591475179-62cd34608c02?auto=format&fit=crop&w=800&q=80', 1, true),
('a1b2c3d4-0003-4000-8000-000000000003', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80', 1, true),
('a1b2c3d4-0004-4000-8000-000000000004', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80', 1, true);

-- Insertar Variantes de Producto (Stock inicial)
INSERT INTO public.product_variants (product_id, sku, color, size, stock_quantity) VALUES
('a1b2c3d4-0001-4000-8000-000000000001', 'MT-BAL-SLV', 'Plateado', 'Única (45cm)', 12),
('a1b2c3d4-0002-4000-8000-000000000002', 'MT-OLA-SLV', 'Plateado', 'Ajustable', 15),
('a1b2c3d4-0003-4000-8000-000000000003', 'MT-BRU-SLV-9', 'Plateado', 'Talla 9', 8),
('a1b2c3d4-0004-4000-8000-000000000004', 'MT-MAN-SLV', 'Plateado', 'Única (50cm)', 10)
ON CONFLICT (sku) DO NOTHING;
