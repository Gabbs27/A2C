-- ============================================
-- A2C International - Database Schema
-- ============================================
-- Run this in Supabase Dashboard > SQL Editor

-- Vehicles table
CREATE TABLE vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price_usd NUMERIC NOT NULL,
  mileage INTEGER DEFAULT 0,
  fuel_type TEXT DEFAULT 'gasolina',
  transmission TEXT DEFAULT 'automatica',
  engine TEXT,
  color TEXT,
  interior_color TEXT,
  doors INTEGER DEFAULT 4,
  condition TEXT DEFAULT 'usado',
  body_type TEXT DEFAULT 'sedan',
  description TEXT,
  features TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'disponible',
  location TEXT DEFAULT 'Santo Domingo, RD',
  vin TEXT,
  inspection_notes TEXT,
  vehicle_history TEXT,
  featured BOOLEAN DEFAULT false,
  instagram_url TEXT
);

-- Vehicle images table
CREATE TABLE vehicle_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false
);

-- Exchange rates table
CREATE TABLE exchange_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usd_to_dop NUMERIC NOT NULL DEFAULT 58.50,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Site settings table
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Insert default exchange rate
INSERT INTO exchange_rates (usd_to_dop) VALUES (58.50);

-- Insert default site settings
INSERT INTO site_settings (key, value) VALUES
  ('whatsapp_number', '+18294470259'),
  ('phone_number', '+18294470259'),
  ('email', 'info@a2cinternational.com'),
  ('address', 'Avenida 6, Santo Domingo 11114, República Dominicana');

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- Row Level Security (RLS)
-- ============================================

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can view vehicles" ON vehicles FOR SELECT USING (true);
CREATE POLICY "Public can view images" ON vehicle_images FOR SELECT USING (true);
CREATE POLICY "Public can view rates" ON exchange_rates FOR SELECT USING (true);
CREATE POLICY "Public can view settings" ON site_settings FOR SELECT USING (true);

-- Admin write access (authenticated users only)
CREATE POLICY "Admin can insert vehicles" ON vehicles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin can update vehicles" ON vehicles FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin can delete vehicles" ON vehicles FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin can insert images" ON vehicle_images FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin can update images" ON vehicle_images FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin can delete images" ON vehicle_images FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin can insert rates" ON exchange_rates FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin can update rates" ON exchange_rates FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Admin can update settings" ON site_settings FOR UPDATE TO authenticated USING (true);

-- ============================================
-- Storage bucket (create manually in dashboard)
-- ============================================
-- Go to Storage > New Bucket > Name: "vehicle-images" > Public: ON
