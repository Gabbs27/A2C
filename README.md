# A2C International — Sale and Services

Web app de concesionaria de vehículos premium en República Dominicana. Diseño **dark-first, neo-classic magazine** (2026 refresh). Construida con React 18 + Vite + Supabase.

## Stack

- **Framework:** React 18, React Router 7
- **Build:** Vite 5
- **Backend:** Supabase (PostgreSQL + Storage + Auth)
- **Data layer:** TanStack Query (cache, stale-while-revalidate)
- **Styling:** CSS con design tokens, variable fonts (Fraunces + Inter Tight) self-hosted
- **SEO:** react-helmet-async, JSON-LD (AutoDealer + Vehicle), sitemap.xml
- **Testing:** Playwright (E2E smoke)
- **CI:** GitHub Actions (build + Lighthouse + E2E)
- **Deploy:** Vercel (ver `vercel.json`) o GitHub Pages (ver `scripts.deploy`)

## Design System

Paleta **monocromática plata/negro + dorado como único acento**, optimizada para dark-first:

- Superficies: `--ink-950` · `--ink-900` · `--ink-800` · `--ink-700` · `--ink-600`
- Plata (logo): `--silver-100` · `--silver-300` · `--silver-500` · `--silver-700`
- Acento dorado: `--gold-400` · `--gold-500` · `--gold-600`
- Semánticos: `--success` · `--warning` · `--danger` · `--info` · `--whatsapp`

**Tipografía:**
- `Fraunces` (variable, opsz + SOFT + wght axes) — display + body
- `Inter Tight` (variable) — UI chrome (nav, buttons, labels)

Todos los tokens en [`src/index.css`](src/index.css). Motion utilities en [`src/styles/motion.css`](src/styles/motion.css).

**Design docs:**
- [`docs/plans/2026-04-17-refresh-visual-2026-design.md`](docs/plans/2026-04-17-refresh-visual-2026-design.md)
- [`docs/plans/2026-04-17-refresh-visual-2026-implementation.md`](docs/plans/2026-04-17-refresh-visual-2026-implementation.md)

## Desarrollo

```bash
npm install
npm run dev      # dev server at http://localhost:5173/A2C/
```

### Variables de entorno

Crear `.env.local` en la raíz:

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

Tablas esperadas en Supabase:
- `vehicles` — id, brand, model, year, price_usd, mileage, status (disponible/reservado/vendido), featured, etc.
- `vehicle_images` — vehicle_id, image_url, is_primary, display_order
- `exchange_rates` — usd_to_dop, updated_at

## Build

```bash
npm run build    # produces dist/
npm run preview  # local production preview
```

Bundle objetivo:
- JS inicial (public): ~130kb gzipped (react + supabase + query + app shell)
- CSS: ~15kb gzipped (compartido + por ruta)
- Admin bundle se carga solo al entrar a `/admin/*`

## Testing

```bash
npm run test:e2e       # headless Playwright
npm run test:e2e:ui    # interactive UI mode
```

Tests en [`tests/e2e/smoke.spec.js`](tests/e2e/smoke.spec.js). Cubren: home, inventario, búsqueda, admin login, skip-nav.

## Deploy

### Vercel (recomendado)

`vercel.json` incluye CSP, HSTS, cache headers para assets/fonts, SPA rewrite. Para desplegar:

1. Conectar repo a Vercel
2. Framework: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Actualizar `SITE_URL` en `src/lib/schema.js` con el dominio real

### GitHub Pages (legacy)

```bash
npm run deploy   # publica a gh-pages
```

Requiere que `base: '/A2C/'` en `vite.config.js` coincida con el subpath.

## Accesibilidad

- WCAG AA mínimo (AAA en contraste de texto)
- Focus visible con outline dorado
- `prefers-reduced-motion` respetado en todas las animaciones
- Skip-nav a `#main-content`
- ARIA en carousel (Hero), modals (lightbox), toggles (compare), expandable (filtros)
- Touch targets ≥44px

## Performance

- Self-hosted WOFF2 con `font-display: swap` + preload
- Imágenes con `loading="lazy"` + `decoding="async"`
- `<Picture>` component con WebP fallback
- Code splitting por ruta (React.lazy)
- Manual chunks: react-vendor, query-vendor, supabase

## Estructura

```
src/
├─ components/
│  ├─ ui/            Button, Picture
│  ├─ Header, Hero, Footer, VehicleCard, ...
│  ├─ ErrorBoundary, SEO
├─ pages/
│  ├─ HomePage, InventoryPage, VehicleDetailPage, ComparePage
│  └─ admin/        LoginPage, DashboardPage, VehicleFormPage
├─ hooks/            useReducedMotion, useIntersection
├─ lib/              supabase, queryClient, schema
├─ context/          AuthContext
├─ styles/           motion.css
└─ index.css         design tokens

public/
├─ fonts/            Fraunces + Inter Tight WOFF2 + OFL licenses
├─ logo-dark.png     logo metálico sobre negro
├─ logo-light.png    logo sobre fondo claro
├─ robots.txt
└─ 404.html          SPA redirect for GH Pages
```

## Licencia

Código propietario de A2C International. Fuentes (Fraunces, Inter Tight) bajo SIL Open Font License 1.1 — ver `public/fonts/LICENSE-*.txt`.
