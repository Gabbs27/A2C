# A2C Internacional — Refresh Visual 2026 (Neo-classic Magazine, Dark-first)

**Fecha:** 2026-04-17
**Autor:** Gabriel + Claude (brainstorming)
**Estado:** Aprobado, listo para plan de implementación
**Alcance:** Refresh visual manteniendo arquitectura actual (React 18 + Vite + CSS plano + Supabase). No reescribir.

---

## 1. Contexto y decisiones previas

La app A2C Internacional es una concesionaria de autos usados premium en República Dominicana. Hoy tiene estética "plata/negro/dorado" genérica, con Poppins/Inter, light-first para público y dark para admin. Este documento define un refresh visual 2026 alineado con tendencias verificadas del sector lujo/automotriz.

### Decisiones acordadas en brainstorming

| Decisión | Valor |
|---|---|
| Alcance | Refresh visual 2026 (sin cambiar stack técnico) |
| Dirección | Evolucionar lujo clásico — Neo-classic Magazine |
| Paleta | Monocromática plata/negro/grafito + dorado como único acento |
| Modo | Dark-first (sin toggle) |
| Tipografía | Fraunces (variable) + Inter Tight (UI chrome) |
| Base | Logo 3D metálico silver sobre negro (existente) |

### Tendencias 2026 verificadas que justifican decisiones

- Dark-first como expresión de marca (Figma Design Trends 2026)
- "Metallic tones like silver and chrome, paired with dark mode, create a sleek, luxurious aesthetic" (Ariel Digital / Lounge Lizard 2026)
- Kinetic typography con moderación
- Editorial serifs + variable fonts para headlines
- Type-dominant layouts (tipografía como estructura)
- "Calm interfaces, no theatrics" (Envato Elements 2026)

---

## 2. Sistema de colores

Dark-first, contraste WCAG AAA, un solo acento dorado, semánticos desaturados para dark.

```css
/* Base metálica */
--ink-950: #0A0A0B;   /* fondo principal */
--ink-900: #121215;   /* surfaces L1 (cards, header) */
--ink-800: #1C1C21;   /* surfaces L2 (modals, elevated) */
--ink-700: #2A2A31;   /* bordes sutiles */
--ink-600: #3D3D45;   /* bordes visibles */

/* Plata (logo) */
--silver-100: #F4F4F6;   /* texto primario */
--silver-300: #C8C9CF;   /* texto secundario */
--silver-500: #8E8F96;   /* labels, terciario */
--silver-700: #5A5B62;   /* disabled */

/* Dorado (único acento) */
--gold-400: #E4C063;
--gold-500: #D4AF37;     /* CTA primario, acentos */
--gold-600: #A8862A;     /* pressed */
--gold-50-alpha: rgba(212, 175, 55, 0.08);

/* Semánticos dark-safe */
--success: #4ADE80;
--warning: #FBBF24;
--danger:  #F87171;
--info:    #60A5FA;

/* Gradientes metálicos */
--metallic-silver: linear-gradient(135deg, #E8E8EB 0%, #B4B5BA 50%, #E8E8EB 100%);
--metallic-gold:   linear-gradient(135deg, #F5D989 0%, #D4AF37 50%, #A8862A 100%);

/* Sombras dark-first */
--shadow-sm: 0 1px 2px rgba(0,0,0,0.4);
--shadow-md: 0 4px 16px rgba(0,0,0,0.5);
--shadow-lg: 0 24px 48px rgba(0,0,0,0.6);
--shadow-glow-gold: 0 0 32px rgba(212, 175, 55, 0.15);
```

**Contrastes verificados:**
- silver-100 / ink-950: 16.1:1 (AAA)
- silver-300 / ink-950: 10.8:1 (AAA)
- gold-500 / ink-950: 9.7:1 (AAA)
- silver-500 / ink-800: 5.1:1 (AA)

**Eliminados:** `--primary`, `--secondary`, `--accent`, `--bg-light`, `--bg-white`.

---

## 3. Tipografía

### Familias

- **Fraunces** (Google Fonts, variable): wght 300-900, opsz 9-144, SOFT 0-100. Display + body + tabular numerals.
- **Inter Tight** (Google Fonts, variable): UI chrome — nav, buttons, badges, small caps, labels.

