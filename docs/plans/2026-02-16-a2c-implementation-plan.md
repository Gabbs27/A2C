# A2C International Dealer Platform - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform A2C static site into a full dealer platform with Supabase backend, vehicle inventory, admin panel, and WhatsApp integration.

**Architecture:** React 18 + Vite SPA with React Router for navigation, Supabase for PostgreSQL database + Auth + Storage. Admin-only auth (no public registration). Existing components preserved and enhanced.

**Tech Stack:** React 18, Vite 5, React Router 6, Supabase JS Client, CSS (existing design system)

---

## Phase 1: Foundation (Router + Supabase Setup)

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install required packages**

Run:
```bash
cd /Users/gabriel/A2C
npm install react-router-dom @supabase/supabase-js
```

**Step 2: Verify installation**

Run: `npm ls react-router-dom @supabase/supabase-js`
Expected: Both packages listed without errors

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add react-router-dom and supabase-js dependencies"
```

---

### Task 2: Supabase Project Setup

**Files:**
- Create: `src/lib/supabase.js`
- Create: `.env.local` (NOT committed)
- Modify: `.gitignore`

**Step 1: Create Supabase project**

Go to https://supabase.com/dashboard and create a new project called "a2c-international". Save the project URL and anon key.

**Step 2: Add env file to gitignore**

Verify `.gitignore` already has `.env*.local`. If not, add it.

**Step 3: Create `.env.local`**

```
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

**Step 4: Create Supabase client**

Create `src/lib/supabase.js`:
```js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Step 5: Commit**

```bash
git add src/lib/supabase.js .gitignore
git commit -m "feat: add Supabase client configuration"
```

---

### Task 3: Database Schema Setup

**Files:**
- Create: `supabase/schema.sql` (reference file, run in Supabase SQL editor)

**Step 1: Create SQL schema file**

Create `supabase/schema.sql` with all tables:

```sql
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

-- Updated_at trigger
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

-- RLS Policies
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can view vehicles" ON vehicles FOR SELECT USING (true);
CREATE POLICY "Public can view images" ON vehicle_images FOR SELECT USING (true);
CREATE POLICY "Public can view rates" ON exchange_rates FOR SELECT USING (true);
CREATE POLICY "Public can view settings" ON site_settings FOR SELECT USING (true);

-- Admin write access (authenticated users)
CREATE POLICY "Admin can insert vehicles" ON vehicles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin can update vehicles" ON vehicles FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin can delete vehicles" ON vehicles FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin can insert images" ON vehicle_images FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin can update images" ON vehicle_images FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin can delete images" ON vehicle_images FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin can update rates" ON exchange_rates FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin can update rates2" ON exchange_rates FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Admin can update settings" ON site_settings FOR UPDATE TO authenticated USING (true);
```

**Step 2: Run in Supabase SQL Editor**

Go to Supabase Dashboard → SQL Editor → paste and run the schema.

**Step 3: Create storage bucket**

In Supabase Dashboard → Storage → Create bucket "vehicle-images" with public access.

**Step 4: Create admin user**

In Supabase Dashboard → Authentication → Add User → create admin email/password.

**Step 5: Commit**

```bash
git add supabase/schema.sql
git commit -m "feat: add database schema for vehicles, images, rates, settings"
```

---

### Task 4: React Router Setup

**Files:**
- Modify: `src/main.jsx`
- Modify: `src/App.jsx`
- Create: `src/pages/HomePage.jsx`
- Create: `src/pages/InventoryPage.jsx` (placeholder)
- Create: `src/pages/VehicleDetailPage.jsx` (placeholder)
- Create: `src/pages/ComparePage.jsx` (placeholder)
- Create: `src/pages/admin/LoginPage.jsx` (placeholder)
- Create: `src/pages/admin/DashboardPage.jsx` (placeholder)
- Create: `src/pages/admin/VehicleFormPage.jsx` (placeholder)
- Create: `src/components/Layout.jsx`

**Step 1: Create Layout component**

Create `src/components/Layout.jsx`:
```jsx
import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

