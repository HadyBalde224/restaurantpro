-- ============================================================================
-- MIGRATION — photo_hero_url + photos de démo (Dar Zayna)
-- ----------------------------------------------------------------------------
-- À exécuter dans Supabase : SQL Editor → New query → coller → Run.
-- Ajoute la colonne utilisée par le nouveau Hero plein écran, et rattache
-- des photos de démonstration (Unsplash) à Dar Zayna pour pouvoir vérifier
-- le rendu "image-first" avant que le vrai client n'uploade ses propres photos.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. NOUVELLE COLONNE : image de fond du Hero
-- ---------------------------------------------------------------------------
alter table public.restaurants
  add column if not exists photo_hero_url text;

-- ---------------------------------------------------------------------------
-- 2. PHOTO DE HERO — Dar Zayna
-- ---------------------------------------------------------------------------
update public.restaurants
set photo_hero_url = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80&auto=format&fit=crop'
where slug = 'dar-zayna';

-- ---------------------------------------------------------------------------
-- 3. PHOTOS DE PLATS — Dar Zayna
-- ---------------------------------------------------------------------------
update public.plats set photo_url = 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&q=75&auto=format&fit=crop'
  where restaurant_id = 'a1b2c3d4-0000-0000-0000-000000000001' and nom = 'Harira maison';

update public.plats set photo_url = 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&q=75&auto=format&fit=crop'
  where restaurant_id = 'a1b2c3d4-0000-0000-0000-000000000001' and nom = 'Zaalouk';

update public.plats set photo_url = 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800&q=75&auto=format&fit=crop'
  where restaurant_id = 'a1b2c3d4-0000-0000-0000-000000000001' and nom = 'Tajine poulet citron';

update public.plats set photo_url = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=75&auto=format&fit=crop'
  where restaurant_id = 'a1b2c3d4-0000-0000-0000-000000000001' and nom = 'Tajine kefta aux œufs';

-- Couscous royal : volontairement SANS photo → sert à vérifier le fallback
-- "carte texte élégante" pour les plats sans photo_url.

update public.plats set photo_url = 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=800&q=75&auto=format&fit=crop'
  where restaurant_id = 'a1b2c3d4-0000-0000-0000-000000000001' and nom = 'Pastilla au lait';

update public.plats set photo_url = 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=75&auto=format&fit=crop'
  where restaurant_id = 'a1b2c3d4-0000-0000-0000-000000000001' and nom = 'Thé à la menthe';

update public.plats set photo_url = 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=75&auto=format&fit=crop'
  where restaurant_id = 'a1b2c3d4-0000-0000-0000-000000000001' and nom = 'Jus d''orange pressé';