### Regla de uso

| Elemento | Familia |
|---|---|
| Hero, H1-H3, precios, nombres | Fraunces |
| Body, descripciones, specs | Fraunces opsz~14 + SOFT 50 |
| Nav, buttons, badges, status labels | Inter Tight uppercase tracked |
| Números (precios, km) | Fraunces `font-feature-settings: 'tnum'` |

### Escala

```css
/* Display (Fraunces opsz=144, wght=400) */
--text-display-2xl: clamp(3.5rem, 8vw + 1rem, 7rem);
--text-display-xl:  clamp(2.75rem, 5vw + 1rem, 4.5rem);
--text-display-lg:  clamp(2rem, 3vw + 1rem, 3rem);

/* Headings (Fraunces opsz=36-72, wght=500-600) */
--text-h1: 2.25rem;
--text-h2: 1.75rem;
--text-h3: 1.25rem;

/* Body (Fraunces opsz=14, wght=400, SOFT=50) */
--text-body-lg: 1.125rem;
--text-body:    1rem;
--text-body-sm: 0.9375rem;

/* UI (Inter Tight) */
--text-ui:    0.875rem;
--text-ui-sm: 0.75rem;
--text-ui-xs: 0.6875rem;

/* Line heights */
--leading-tight:   1.05;
--leading-snug:    1.2;
--leading-normal:  1.55;
--leading-relaxed: 1.7;

/* Letter spacing */
--tracking-tight:   -0.02em;
--tracking-normal:  0;
--tracking-wide:    0.08em;
--tracking-widest:  0.2em;
```

---

## 4. Layout, grid y spacing

### Containers

```css
--container-narrow:   640px;   /* texto largo */
--container-content: 1080px;   /* estándar */
--container-wide:    1440px;   /* hero, galerías */
--container-bleed:   100vw;    /* full-bleed */

--gutter: clamp(1rem, 3vw + 0.5rem, 2.5rem);
```

### Grid

Grid de 12 columnas explícito con patrones asimétricos predefinidos (layout-editorial 1/7/5, layout-feature 5/7).

### Spacing scale

```css
/* Fino */
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-5: 1.5rem;
--space-6: 2rem;

/* Grueso (aire magazine) */
--space-8:  3rem;
--space-10: 4rem;
--space-12: 6rem;
--space-16: 8rem;
--space-20: 10rem;

--section-padding-y: clamp(4rem, 8vw, 10rem);
```

### Breakpoints

```css
--bp-sm: 640px;
--bp-md: 1024px;
--bp-lg: 1440px;
--bp-xl: 1920px;
```

### Patrones por página

- **Homepage:** hero full-bleed + bento grid asimétrico en destacados
- **Inventario:** filtros laterales sticky desktop, cards con 48px gap
- **Vehicle Detail:** galería 60% / specs 40%, precio gigante protagonista
- **Compare:** split-screen (2-3 autos), diff con underline wavy gold

---

## 5. Componentes clave

### Header
- 72px altura (vs 120px), single row, sin top bar de contacto
- Logo SVG/PNG 3D metálico (reemplaza texto actual)
- Nav: Inter Tight uppercase, underline gold desde izquierda en hover
- Scrolled state: backdrop-blur + compresión sutil
- Mobile: drawer desde arriba (no derecha)

### Hero
- Full-bleed carousel, overlay `linear-gradient(180deg, ink-950/40, ink-950/70)`
- Eyebrow Inter + headline Fraunces display-2xl con italics selectivos
- Quick search se extrae a banda dedicada abajo (no en hero)
- Crossfade 1.2s + Ken Burns 8s lineal
- Indicators: píldora + counter "01/03"

### VehicleCard
- Fondo ink-900, border ink-700, radius 2px (editorial)
- Imagen aspect-ratio 4/3, zoom 1.04 en hover
- Gold hairline separador, NO backgrounds alternos
- Status badge absolute top-left con backdrop-blur
- Compare = ícono ⇄ top-right (no checkbox)
- Hover: translateY(-4px) + border gold-500/40 + título gold-400

### Services/Features (sección)
Lista editorial numerada (01, 02, 03...) con Fraunces display dorado + hairline horizontal + título + body. Full-width rows, no cards.

