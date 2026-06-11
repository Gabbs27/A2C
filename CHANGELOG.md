# Changelog - A2C INTERNATIONAL

## Versión 3.0.0 - Junio 2026 (production ready)

### 🏗️ Resiliencia y datos
- Modo demo automático: si Supabase falta o no responde, la web pública sirve
  un inventario local de 12 vehículos con nota discreta (`src/lib/api.js` +
  `src/lib/demoData.js`); el admin muestra aviso de backend no disponible
- `supabase/seed.sql` para recrear el backend con el mismo inventario
- Data fetching migrado a TanStack Query con estados de error + reintentar
- `siteConfig.js`: contacto, horarios y marca con única fuente de verdad
  (resuelve horarios contradictorios entre Footer/Contact/schema)

### 🎨 Diseño (cierre del refresh 2026 dark editorial)
- ComparePage, DashboardPage y VehicleFormPage: CSS re-sincronizado con el JSX
  (antes renderizaban sin estilos)
- Nueva sección Financiamiento en home con mini-calculadora editorial
- Página 404 editorial + páginas legales (privacidad, términos)
- Hero: imágenes self-hosted, control de pausa (WCAG 2.2.2), `100svh`,
  indicadores con target ≥44px
- Skeletons fieles a la anatomía real de las cards (sin CLS)

### ⚙️ Funcionalidad
- Navegación del header funcional desde cualquier ruta (anclas `/#sección`);
  link "Financiamiento" ya no está muerto
- Filtro de disponibilidad en inventario; vendidos al final; búsqueda con
  debounce; selección de comparación persistente (sessionStorage)
- Galería del detalle: reset al navegar, lightbox con focus-trap y scroll-lock
- Calculadora de financiamiento: casos borde (0% interés, inicial ≥ precio) y
  resultado también en DOP
- Admin: sin límite de 10 vehículos, mutaciones sin recarga de página,
  confirmación de borrado inline, subida de imágenes con nombres sanitizados
  y errores visibles, imagen primaria garantizada

### 🚀 Producción
- Ruta 404 catch-all, scroll restoration global, ErrorBoundary que ya no
  crashea, guard de env vars sin white-screen
- SEO por página (title/canonical/OG) + JSON-LD de vehículo; OG estático en
  index.html para scrapers; favicon real + manifest PWA; sitemap con rutas
  reales; robots.txt corregido
- Deploy dual: GH Pages (`/A2C/`) y Vercel (`VITE_BASE_PATH=/`); CSP estricta
  sin `unsafe-inline` en scripts
- E2E ampliado (detalle, comparar, 404, móvil) y CI funcional sin secretos

## Versión 2.0.0 - Diciembre 2025

### 🎨 Rediseño Completo de Marca

#### Paleta de Colores
- ✅ Cambio de dorado (#D4AF37) a **plateado metálico (#C0C0C0)** como color principal
- ✅ Implementación de **azul (#3B82F6)** como color de acento para CTAs
- ✅ Sistema completo de variables CSS para colores, espaciado, border-radius y transiciones

#### Tipografía
- ✅ Agregada fuente **Inter** junto a Poppins
- ✅ Actualización de pesos de fuente (900 para logo, 700-800 para headings)
- ✅ Letter-spacing optimizado según guía de marca

#### Componentes Actualizados

**Header**
- ✅ Logo con tipografía bold (font-weight: 900)
- ✅ Hover effects con color plateado
- ✅ Backdrop blur mejorado
- ✅ Link de contacto agregado

**Hero**
- ✅ Títulos con efecto metálico (gradiente plateado)
- ✅ Botón CTA principal en azul
- ✅ Botón secundario con borde plateado
- ✅ Controles de slider actualizados

**Welcome**
- ✅ Tagline "SALE AND SERVICES" añadido
- ✅ Nombre actualizado a "A2C INTERNATIONAL"
- ✅ Botones convertidos a links

**Services**
- ✅ Cards con bordes plateados
- ✅ Hover effects con sombras metálicas
- ✅ Botones CTAs en azul

**Features**
- ✅ Iconos en color plateado
- ✅ Cards con bordes sutiles
- ✅ Hover effects mejorados

**Contact (NUEVO)**
- ✅ Grid de información de contacto
- ✅ Google Maps integrado
- ✅ Cards con hover effects
- ✅ Links a teléfono, email y ubicación

**Footer**
- ✅ Logo con tipografía actualizada
- ✅ Redes sociales con hover plateado
- ✅ Links con efectos de transición

#### Sistema de Diseño

**Espaciado (base 8px)**
```css
--space-xs: 0.5rem (8px)
--space-sm: 1rem (16px)
--space-md: 1.5rem (24px)
--space-lg: 2rem (32px)
--space-xl: 3rem (48px)
--space-2xl: 4rem (64px)
--space-3xl: 6rem (96px)
```

**Border Radius**
```css
--radius-sm: 0.25rem (4px)
--radius-md: 0.5rem (8px)
--radius-lg: 1rem (16px)
--radius-xl: 1.5rem (24px)
--radius-full: 9999px
```

**Transiciones**
```css
--transition-fast: 150ms ease-in-out
--transition-base: 200ms ease-in-out
--transition-slow: 300ms ease-in-out
```

#### Mejoras Adicionales

- ✅ Scrollbar personalizado con color plateado
- ✅ Selection colors actualizados
- ✅ Smooth scroll behavior
- ✅ Loading animations para imágenes
- ✅ SEO mejorado (meta description, title)
- ✅ README actualizado con guía completa
- ✅ Responsive optimizado para todos los dispositivos

#### Archivos Modificados

- `src/index.css` - Variables CSS globales
- `src/App.css` - Estilos de aplicación
- `src/components/Header.jsx` + `Header.css`
- `src/components/Hero.jsx` + `Hero.css`
- `src/components/Welcome.jsx` + `Welcome.css`
- `src/components/Services.css`
- `src/components/Features.css`
- `src/components/Footer.jsx` + `Footer.css`
- `index.html` - Meta tags y fuentes

#### Archivos Nuevos

- `src/components/Contact.jsx` - Componente de contacto con mapa
- `src/components/Contact.css` - Estilos del componente de contacto
- `README.md` - Documentación completa del proyecto
- `CHANGELOG.md` - Este archivo

---

## Versión 1.0.0 - Inicial

- Versión inicial con diseño dorado
- Componentes básicos implementados

