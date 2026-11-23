-- ==============================================================================
-- RESTAURAR PRECIOS DE LOS PRODUCTOS SEMILLA (idempotente)
-- ==============================================================================
-- Ejecutar en el SQL Editor de Supabase solo si los precios quedaron incorrectos.
-- Valores tomados de supabase/schema.sql.

UPDATE public.products SET price = 79000.00, original_price = 95000.00
WHERE slug = 'cadena-dije-ballena-marea-316l';

UPDATE public.products SET price = 65000.00, original_price = 79000.00
WHERE slug = 'pulsera-ola-minimalista-steel';

UPDATE public.products SET price = 58000.00, original_price = NULL
WHERE slug = 'anillo-brujula-del-viajero';

UPDATE public.products SET price = 82000.00, original_price = 99000.00
WHERE slug = 'cadena-mantarraya-minimal';
