-- Create tables
CREATE TABLE IF NOT EXISTS public.cocktails (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.cocktail_ratings (
  id BIGSERIAL PRIMARY KEY,
  cocktail_id BIGINT NOT NULL REFERENCES public.cocktails(id),
  appearance INT NOT NULL,
  taste INT NOT NULL,
  innovativeness INT NOT NULL,
  user_email TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for IP and user agent validation
CREATE INDEX idx_cocktail_ratings_device 
ON public.cocktail_ratings(cocktail_id, ip_address, user_agent);

CREATE TABLE IF NOT EXISTS public.rating_characteristics (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  description TEXT,
  min_rating INT NOT NULL,
  max_rating INT NOT NULL
);

-- Insert initial rating characteristics
INSERT INTO public.rating_characteristics (id, label, description, min_rating, max_rating)
VALUES
  ('appearance', 'Apariencia', 'Evalúa la presentación visual del cóctel', 1, 5),
  ('taste', 'Sabor', 'Evalúa el balance y sabor del cóctel', 1, 5),
  ('innovativeness', 'Innovación', 'Evalúa qué tan original y creativo es el cóctel', 1, 5);

-- Insert sample cocktails
INSERT INTO public.cocktails (name, brand, description)
VALUES
  ('Margarita Clásica', 'Don Julio', 'Margarita tradicional hecha con tequila premium, triple sec y jugo fresco de limón'),
  ('Mojito Especial', 'Bacardi', 'Mojito cubano premium con ron añejo, hierba buena fresca y lima'),
  ('Piña Colada Tropical', 'Malibu', 'Piña colada caribeña con ron de coco, piña fresca y crema de coco');

-- Create feature flags table
CREATE TABLE IF NOT EXISTS public.feature_flags (
  id TEXT PRIMARY KEY,               -- slug único, ej: "VALIDATE_REPEAT_VOTING"
  is_enabled BOOLEAN NOT NULL,       -- indica si la feature está activa o no
  description TEXT,                  -- breve explicación del propósito
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert initial feature flag
INSERT INTO public.feature_flags (id, is_enabled, description)
VALUES ('VALIDATE_REPEAT_VOUTE', true, 'This allow only one vote per device');
