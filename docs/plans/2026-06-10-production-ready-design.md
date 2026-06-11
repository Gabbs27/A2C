# Production Ready — diseño y plan (2026-06-10)

Objetivo: cerrar la migración "2026 dark editorial" y dejar la app lista para
producción. Base: auditoría multi-agente (94 hallazgos, 12 high verificados)
sobre `refresh-visual-2026`.

## Contexto crítico

El proyecto Supabase (`mvoicpukeykrtjhavdyn.supabase.co`) **ya no existe**
(NXDOMAIN). Decisión: la web pública nunca debe verse vacía ni rota.

## Decisiones de arquitectura

1. **Data layer resiliente** (`src/lib/api.js`): toda lectura pública intenta
   Supabase y cae a un inventario demo local (`src/lib/demoData.js`, 12
   vehículos, imágenes Unsplash verificadas) si el backend falta o no responde.
   Resultado incluye `demo: true/false`; la UI muestra una nota discreta en
   modo demo. El admin no usa demo: muestra error claro de backend.
   `supabase.js` exporta `isSupabaseConfigured` y un cliente `null` si faltan
   env vars (antes: white-screen). `supabase/seed.sql` replica el dataset para
   recrear el proyecto.

2. **Single source of truth de contacto** (`src/lib/siteConfig.js`): teléfono,
   WhatsApp, email, dirección, horarios (versión Contact: L-V 9-8, Sa 9-6,
   Do 11-5) y redes. Consumido por Header, Footer, Contact, Detail, schema.
   Marca estandarizada: **A2C International** (tagline "Sale and Services").

3. **Deploy dual**: `base` configurable — `VITE_BASE_PATH` (default `/A2C/`
   para GH Pages); `vercel.json` build con `VITE_BASE_PATH=/`. `SITE_URL`
   en schema vía `VITE_SITE_URL` con default actual.

4. **Routing**: ruta 404 catch-all editorial, scroll restoration global,
   ErrorBoundary sin `<Link>` fuera del Router (usa `<a>`), Suspense fallback
   con branding. Anclas del header funcionan desde cualquier ruta (`/#id` +
   `scroll-padding-top`). Nueva sección `#financiamiento` en home (calculadora
   editorial) para el nav item hoy muerto.

5. **SEO**: SEO por página (título, canonical, OG) en inventario, detalle
   (usa `vehicleSchema`), comparador, legal y 404. `index.html` con OG
   estático + favicon real (desde logo) + manifest. Sitemap con rutas reales.

6. **Admin**: re-sincronizar CSS↔JSX de Dashboard y VehicleForm (reescritura
   de CSS al estilo 2026 manteniendo el JSX), quitar límite de 10 vehículos,
   mutaciones con feedback (sin reload completo), sanitizar nombres de archivo
   de Storage, arreglar bookkeeping de imagen primaria, copy con tildes.

7. **Calidad pública**: ComparePage CSS reescrito para el JSX real (tabla),
   estados de error con retry en todas las páginas de datos, reset de galería
   al navegar, focus-trap + scroll-lock en lightbox y drawer móvil, hero con
   pausa + `100svh` + imágenes self-hosted, filtro de disponibilidad,
   persistencia de comparación (sessionStorage), targets táctiles ≥44px.

8. **CI/tests**: Playwright baseURL con `/A2C/`, CI sin dependencia de
   secretos (modo demo lo permite), e2e ampliado (detalle, comparar, 404),
   Lighthouse sobre página funcional.

9. **Legal**: páginas de privacidad y términos (editorial, contenido genérico
   RD) enlazadas desde footer.

## Fuera de alcance

Paginación de inventario, i18n, blog, e-commerce, monitoreo externo (Sentry)
— anotados en MEJORAS-FUTURAS.

## Ejecución

Fase 0 (compartido): api/demoData/supabase guard (hecho), siteConfig,
AuthContext, App.jsx, ErrorBoundary, SEO, schema, index.html, assets públicos,
vite/vercel/robots/playwright/ci, seed.sql, tokens compartidos en index.css.

Fase 1 (paralela por áreas de archivos disjuntos): ComparePage · Dashboard ·
VehicleForm · Inventory · Detail · Header/Hero/Footer/WhatsApp + sección
financiamiento · Featured/VehicleCard/Skeleton + legal pages.

Fase 2: verificación — build, e2e, revisión visual, code review.