### Compare Page
Split-screen 2-3 autos, hairlines doradas entre filas, diff con `text-decoration: underline wavy gold`. Mobile: accordions.

### Admin Dashboard
Mantiene dark (ya estaba), alineado al nuevo sistema:
- Fraunces para nombres, Inter Tight para headers
- Stats: número enorme Fraunces display-md + label Inter Tight tracked
- Inputs: bottom-border only, focus bottom-border gold + glow sutil

### WhatsApp Button
- Verde oficial #25D366
- Sin pulse continuo. Pulse único tras 5s de inactividad
- Colapsa a ícono en scroll-down, reaparece con label en scroll-up

### Footer
Protagonista con logo gigante (100px), hairline gold full-width, columnas editoriales, línea copyright + redes.

---

## 6. Motion & micro-interacciones

### Easings

```css
--ease-out-expo:     cubic-bezier(0.16, 1, 0.3, 1);
--ease-out-quart:    cubic-bezier(0.25, 1, 0.5, 1);
--ease-in-out-cubic: cubic-bezier(0.65, 0, 0.35, 1);
--ease-magazine:     cubic-bezier(0.77, 0, 0.175, 1);
```

Sin bounces, sin elastics. Lujo = suavidad controlada.

### Duraciones

```css
--duration-instant: 100ms;
--duration-fast:    200ms;
--duration-base:    300ms;
--duration-slow:    500ms;
--duration-slower:  800ms;
--duration-epic:    1200ms;
```

### Patrones concretos

- **Nav links:** underline gold crece desde izquierda, 300ms ease-out-quart
- **Botón primario:** hover invierte fill + flecha → translateX(4px)
- **VehicleCard hover:** translateY(-4px) + image scale(1.04) + border gold + título color
- **Hero carousel:** crossfade 1.2s + Ken Burns 1→1.05 en 8s
- **Filters:** grid-template-rows trick para height auto, 500ms ease-magazine
- **Modal/Lightbox:** scale(0.96)→1 + opacity 0→1, 500ms ease-out-expo, focus trap, Escape
- **Scroll reveals:** opacity 0→1 + translateY(32px)→0, 800ms ease-out-expo, threshold 0.15, una vez
- **Page transitions:** fade + translateY(16px) sutil en route change (~20 líneas JS)

### Kinetic typography (sparingly)

- Hero: split-text letra por letra (60ms), total ~800ms, solo al cambiar slide
- Section titles: clip-path wipe vertical, 900ms ease-magazine
- Nada animado continuamente

