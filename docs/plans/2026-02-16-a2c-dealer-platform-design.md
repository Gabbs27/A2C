# A2C International - Dealer Platform Design

**Date:** 2026-02-16
**Status:** Approved

## Overview

Transform the existing A2C International static website into a full-featured single-dealer vehicle platform with admin panel, inventory management, and customer-facing vehicle browsing — inspired by SuperCarros.com but tailored for a single dealer.

## Context

- **Current state:** Static React + Vite SPA with informational sections (hero, services, features, contact, footer). No backend, no database, no auth.
- **Target:** Full dealer platform with inventory, search/filters, admin panel, and WhatsApp integration.
- **Business:** A2C International — luxury/exotic car dealer in Santo Domingo, RD.
- **Instagram:** @a2c_international

## Architecture

**Stack:**
- Frontend: React 18 + Vite (existing) + React Router
- Backend/DB: Supabase (PostgreSQL + Auth + Storage)
- Styling: CSS (existing custom design system, silver/black theme)
- Deploy: GitHub Pages or Vercel (static SPA)

**Key decisions:**
- Single-dealer model — only A2C admin can add vehicles, no public registration
- SPA approach (not SSR) — sufficient SEO for a local dealer driven by Instagram/WhatsApp traffic
- Supabase for rapid development with built-in auth, storage, and real-time capabilities
- Dual currency (USD + DOP) with configurable exchange rate

## Pages & Routes

| Page | Route | Access | Description |
|------|-------|--------|-------------|
| Home | `/` | Public | Landing page with featured vehicles section |
| Inventory | `/inventario` | Public | Vehicle grid with search & filters |
| Vehicle Detail | `/vehiculo/:id` | Public | Full specs, gallery, financing calculator, WhatsApp |
| Compare | `/comparar` | Public | Side-by-side comparison of 2-3 vehicles |
| Admin Login | `/admin/login` | Public | Email + password login (Supabase Auth) |
| Admin Dashboard | `/admin` | Admin only | Stats overview, quick actions |
| Admin Add Vehicle | `/admin/vehiculos/nuevo` | Admin only | Add vehicle form with photo upload |
| Admin Edit Vehicle | `/admin/vehiculos/:id` | Admin only | Edit existing vehicle |

## Database Schema

### Table: `vehicles`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Auto-generated |
| created_at | timestamptz | Auto-generated |
| updated_at | timestamptz | Auto-updated |
| brand | text | Marca (Toyota, BMW, etc.) |
| model | text | Modelo (Camry, X5, etc.) |
| year | integer | Año del vehículo |
| price_usd | numeric | Precio en USD |
| mileage | integer | Kilometraje |
| fuel_type | text | gasolina, diesel, electrico, hibrido |
| transmission | text | automatica, manual |
| engine | text | Motor (e.g., "3.5L V6") |
| color | text | Color exterior |
| interior_color | text | Color interior |
| doors | integer | Número de puertas |
| condition | text | nuevo, usado |
| body_type | text | sedan, suv, pickup, coupe, convertible, van, truck |
| description | text | Descripción libre |
| features | text[] | Array de características (A/C, cámara, sunroof, etc.) |
| status | text | disponible, vendido, reservado |
| location | text | Ubicación del vehículo |
| vin | text | Número de chasis (opcional) |
| inspection_notes | text | Notas de inspección |
| vehicle_history | text | Historial del vehículo |
| featured | boolean | Mostrar en homepage |
| instagram_url | text | URL del post de Instagram |

### Table: `vehicle_images`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Auto-generated |
| vehicle_id | uuid (FK) | References vehicles.id |
| image_url | text | URL en Supabase Storage |
| display_order | integer | Orden de visualización |
| is_primary | boolean | Imagen principal del vehículo |

### Table: `exchange_rates`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Auto-generated |
| usd_to_dop | numeric | Tasa de cambio USD → DOP |
| updated_at | timestamptz | Última actualización |

### Table: `site_settings`
| Column | Type | Description |
|--------|------|-------------|
| key | text (PK) | Setting name |
| value | text | Setting value |

Settings: `whatsapp_number`, `phone_number`, `email`, `address`, `business_hours`

### Row Level Security (RLS)
- `vehicles` and `vehicle_images`: SELECT for everyone, INSERT/UPDATE/DELETE for authenticated admin only
- `exchange_rates` and `site_settings`: SELECT for everyone, UPDATE for admin only

## Features — Customer-Facing

### 1. Vehicle Inventory Page
- Responsive grid of vehicle cards (photo, brand, model, year, price, mileage)
- Filters sidebar: brand, body type, year range, price range, fuel type, transmission, condition
- Search bar (text search across brand + model)
- Sort by: price (asc/desc), year (asc/desc), newest listed
- Status badges: disponible (green), reservado (yellow), vendido (red)
- Pagination or infinite scroll

### 2. Vehicle Detail Page
- Photo gallery with thumbnails, zoom, and fullscreen mode
- Complete specs table
- Features list with icons
- Vehicle history and inspection notes sections
- Dual price display: USD primary + DOP equivalent
- Financing calculator: loan amount, interest rate, term → monthly payment
- "Preguntar por WhatsApp" button → opens WhatsApp with pre-filled message: "Hola, me interesa el [Brand Model Year] que vi en su página web. ¿Está disponible?"
- Share buttons (WhatsApp, Facebook, copy link)
- Related vehicles section (same brand or body type)

### 3. Vehicle Comparison
- Select up to 3 vehicles from inventory
- Side-by-side specs comparison table
- Highlight differences between vehicles

### 4. Homepage Improvements
- Keep existing hero, services, features sections
- Add "Vehículos Destacados" section showing featured vehicles
- Add vehicle count stats ("50+ vehículos en inventario")
- Quick search bar in hero section

### 5. Financing Calculator
- Input: vehicle price, down payment, interest rate, loan term (months)
- Output: monthly payment, total paid, total interest
- Configurable default rates

## Features — Admin Panel

### 1. Authentication
- Supabase Auth with email + password
- No public registration — admin accounts created manually in Supabase
- Protected routes redirect to login

### 2. Dashboard
- Total vehicles count (by status)
- Recently added vehicles
- Quick action buttons (add vehicle, update exchange rate)

### 3. Vehicle CRUD
- Form with all vehicle fields
- Multi-image upload with drag & drop
- Reorder images by dragging
- Import from Instagram: paste IG post URL, extract images
- Preview before publishing
- Change status (disponible/vendido/reservado) with one click

### 4. Exchange Rate Management
- Input current USD → DOP rate
- Shows last updated date

## UI/UX Design

- Maintain existing silver/black luxury aesthetic
- Extend design system with new components (cards, filters, forms, modals)
- Mobile-first responsive design
- WhatsApp floating button on all pages
- Loading skeletons for vehicle cards
- Empty states for no results

## Instagram Integration

- Admin pastes Instagram post URL
- App fetches post images via Instagram oEmbed API (no auth required for public posts)
- Images are downloaded and uploaded to Supabase Storage
- Linked back to original IG post

## Non-Goals (Future Enhancements)

- Customer accounts / registration
- Online payments / deposits
- Chat in real-time
- Email notifications / alerts
- Blog / news section
- Multi-language support
- SEO-optimized SSR (would require Next.js migration)