const Layout = () => {
  return (
    <div className="App">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
```

**Step 2: Create HomePage**

Create `src/pages/HomePage.jsx` — move existing App.jsx content here:
```jsx
import React from 'react'
import Hero from '../components/Hero'
import Welcome from '../components/Welcome'
import Services from '../components/Services'
import Features from '../components/Features'
import Contact from '../components/Contact'

const HomePage = () => {
  return (
    <>
      <Hero />
      <Welcome />
      <Services />
      <Features />
      <Contact />
    </>
  )
}

export default HomePage
```

**Step 3: Create placeholder pages**

Create each page file with a simple placeholder component (title text, will be built later).

`src/pages/InventoryPage.jsx`:
```jsx
import React from 'react'

const InventoryPage = () => {
  return (
    <div className="container" style={{ padding: '120px 0 60px' }}>
      <h1>Inventario</h1>
      <p>Próximamente...</p>
    </div>
  )
}

export default InventoryPage
```

Same pattern for `VehicleDetailPage.jsx`, `ComparePage.jsx`, `admin/LoginPage.jsx`, `admin/DashboardPage.jsx`, `admin/VehicleFormPage.jsx`.

**Step 4: Update main.jsx with router**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/A2C">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
```

**Step 5: Update App.jsx with routes**

```jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import InventoryPage from './pages/InventoryPage'
import VehicleDetailPage from './pages/VehicleDetailPage'
import ComparePage from './pages/ComparePage'
import LoginPage from './pages/admin/LoginPage'
import DashboardPage from './pages/admin/DashboardPage'
import VehicleFormPage from './pages/admin/VehicleFormPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="inventario" element={<InventoryPage />} />
        <Route path="vehiculo/:id" element={<VehicleDetailPage />} />
        <Route path="comparar" element={<ComparePage />} />
        <Route path="admin/login" element={<LoginPage />} />
        <Route path="admin" element={<DashboardPage />} />
        <Route path="admin/vehiculos/nuevo" element={<VehicleFormPage />} />
        <Route path="admin/vehiculos/:id" element={<VehicleFormPage />} />
      </Route>
    </Routes>
  )
}

export default App
```

**Step 6: Update Header nav links to use React Router Link**

Change `<a href="#shop">` to `<Link to="/inventario">` etc. in `src/components/Header.jsx`.

**Step 7: Verify dev server runs**

Run: `npm run dev`
Expected: App loads, homepage looks identical to before, can navigate to /inventario placeholder.

**Step 8: Commit**

```bash
git add -A
git commit -m "feat: add React Router with page structure and layout"
```

---

## Phase 2: Auth Context + Admin Login

### Task 5: Auth Context Provider

**Files:**
- Create: `src/context/AuthContext.jsx`

**Step 1: Create auth context**

```jsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
```

**Step 2: Wrap app in AuthProvider**

In `src/main.jsx`, wrap `<App />` with `<AuthProvider>`.

**Step 3: Commit**

```bash
git add src/context/AuthContext.jsx src/main.jsx
git commit -m "feat: add auth context with Supabase authentication"
```

---

### Task 6: Admin Login Page

**Files:**
- Modify: `src/pages/admin/LoginPage.jsx`
- Create: `src/pages/admin/LoginPage.css`

**Step 1: Build login page**

Full login form with email + password fields, error display, redirect to /admin on success. Use existing silver/black design system.

**Step 2: Build ProtectedRoute component**

Create `src/components/ProtectedRoute.jsx`:
```jsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return <div className="loading">Cargando...</div>
  if (!user) return <Navigate to="/admin/login" replace />

  return children
}

export default ProtectedRoute
```

**Step 3: Wrap admin routes with ProtectedRoute in App.jsx**

**Step 4: Verify login works**

Run dev server, go to /admin → redirects to /admin/login. Log in with Supabase admin credentials → redirects to /admin dashboard.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add admin login page and protected routes"
```

---

## Phase 3: Admin Panel (Vehicle CRUD)

### Task 7: Admin Dashboard

**Files:**
- Modify: `src/pages/admin/DashboardPage.jsx`
- Create: `src/pages/admin/DashboardPage.css`

**Step 1: Build dashboard**

Dashboard shows:
- Stats cards: total vehicles, disponible count, vendido count, reservado count
- Fetches from Supabase `vehicles` table with count queries
- "Agregar Vehículo" button → navigates to /admin/vehiculos/nuevo
- "Actualizar Tasa de Cambio" inline form → updates `exchange_rates` table
- List of 5 most recent vehicles with edit/delete buttons

**Step 2: Verify data loads**

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add admin dashboard with vehicle stats"
```

---

### Task 8: Vehicle Form (Add/Edit)

**Files:**
- Modify: `src/pages/admin/VehicleFormPage.jsx`
- Create: `src/pages/admin/VehicleFormPage.css`

**Step 1: Build vehicle form**

Form with all fields from the `vehicles` table, organized in sections:
- **Información Básica:** brand, model, year, price_usd, condition, status
- **Especificaciones:** mileage, fuel_type, transmission, engine, body_type, color, interior_color, doors
- **Descripción:** description (textarea), features (tag input), vehicle_history, inspection_notes
- **Configuración:** featured (checkbox), vin, location, instagram_url

Uses `useParams` to detect if editing (has `:id`) or creating new. Pre-fills form when editing.

**Step 2: Add image upload section**

- Drag & drop zone + file input for multiple images
- Preview thumbnails with reorder (drag) and delete
- Upload to Supabase Storage bucket "vehicle-images"
- Save URLs to `vehicle_images` table
- Mark one image as primary

**Step 3: Add form submission**

- On submit: INSERT or UPDATE `vehicles` table
- Upload new images to storage, insert into `vehicle_images`
- Navigate to /admin on success
- Show error on failure

**Step 4: Verify full CRUD**

Create a test vehicle, verify it appears in dashboard, edit it, delete it.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add vehicle form with image upload and CRUD operations"
```

---

### Task 9: Vehicle Delete + Status Toggle

**Files:**
- Modify: `src/pages/admin/DashboardPage.jsx`

**Step 1: Add delete confirmation**

Modal or confirm dialog before deleting. On delete: remove from `vehicles` table (cascade deletes images), remove images from storage.

**Step 2: Add status toggle**

Quick buttons on each vehicle row: Disponible / Vendido / Reservado. Updates `vehicles.status` with one click.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add vehicle delete and status toggle in admin"
```

---

## Phase 4: Public Vehicle Pages

### Task 10: Vehicle Card Component

**Files:**
- Create: `src/components/VehicleCard.jsx`
- Create: `src/components/VehicleCard.css`

**Step 1: Build VehicleCard**

Reusable card showing:
- Primary image (from `vehicle_images` where `is_primary = true`)
- Brand + Model + Year
- Price in USD (formatted: $XX,XXX) + DOP equivalent below
- Mileage, fuel type, transmission badges
- Status badge (green/yellow/red)
- Click navigates to `/vehiculo/:id`

Fetch exchange rate from `exchange_rates` table (or receive as prop from parent).

**Step 2: Style with existing design system**

Silver/black theme, hover elevation, smooth transitions.

**Step 3: Commit**

```bash
git add src/components/VehicleCard.jsx src/components/VehicleCard.css
git commit -m "feat: add reusable VehicleCard component"
```

---

### Task 11: Inventory Page

**Files:**
- Modify: `src/pages/InventoryPage.jsx`
- Create: `src/pages/InventoryPage.css`

**Step 1: Build inventory page**

- Fetches all vehicles from Supabase with their primary image
- Fetches exchange rate for DOP conversion
- Responsive grid of VehicleCard components
- Search bar (filters brand + model client-side)
- Filter sidebar/bar: brand (dropdown), body_type, year range (min-max), price range (min-max), fuel_type, transmission, condition
- Sort dropdown: precio menor, precio mayor, más nuevo, más antiguo, recién agregado
- Results count: "Mostrando X de Y vehículos"
- Loading skeleton while fetching
- Empty state when no results

**Step 2: Add URL query params for filters**

Filters sync with URL so links are shareable: `/inventario?brand=Toyota&body_type=suv`

**Step 3: Verify with test data**

Add 3-5 test vehicles in Supabase, verify filtering/sorting works.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add inventory page with search, filters, and sorting"
```

---

### Task 12: Vehicle Detail Page

**Files:**
- Modify: `src/pages/VehicleDetailPage.jsx`
- Create: `src/pages/VehicleDetailPage.css`

**Step 1: Build image gallery**

- Large main image with thumbnails below
- Click thumbnail to switch main image
- Fullscreen mode on click (lightbox overlay)
- Swipe support for mobile

**Step 2: Build specs section**

- All vehicle specs in organized table/grid
- Features list with checkmark icons
- Vehicle history section (if present)
- Inspection notes section (if present)

**Step 3: Build price + contact section**

- Price in USD (large, prominent)
- Price in DOP (smaller, below)
- "Preguntar por WhatsApp" button → opens `https://wa.me/WHATSAPP_NUMBER?text=Hola, me interesa el [Brand Model Year] que vi en su página web. ¿Está disponible?`
- "Llamar" button → `tel:` link
- Share buttons: WhatsApp share, Facebook share, copy link

**Step 4: Build financing calculator**

- Input fields: precio (pre-filled), inicial (down payment), tasa de interés (%), plazo (months dropdown: 12, 24, 36, 48, 60, 72)
- Calculates and shows: cuota mensual, total a pagar, total intereses
- Formula: standard amortization `M = P[r(1+r)^n]/[(1+r)^n-1]`

**Step 5: Build related vehicles section**

- Query 3-4 vehicles with same brand or body_type (excluding current)
- Show as VehicleCard grid

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add vehicle detail page with gallery, specs, WhatsApp, calculator"
```

---

### Task 13: Compare Page

**Files:**
- Modify: `src/pages/ComparePage.jsx`
- Create: `src/pages/ComparePage.css`

**Step 1: Build comparison UI**

- URL: `/comparar?ids=uuid1,uuid2,uuid3`
- Fetches vehicles by IDs
- Side-by-side table with all specs
- Highlight differences (different values in a row get a subtle background)
- "Agregar vehículo" slot if < 3 selected → dropdown to pick from inventory

**Step 2: Add "Comparar" button to VehicleCard and VehicleDetailPage**

- Checkbox/button on VehicleCard: "Comparar"
- Selected vehicles stored in localStorage (max 3)
- Floating bar at bottom when 2+ vehicles selected: "Comparar X vehículos" → navigates to /comparar

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add vehicle comparison page"
```

---

## Phase 5: Homepage Enhancements

### Task 14: Featured Vehicles Section on Homepage

**Files:**
- Create: `src/components/FeaturedVehicles.jsx`
- Create: `src/components/FeaturedVehicles.css`
- Modify: `src/pages/HomePage.jsx`

**Step 1: Build FeaturedVehicles component**

- Fetches vehicles where `featured = true` from Supabase (limit 6)
- Grid of VehicleCard components
- Section title: "Vehículos Destacados"
- "Ver Todo el Inventario" button → navigates to /inventario

**Step 2: Add to HomePage between Welcome and Services**

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add featured vehicles section to homepage"
```

---

### Task 15: Hero Quick Search + WhatsApp Floating Button

**Files:**
- Modify: `src/components/Hero.jsx`
- Modify: `src/components/Hero.css`
- Create: `src/components/WhatsAppButton.jsx`
- Create: `src/components/WhatsAppButton.css`
- Modify: `src/components/Layout.jsx`

**Step 1: Add search bar to Hero**

Below the CTA buttons, add a compact search bar: brand dropdown + "Buscar" button → navigates to `/inventario?brand=X`

**Step 2: Build floating WhatsApp button**

Fixed position bottom-right, green WhatsApp icon, opens `wa.me` link. Visible on all pages via Layout.

**Step 3: Update Hero CTA buttons**

"Comprar un Auto" → `<Link to="/inventario">`
"Vender un Auto" → opens WhatsApp with sell message

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add hero search bar and floating WhatsApp button"
```

---

## Phase 6: Instagram Integration + Polish

### Task 16: Instagram Image Import (Admin)

**Files:**
- Create: `src/lib/instagram.js`
- Modify: `src/pages/admin/VehicleFormPage.jsx`

**Step 1: Build Instagram URL parser**

Use Instagram oEmbed API (`https://graph.facebook.com/v18.0/instagram_oembed?url=POST_URL`) to get the thumbnail image from a public post. Note: this requires a Facebook App token. Alternative simpler approach: admin pastes the image URL directly from Instagram.

**Simpler approach:** Add an "Importar desde URL" field where admin can paste any image URL (Instagram or otherwise). The app downloads the image and uploads to Supabase Storage.

**Step 2: Add to vehicle form**

"Agregar imagen desde URL" input field + button in the image upload section.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add image import from URL in admin vehicle form"
```

---

### Task 17: Loading States + Empty States + Error Handling

**Files:**
- Create: `src/components/LoadingSkeleton.jsx`
- Create: `src/components/LoadingSkeleton.css`
- Create: `src/components/EmptyState.jsx`
- Create: `src/components/EmptyState.css`

**Step 1: Build skeleton loader**

Card-shaped skeleton with pulsing animation for vehicle grid loading state.

**Step 2: Build empty state**

Illustration/icon + message for when no vehicles match filters or inventory is empty.

**Step 3: Add to InventoryPage and DashboardPage**

**Step 4: Add error toasts/alerts for failed operations**

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add loading skeletons, empty states, and error handling"
```

---

### Task 18: Mobile Responsiveness Pass + Final Polish

**Files:**
- Modify: various CSS files

**Step 1: Test all pages on mobile viewport (375px)**

Verify: inventory grid stacks to 1 column, filters collapse to a dropdown/modal, vehicle detail gallery works with touch, admin form is usable on mobile.

**Step 2: Fix any layout issues**

**Step 3: Update Header navigation**

Ensure all nav links work with React Router, mobile menu closes on navigation.

**Step 4: Update Footer links**

"Inventario" → Link to /inventario, other links updated.

**Step 5: Commit**

```bash
git add -A
git commit -m "style: mobile responsiveness and final UI polish"
```

---

## Phase 7: Deployment Configuration

### Task 19: Build + Deploy Setup

**Files:**
- Modify: `vite.config.js`

**Step 1: Add SPA fallback for GitHub Pages**

Create `public/404.html` with redirect script for client-side routing on GitHub Pages. Or switch to Vercel/Netlify for better SPA support.

**Step 2: Add environment variable handling for production**

Ensure Supabase env vars are set in deployment environment.

**Step 3: Test production build**

Run: `npm run build && npm run preview`
Verify: all pages work, images load, Supabase connection works.

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: configure deployment for SPA routing"
```

---

## Task Dependency Order

```
Phase 1: Tasks 1→2→3→4 (sequential, each depends on previous)
Phase 2: Tasks 5→6 (sequential)
Phase 3: Tasks 7→8→9 (sequential)
Phase 4: Tasks 10→11→12→13 (10 first, then 11-13 can be parallel)
Phase 5: Tasks 14, 15 (parallel, both independent)
Phase 6: Tasks 16, 17 (parallel), then 18
Phase 7: Task 19 (last)
```

## Total: 19 tasks across 7 phases