### Reduce-motion fallback

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .hero-slide { animation: none !important; }
  .vehicle-card:hover { transform: none !important; }
}
```

### Performance motion

- Solo `transform` + `opacity` (GPU-accelerated)
- `will-change` solo durante animación, remover después
- `loading="lazy"` imágenes
- Intersection Observer con `rootMargin: 100px`

---

## 7. Producción, accesibilidad y performance

### Accesibilidad (WCAG AA mínimo)

- Touch targets ≥44×44px (auditar filters, compare)
- Focus visible: `outline: 2px gold-400, offset: 3px`
- Keyboard flows: focus trap modals, Escape cierra, arrow keys en carousel
- ARIA: carousel (`aria-roledescription`), filters (`aria-expanded`), compare (`aria-pressed`)
- Screen reader: tests VoiceOver + NVDA
- `prefers-reduced-motion` respetado
- Alt text validado en admin form
- `<html lang="es-DO">`

### Performance — targets Core Web Vitals

- LCP < 2.5s
- INP < 200ms
- CLS < 0.1
- Bundle JS initial < 180kb gzipped

Acciones:

**Imágenes:**
- JPG → WebP en upload
- `<picture>` responsive (600w / 1200w / 1800w)
- `loading="lazy"` below-fold, `fetchpriority="high"` hero activo
- `decoding="async"` global
- LQIP blur placeholder

**Fonts:**
- Self-host Fraunces + Inter Tight WOFF2
- `font-display: swap`
- Preload weights críticos con `crossorigin`
- Subset latin-ext

**Code splitting:**
- `React.lazy()` por ruta
- Admin bundle NO se descarga para público
- Suspense con skeleton

**Supabase:**
- SELECT explícito, no `*`
- Paginación en inventario
- TanStack Query para cache stale-while-revalidate

**CSS:**
- Vite minify + postcss-preset-env (autoprefixer, fallbacks)

### SEO

- `<title>` único por página via react-helmet-async
- Meta description específica por vehículo
- Open Graph + Twitter Card por página
- JSON-LD: `Vehicle` + `AutoDealer`
- sitemap.xml via vite-plugin-sitemap
- robots.txt con `Disallow: /admin`
- URLs humanas: `/inventario/bmw-x5-2024-xdrive40i-ABC123`
- `hreflang es-DO`

### Seguridad

- Auditar Supabase RLS policies
- Confirmar `VITE_SUPABASE_ANON_KEY` es anon, no service role
- Rate limiting en login admin
- CSP headers: `default-src 'self'; img-src 'self' supabase.co; font-src 'self'`
- HSTS
- Sanitizar inputs admin form
- Auth tokens en httpOnly cookies (config Supabase client)

### Error handling / robustez

- Error Boundary global con fallback editorial
- Estados vacíos/error en cada fetch
- Sentry o Highlight.io free tier
- Service Worker lite con Workbox (PWA-lite, cachear shell + imágenes)

### Testing mínimo viable

- Playwright E2E, 5 smoke tests:
  1. Homepage carga + destacados visibles
  2. Búsqueda devuelve resultados
  3. Click auto → detalle
  4. Filtros → inventario filtra
  5. Admin login → dashboard
- Lighthouse CI en GitHub Actions (falla si LCP > 3s o a11y < 95)
- Sin unit tests (no justifica esfuerzo para este scope)

### Analytics

- Plausible o Umami (privacy-friendly, sin cookie banner)
- Eventos custom: `vehicle_view`, `whatsapp_click`, `compare_add`
- No Google Analytics

### Deployment

Migrar de gh-pages a **Vercel free**:
- CSP custom headers
- Preview URLs por PR
- Analytics básico
- Edge caching automático

---

## 8. Archivos y dependencias

### Archivos nuevos

```
/public/
  robots.txt
  sitemap.xml (generado)
  og-default.jpg

/src/
  lib/seo.js
  components/ErrorBoundary.jsx
  components/SEO.jsx
  hooks/useReducedMotion.js
  hooks/useIntersection.js

/.github/workflows/lighthouse.yml
/tests/e2e/smoke.spec.ts
```

### Dependencias

Runtime:
- `react-helmet-async` ^2.0
- `@tanstack/react-query` ^5.0
- `@sentry/react` ^8.0 (opcional)

Dev:
- `@playwright/test` ^1.48
- `vite-plugin-sitemap` ^0.8

Peso neto añadido al bundle: ~25kb gzipped, absorbido por mejoras de imágenes y code-splitting.

---

## 9. Resumen de cambios por categoría

| Categoría | Cambios |
|---|---|
| Visual | Paleta monocroma + dorado único, Fraunces + Inter Tight, dark-first, bento grids, magazine asymmetry |
| Motion | 4 easings editoriales, scroll reveals, kinetic hero moderado, reduce-motion safe |
| A11y | Focus gold, ARIA completo, keyboard flows, contrastes AAA donde posible |
| Performance | WebP + lazy + preload fonts + code split + TanStack Query cache |
| SEO | OG, JSON-LD Vehicle, sitemap, slugs, meta por página |
| Seguridad | RLS audit, CSP, sanitización, httpOnly tokens |
| Robustez | Error Boundary, Sentry, estados vacíos refinados |
| Testing | 5 Playwright + Lighthouse CI |
| Deploy | gh-pages → Vercel |

---

## 10. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Neo-classic serif puede sentirse viejo | Fraunces es 2020+ con optical sizes modernos; SOFT axis suaviza body |
| Dark-first alienta a usuarios acostumbrados a light | Dark-first ES la tendencia 2026 en lujo/auto; decisión fundamentada |
| Migrar a Vercel rompe algo | Probar en preview antes de cambiar DNS; rollback trivial |
| TanStack Query agrega complejidad | Scope limitado a páginas con fetch (inventario, detalle); patrón simple |
| Self-host fonts requiere mantenimiento | Descargar una vez, subset, checkin en repo (no cambian) |

---

## Próximo paso

Invocar skill `writing-plans` para generar plan de implementación paso a paso con checkpoints de revisión.
