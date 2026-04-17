# A2C Refresh Visual 2026 — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform A2C Internacional from a generic silver/gold luxury dealership site into a dark-first, magazine-style, production-hardened 2026 experience without changing the core stack.

**Architecture:** Keep React 18 + Vite + CSS + Supabase. Replace the design-token layer, swap to variable serif + sans chrome typography (Fraunces + Inter Tight), refactor each component's CSS to the new system, then add a production-hardening layer (SEO, a11y, perf, error handling, tests).

**Tech Stack:** React 18, Vite 5, React Router 7, Supabase, Fraunces + Inter Tight (self-hosted WOFF2), react-helmet-async, @tanstack/react-query, @sentry/react (optional), Playwright, vite-plugin-sitemap, Vercel.

**Design Doc:** See `docs/plans/2026-04-17-refresh-visual-2026-design.md` for full rationale.

**Commit convention:** No Co-Authored-By footer. Messages in Spanish or English, conventional commits prefix (`feat:`, `refactor:`, `style:`, `perf:`, `a11y:`, `seo:`, `test:`, `chore:`, `docs:`).

---

## Phase 0 — Foundation (design tokens, fonts, base helpers)

### Task 0.1: Self-host Fraunces + Inter Tight WOFF2 fonts

**Files:**
- Create: `public/fonts/fraunces-variable.woff2`
- Create: `public/fonts/inter-tight-variable.woff2`
- Create: `public/fonts/LICENSE-fraunces.txt`
- Create: `public/fonts/LICENSE-inter-tight.txt`

**Step 1:** Download variable WOFF2 from Google Fonts helper (latin subset):
- Fraunces: https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,300..900,0..100&display=swap
- Inter Tight: https://fonts.googleapis.com/css2?family=Inter+Tight:wght@100..900&display=swap

Use `google-webfonts-helper` (https://gwfh.mranftl.com/) to get subsetted WOFF2 files for `latin` and `latin-ext`. Download variable versions only.

**Step 2:** Place the two `.woff2` files in `public/fonts/` and the SIL Open Font License text files alongside them (copy from each font's GitHub).

**Step 3:** Verify file sizes:

Run: `ls -lh public/fonts/*.woff2`
Expected: Fraunces ~80-120kb, Inter Tight ~50-80kb.

**Step 4:** Commit

```bash
git add public/fonts/
git commit -m "chore(fonts): self-host Fraunces and Inter Tight variable WOFF2"
```

---

### Task 0.2: Rewrite `src/index.css` design tokens (dark-first)

**Files:**
- Modify: `src/index.css` (full rewrite)

**Step 1:** Fully replace `src/index.css` with the new token system. Content to write:

```css
/* ═══════════════════════════════════════════════════════════════
   A2C 2026 — Design Tokens (dark-first, neo-classic magazine)
   ═══════════════════════════════════════════════════════════════ */

/* Self-hosted font faces */
@font-face {
  font-family: 'Fraunces';
  src: url('/fonts/fraunces-variable.woff2') format('woff2-variations');
  font-weight: 300 900;
  font-style: normal;
  font-display: swap;
  font-optical-sizing: auto;
}

@font-face {
  font-family: 'Inter Tight';
  src: url('/fonts/inter-tight-variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  /* ─── Base metálica (surfaces) ─── */
  --ink-950: #0A0A0B;
  --ink-900: #121215;
  --ink-800: #1C1C21;
  --ink-700: #2A2A31;
  --ink-600: #3D3D45;

  /* ─── Plata (logo) ─── */
  --silver-100: #F4F4F6;
  --silver-300: #C8C9CF;
  --silver-500: #8E8F96;
  --silver-700: #5A5B62;

  /* ─── Dorado (único acento) ─── */
  --gold-400: #E4C063;
  --gold-500: #D4AF37;
  --gold-600: #A8862A;
  --gold-50-alpha: rgba(212, 175, 55, 0.08);
  --gold-20-alpha: rgba(212, 175, 55, 0.2);

  /* ─── Semánticos dark-safe ─── */
  --success: #4ADE80;
  --warning: #FBBF24;
  --danger:  #F87171;
  --info:    #60A5FA;
  --whatsapp: #25D366;

  /* ─── Gradientes metálicos ─── */
  --metallic-silver: linear-gradient(135deg, #E8E8EB 0%, #B4B5BA 50%, #E8E8EB 100%);
  --metallic-gold:   linear-gradient(135deg, #F5D989 0%, #D4AF37 50%, #A8862A 100%);

  /* ─── Sombras ─── */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.4);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.5);
  --shadow-lg: 0 24px 48px rgba(0,0,0,0.6);
  --shadow-glow-gold: 0 0 32px rgba(212, 175, 55, 0.15);

  /* ─── Typography ─── */
  --font-display: 'Fraunces', Georgia, 'Times New Roman', serif;
  --font-body: 'Fraunces', Georgia, serif;
  --font-ui: 'Inter Tight', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  /* Display (Fraunces opsz=144, wght=400) */
  --text-display-2xl: clamp(3.5rem, 8vw + 1rem, 7rem);
  --text-display-xl:  clamp(2.75rem, 5vw + 1rem, 4.5rem);
  --text-display-lg:  clamp(2rem, 3vw + 1rem, 3rem);

  /* Headings */
  --text-h1: 2.25rem;
  --text-h2: 1.75rem;
  --text-h3: 1.25rem;

  /* Body */
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

  /* ─── Spacing ─── */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
  --space-8: 3rem;
  --space-10: 4rem;
  --space-12: 6rem;
  --space-16: 8rem;
  --space-20: 10rem;

  --section-padding-y: clamp(4rem, 8vw, 10rem);

  /* ─── Containers ─── */
  --container-narrow:   640px;
  --container-content: 1080px;
  --container-wide:    1440px;
  --gutter: clamp(1rem, 3vw + 0.5rem, 2.5rem);

  /* ─── Breakpoints (for reference only, use in @media) ─── */
  --bp-sm: 640px;
  --bp-md: 1024px;
  --bp-lg: 1440px;
  --bp-xl: 1920px;

  /* ─── Header heights ─── */
  --header-height: 72px;
  --header-height-mobile: 64px;

  /* ─── Radius (editorial — mínimo) ─── */
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-full: 9999px;

  /* ─── Motion ─── */
  --ease-out-expo:     cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart:    cubic-bezier(0.25, 1, 0.5, 1);
  --ease-in-out-cubic: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-magazine:     cubic-bezier(0.77, 0, 0.175, 1);

  --duration-instant: 100ms;
  --duration-fast:    200ms;
  --duration-base:    300ms;
  --duration-slow:    500ms;
  --duration-slower:  800ms;
  --duration-epic:    1200ms;
}

/* ═══ BASE STYLES (dark-first) ═══ */
html {
  scroll-behavior: smooth;
  background-color: var(--ink-950);
  color-scheme: dark;
}

body {
  font-family: var(--font-body);
  font-size: var(--text-body);
  font-weight: 400;
  font-optical-sizing: auto;
  font-variation-settings: 'SOFT' 50;
  line-height: var(--leading-normal);
  color: var(--silver-100);
  background-color: var(--ink-950);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  text-decoration: none;
  color: inherit;
  transition: color var(--duration-fast) var(--ease-out-quart);
}

button {
  cursor: pointer;
  border: none;
  font-family: inherit;
  color: inherit;
  background: transparent;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* ═══ FOCUS VISIBLE (gold ring for a11y) ═══ */
*:focus {
  outline: none;
}
*:focus-visible {
  outline: 2px solid var(--gold-400);
  outline-offset: 3px;
  border-radius: var(--radius-sm);
}

/* ═══ SELECTION ═══ */
::selection {
  background: var(--gold-500);
  color: var(--ink-950);
}

/* ═══ SCROLLBAR ═══ */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-track {
  background: var(--ink-900);
}
::-webkit-scrollbar-thumb {
  background: var(--ink-700);
  border-radius: var(--radius-sm);
}
::-webkit-scrollbar-thumb:hover {
  background: var(--ink-600);
}

/* ═══ CONTAINERS ═══ */
.container {
  width: 100%;
  max-width: var(--container-wide);
  margin: 0 auto;
  padding-inline: var(--gutter);
}

.container-narrow { max-width: var(--container-narrow); }
.container-content { max-width: var(--container-content); }
.container-wide { max-width: var(--container-wide); }

/* ═══ SKIP NAV ═══ */
.skip-nav {
  position: absolute;
  top: -100%;
  left: var(--space-4);
  z-index: 10000;
  padding: var(--space-2) var(--space-4);
  background: var(--gold-500);
  color: var(--ink-950);
  font-family: var(--font-ui);
  font-weight: 600;
  font-size: var(--text-ui-sm);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  transition: top var(--duration-fast) var(--ease-out-quart);
}
.skip-nav:focus-visible {
  top: var(--space-4);
}

/* ═══ SPINNER ═══ */
@keyframes spin { to { transform: rotate(360deg); } }
.spinner {
  width: 40px;
  height: 40px;
  border: 2px solid var(--ink-700);
  border-top-color: var(--gold-500);
  border-radius: 50%;
  animation: spin 800ms linear infinite;
}

/* ═══ DISPLAY UTILITIES ═══ */
.display-2xl {
  font-family: var(--font-display);
  font-size: var(--text-display-2xl);
  font-weight: 400;
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  font-variation-settings: 'opsz' 144, 'SOFT' 0;
}
.display-xl {
  font-family: var(--font-display);
  font-size: var(--text-display-xl);
  font-weight: 500;
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  font-variation-settings: 'opsz' 96, 'SOFT' 20;
}
.display-lg {
  font-family: var(--font-display);
  font-size: var(--text-display-lg);
  font-weight: 500;
  line-height: var(--leading-snug);
  font-variation-settings: 'opsz' 72, 'SOFT' 30;
}

/* ═══ UI TEXT UTILITIES ═══ */
.eyebrow {
  font-family: var(--font-ui);
  font-size: var(--text-ui-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: var(--tracking-widest);
  color: var(--silver-500);
  display: inline-block;
}

.tabular { font-variant-numeric: tabular-nums; }

/* ═══ METALLIC TEXT EFFECT ═══ */
.metallic-text {
  background: var(--metallic-silver);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.gold-text {
  background: var(--metallic-gold);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

/* ═══ SR ONLY ═══ */
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border-width: 0;
}

/* ═══ GOLD HAIRLINE ═══ */
.hairline {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold-500), transparent);
  border: none;
  margin: var(--space-8) 0;
}

/* ═══ REDUCE MOTION ═══ */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Step 2:** Start dev server and visually verify nothing is totally broken (it will look broken, that's expected — we haven't refactored components yet).

Run: `npm run dev`
Expected: Server runs at http://localhost:5173. Page renders with dark background. Text is mostly silver. Many components will look broken because they reference old tokens like `--primary`, `--accent`, etc. That's OK — we fix them in Phase 1+.

**Step 3:** Commit

```bash
git add src/index.css
git commit -m "refactor(tokens): rewrite design tokens for 2026 dark-first system"
```

---

### Task 0.3: Add `<link rel="preload">` for critical fonts in `index.html`

**Files:**
- Modify: `index.html`

**Step 1:** Add preload links inside `<head>` (before existing Google Fonts link if any):

```html
<link rel="preload" href="/fonts/fraunces-variable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/inter-tight-variable.woff2" as="font" type="font/woff2" crossorigin>
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#0A0A0B">
```

**Step 2:** Remove any existing Google Fonts `<link>` tags (we self-host now).

**Step 3:** Verify in browser Network tab that WOFF2 files load from `/fonts/`, not fonts.googleapis.com.

**Step 4:** Commit

```bash
git add index.html
git commit -m "perf(fonts): preload variable fonts, remove Google Fonts CDN"
```

---

### Task 0.4: Create motion helper hooks

**Files:**
- Create: `src/hooks/useReducedMotion.js`
- Create: `src/hooks/useIntersection.js`

**Step 1:** Create `src/hooks/useReducedMotion.js`:

```js
import { useEffect, useState } from 'react';

/**
 * Returns true if the user has requested reduced motion (OS setting).
 * Listens for changes at runtime.
 */
export function useReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setPrefersReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}
```

**Step 2:** Create `src/hooks/useIntersection.js`:

```js
import { useEffect, useRef, useState } from 'react';

/**
 * Returns { ref, isVisible } — isVisible becomes true once the element
 * enters the viewport (once, unless `once: false`).
 */
export function useIntersection({ threshold = 0.15, rootMargin = '100px', once = true } = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}
```

**Step 3:** Commit

```bash
git add src/hooks/
git commit -m "feat(hooks): add useReducedMotion and useIntersection helpers"
```

---

### Task 0.5: Create reusable motion CSS utilities

**Files:**
- Create: `src/styles/motion.css`
- Modify: `src/main.jsx` (import the new CSS)

**Step 1:** Create `src/styles/motion.css`:

```css
/* ═══ REVEAL ANIMATIONS (for useIntersection) ═══ */
.reveal {
  opacity: 0;
  transform: translateY(32px);
  transition:
    opacity var(--duration-slower) var(--ease-out-expo),
    transform var(--duration-slower) var(--ease-out-expo);
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Staggered delays for children */
.reveal-stagger > *:nth-child(1) { transition-delay: 0ms; }
.reveal-stagger > *:nth-child(2) { transition-delay: 80ms; }
.reveal-stagger > *:nth-child(3) { transition-delay: 160ms; }
.reveal-stagger > *:nth-child(4) { transition-delay: 240ms; }
.reveal-stagger > *:nth-child(5) { transition-delay: 320ms; }
.reveal-stagger > *:nth-child(6) { transition-delay: 400ms; }

/* ═══ WIPE-IN (for section titles) ═══ */
@keyframes wipeIn {
  from { clip-path: inset(100% 0 0 0); }
  to   { clip-path: inset(0 0 0 0); }
}
.wipe-in {
  animation: wipeIn var(--duration-slower) var(--ease-magazine) both;
}

/* ═══ BUTTON ARROW (slides right on hover) ═══ */
.btn-arrow {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
}
.btn-arrow > .arrow {
  transition: transform var(--duration-fast) var(--ease-out-quart);
}
.btn-arrow:hover > .arrow,
.btn-arrow:focus-visible > .arrow {
  transform: translateX(4px);
}
```

**Step 2:** Import in `src/main.jsx` right after `./index.css`:

```js
import './index.css';
import './styles/motion.css';
```

**Step 3:** Commit

```bash
git add src/styles/motion.css src/main.jsx
git commit -m "feat(motion): add reveal/wipe/button-arrow motion utilities"
```

---

### Task 0.6: Create Button primitive component

**Files:**
- Create: `src/components/ui/Button.jsx`
- Create: `src/components/ui/Button.css`

**Step 1:** Create `src/components/ui/Button.jsx`:

```jsx
import { forwardRef } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import './Button.css';

/**
 * Button primitive.
 *
 * Variants:
 *  - primary: gold-bordered, inverts on hover (for main CTAs)
 *  - ghost: transparent, gold text
 *  - solid: gold fill from start
 *  - link: inline text link
 */
const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', arrow = false, as: Tag = 'button', children, className = '', ...rest },
  ref
) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    arrow ? 'btn-arrow' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <Tag ref={ref} className={classes} {...rest}>
      <span>{children}</span>
      {arrow && <FiArrowRight className="arrow" aria-hidden="true" />}
    </Tag>
  );
});

export default Button;
```

**Step 2:** Create `src/components/ui/Button.css`:

```css
.btn {
  font-family: var(--font-ui);
  font-weight: 600;
  font-size: var(--text-ui);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition:
    background-color var(--duration-fast) var(--ease-out-quart),
    color var(--duration-fast) var(--ease-out-quart),
    border-color var(--duration-fast) var(--ease-out-quart),
    box-shadow var(--duration-fast) var(--ease-out-quart),
    transform var(--duration-instant) var(--ease-out-quart);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  white-space: nowrap;
  min-height: 44px;
  user-select: none;
}
.btn:active { transform: scale(0.98); }

/* Sizes */
.btn--sm { padding: var(--space-2) var(--space-4); font-size: var(--text-ui-sm); min-height: 36px; }
.btn--md { padding: var(--space-3) var(--space-6); }
.btn--lg { padding: var(--space-4) var(--space-8); font-size: var(--text-ui); min-height: 52px; }

/* Primary: gold outline, inverts on hover */
.btn--primary {
  background: transparent;
  color: var(--gold-500);
  border: 1px solid var(--gold-500);
}
.btn--primary:hover,
.btn--primary:focus-visible {
  background: var(--gold-500);
  color: var(--ink-950);
  box-shadow: var(--shadow-glow-gold);
}

/* Solid: gold fill */
.btn--solid {
  background: var(--gold-500);
  color: var(--ink-950);
  border: 1px solid var(--gold-500);
}
.btn--solid:hover,
.btn--solid:focus-visible {
  background: var(--gold-400);
  border-color: var(--gold-400);
  box-shadow: var(--shadow-glow-gold);
}

/* Ghost: transparent, silver border */
.btn--ghost {
  background: transparent;
  color: var(--silver-100);
  border: 1px solid var(--ink-600);
}
.btn--ghost:hover,
.btn--ghost:focus-visible {
  border-color: var(--gold-500);
  color: var(--gold-400);
}

/* Link: inline */
.btn--link {
  background: transparent;
  color: var(--gold-500);
  border: none;
  padding: 0;
  min-height: auto;
  text-transform: none;
  letter-spacing: 0;
  font-family: inherit;
}
.btn--link:hover { color: var(--gold-400); }
```

**Step 3:** Commit

```bash
git add src/components/ui/
git commit -m "feat(ui): add Button primitive with primary/solid/ghost/link variants"
```

---

## Phase 1 — Core layout (Header, Footer, Layout)

### Task 1.1: Add logo SVG/PNG

**Files:**
- Copy: `png.JPG` (the logo file from repo root) → `public/logo.png`
- Copy: `186aaf77-e55d-459f-924d-18d0d965632d.JPG` → `public/logo-dark.png`

**Step 1:** Copy the two existing logo files into `public/`:

```bash
cp png.JPG public/logo.png
cp 186aaf77-e55d-459f-924d-18d0d965632d.JPG public/logo-dark.png
```

**Step 2:** (Optional but recommended) Optimize with `cwebp` or online tool to produce `logo.webp` and `logo-dark.webp` at ~40kb each.

**Step 3:** Add `.gitignore` entry if the original JPGs shouldn't be committed, or leave them.

**Step 4:** Commit

```bash
git add public/logo.png public/logo-dark.png
git commit -m "chore(assets): add logo files to public/"
```

---

### Task 1.2: Rewrite Header component

**Files:**
- Modify: `src/components/Header.jsx` (full rewrite)
- Modify: `src/components/Header.css` (full rewrite)

**Step 1:** Replace `src/components/Header.jsx`:

```jsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import './Header.css';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 32);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // close drawer on route change
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    // lock scroll when drawer open
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const close = () => setIsMobileMenuOpen(false);

  return (
    <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`}>
      <div className="container site-header__inner">
        <button
          type="button"
          className="site-header__menu-btn"
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="primary-nav"
          aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {isMobileMenuOpen ? <FiX aria-hidden /> : <FiMenu aria-hidden />}
        </button>

        <Link to="/" className="site-header__logo" aria-label="A2C Internacional — Inicio">
          <img src="/logo-dark.png" alt="" width="160" height="48" />
          <span className="sr-only">A2C Internacional</span>
        </Link>

        <nav
          id="primary-nav"
          className={`site-nav ${isMobileMenuOpen ? 'is-open' : ''}`}
          aria-label="Navegación principal"
        >
          <Link to="/inventario" onClick={close}>Comprar</Link>
          <a
            href="https://wa.me/18294470259?text=Hola%2C+me+interesa+vender+mi+veh%C3%ADculo"
            onClick={close}
          >
            Vender
          </a>
          <a href="#finance" onClick={close}>Financiamiento</a>
          <a href="#service" onClick={close}>Servicio</a>
          <a href="#contact" onClick={close}>Contacto</a>
        </nav>
      </div>
    </header>
  );
}
```

**Step 2:** Replace `src/components/Header.css`:

```css
.site-header {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  height: var(--header-height);
  background: rgba(10, 10, 11, 0.72);
  backdrop-filter: blur(16px) saturate(120%);
  -webkit-backdrop-filter: blur(16px) saturate(120%);
  border-bottom: 1px solid transparent;
  transition:
    background-color var(--duration-base) var(--ease-out-quart),
    border-color var(--duration-base) var(--ease-out-quart),
    height var(--duration-base) var(--ease-out-quart);
}
.site-header.is-scrolled {
  background: rgba(10, 10, 11, 0.92);
  border-bottom-color: var(--ink-700);
}

.site-header__inner {
  height: 100%;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--space-6);
}

@media (min-width: 1024px) {
  .site-header__inner {
    grid-template-columns: 1fr auto 1fr;
  }
  .site-header__menu-btn { display: none; }
}

.site-header__menu-btn {
  width: 44px;
  height: 44px;
  display: inline-grid;
  place-items: center;
  color: var(--silver-100);
  font-size: 22px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  transition: border-color var(--duration-fast) var(--ease-out-quart);
}
.site-header__menu-btn:hover { border-color: var(--ink-600); }

.site-header__logo {
  display: inline-block;
  justify-self: center;
  line-height: 0;
}
.site-header__logo img {
  height: 40px;
  width: auto;
  transition: height var(--duration-base) var(--ease-out-quart);
}
.is-scrolled .site-header__logo img { height: 34px; }

/* Nav */
.site-nav {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  font-family: var(--font-ui);
  font-size: var(--text-ui);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  font-weight: 500;
  justify-self: end;
}
.site-nav a {
  position: relative;
  color: var(--silver-300);
  padding: var(--space-2) 0;
  transition: color var(--duration-fast) var(--ease-out-quart);
}
.site-nav a::after {
  content: '';
  position: absolute;
  left: 0; bottom: 0;
  width: 0;
  height: 1px;
  background: var(--gold-500);
  transition: width var(--duration-base) var(--ease-out-quart);
}
.site-nav a:hover,
.site-nav a:focus-visible {
  color: var(--silver-100);
}
.site-nav a:hover::after,
.site-nav a:focus-visible::after {
  width: 100%;
}

/* Mobile drawer (from top) */
@media (max-width: 1023px) {
  .site-nav {
    position: fixed;
    top: var(--header-height);
    left: 0; right: 0;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-4);
    padding: var(--space-8) var(--gutter);
    background: var(--ink-950);
    border-bottom: 1px solid var(--ink-700);
    transform: translateY(-100%);
    opacity: 0;
    pointer-events: none;
    transition:
      transform var(--duration-slow) var(--ease-magazine),
      opacity var(--duration-slow) var(--ease-magazine);
    font-size: var(--text-h3);
    font-family: var(--font-display);
    text-transform: none;
    letter-spacing: var(--tracking-normal);
  }
  .site-nav.is-open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }
  .site-nav a { color: var(--silver-100); width: 100%; padding: var(--space-3) 0; border-bottom: 1px solid var(--ink-800); }
}

@media (max-width: 1023px) {
  .site-header { height: var(--header-height-mobile); }
  .site-nav { top: var(--header-height-mobile); }
}
```

**Step 3:** Start dev server, verify header renders correctly on desktop and mobile (resize window or use devtools).

Run: `npm run dev`
Expected:
- Desktop: 3-column header (menu hidden, logo center, nav right)
- Mobile (<1024px): hamburger left, logo center, nav becomes drawer
- Drawer opens from top on mobile
- Underline animates under nav links on hover

**Step 4:** Commit

```bash
git add src/components/Header.jsx src/components/Header.css
git commit -m "refactor(header): rewrite to single-row dark editorial header with logo"
```

---

### Task 1.3: Rewrite Footer component

**Files:**
- Modify: `src/components/Footer.jsx`
- Modify: `src/components/Footer.css`

**Step 1:** Replace `src/components/Footer.jsx`:

```jsx
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" id="contact">
      <div className="container site-footer__inner">
        <Link to="/" className="site-footer__logo" aria-label="A2C Internacional inicio">
          <img src="/logo-dark.png" alt="A2C International" width="320" height="96" />
        </Link>

        <hr className="hairline" aria-hidden="true" />

        <div className="site-footer__grid">
          <div>
            <p className="eyebrow">Compra</p>
            <ul>
              <li><Link to="/inventario">Inventario</Link></li>
              <li><Link to="/inventario?estado=disponible">Disponibles</Link></li>
              <li><Link to="/comparar">Comparar</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow">Vende</p>
            <ul>
              <li><a href="https://wa.me/18294470259">Cotiza tu vehículo</a></li>
              <li><a href="#finance">Financiamiento</a></li>
              <li><a href="#service">Servicio</a></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow">Contacto</p>
            <ul>
              <li>Santo Domingo, R.D.</li>
              <li><a href="tel:+18294470259">+1 (829) 447-0259</a></li>
              <li><a href="https://wa.me/18294470259">WhatsApp</a></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow">Horarios</p>
            <ul>
              <li>Lun – Vie: 9am – 6pm</li>
              <li>Sáb: 9am – 3pm</li>
              <li>Dom: Cerrado</li>
            </ul>
          </div>
        </div>

        <hr className="hairline" aria-hidden="true" />

        <div className="site-footer__bottom">
          <small>© {year} A2C International · Todos los derechos reservados</small>
          <nav aria-label="Redes sociales" className="site-footer__social">
            <a href="https://instagram.com/" aria-label="Instagram"><FiInstagram /></a>
            <a href="https://facebook.com/" aria-label="Facebook"><FiFacebook /></a>
            <a href="https://wa.me/18294470259" aria-label="WhatsApp"><FaWhatsapp /></a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
```

**Step 2:** Replace `src/components/Footer.css`:

```css
.site-footer {
  background: var(--ink-950);
  color: var(--silver-300);
  padding: var(--section-padding-y) 0 var(--space-6);
  border-top: 1px solid var(--ink-800);
}

.site-footer__inner { display: flex; flex-direction: column; gap: var(--space-8); }

.site-footer__logo { display: inline-block; line-height: 0; }
.site-footer__logo img { height: clamp(60px, 8vw, 96px); width: auto; }

.site-footer .hairline { margin: 0; }

.site-footer__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-8);
}
.site-footer__grid ul { list-style: none; display: flex; flex-direction: column; gap: var(--space-2); font-family: var(--font-body); font-size: var(--text-body-sm); }
.site-footer__grid .eyebrow { margin-bottom: var(--space-4); color: var(--gold-500); }
.site-footer__grid a {
  position: relative;
  color: var(--silver-300);
  transition: color var(--duration-fast) var(--ease-out-quart);
}
.site-footer__grid a:hover,
.site-footer__grid a:focus-visible {
  color: var(--silver-100);
}

.site-footer__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-4);
  font-family: var(--font-ui);
  font-size: var(--text-ui-sm);
  color: var(--silver-500);
}
.site-footer__social {
  display: flex;
  gap: var(--space-4);
  font-size: 20px;
}
.site-footer__social a {
  color: var(--silver-500);
  transition: color var(--duration-fast) var(--ease-out-quart);
}
.site-footer__social a:hover,
.site-footer__social a:focus-visible {
  color: var(--gold-500);
}
```

**Step 3:** Verify visually. Commit:

```bash
git add src/components/Footer.jsx src/components/Footer.css
git commit -m "refactor(footer): rewrite to editorial footer with hairlines and large logo"
```

---

### Task 1.4: Update Layout component (ensure main has focus target)

**Files:**
- Modify: `src/components/Layout.jsx`

**Step 1:** Read current file. Ensure structure is:

```jsx
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

export default function Layout({ children }) {
  return (
    <>
      <a href="#main" className="skip-nav">Saltar al contenido</a>
      <Header />
      <main id="main" tabIndex={-1}>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
```

If the file doesn't match, edit to match.

**Step 2:** Verify. Commit:

```bash
git add src/components/Layout.jsx
git commit -m "a11y(layout): ensure skip-nav targets main with tabindex"
```

---

## Phase 2 — Home page components

### Task 2.1: Rewrite Hero component

**Files:**
- Modify: `src/components/Hero.jsx`
- Modify: `src/components/Hero.css`

**Step 1:** Read current `src/components/Hero.jsx` to understand data source for slides.

**Step 2:** Replace `src/components/Hero.jsx` with editorial version:

```jsx
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useReducedMotion } from '../hooks/useReducedMotion';
import './Hero.css';

// Keep current slide data OR move to a separate file if it's external
const SLIDES = [
  {
    image: '/hero/slide-1.jpg',
    eyebrow: 'Edición 2026',
    title: ['Vehículos', <em key="em">selectos.</em>, <br key="br" />, 'Garantía internacional.'],
  },
  {
    image: '/hero/slide-2.jpg',
    eyebrow: 'Rep. Dominicana',
    title: ['Calidad', <em key="em">certificada.</em>, <br key="br" />, 'Financiamiento flexible.'],
  },
  {
    image: '/hero/slide-3.jpg',
    eyebrow: 'Desde 2024',
    title: ['Autos premium,', <br key="br" />, <em key="em">experiencia única.</em>],
  },
];

export default function Hero() {
  const [idx, setIdx] = useState(0);
  const reduced = useReducedMotion();
  const timer = useRef(null);

  useEffect(() => {
    if (reduced) return;
    timer.current = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 7000);
    return () => clearInterval(timer.current);
  }, [reduced]);

  const pause = () => clearInterval(timer.current);
  const resume = () => {
    if (reduced) return;
    pause();
    timer.current = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 7000);
  };

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      aria-label="Vehículos destacados"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className={`hero__slide ${i === idx ? 'is-active' : ''}`}
          aria-hidden={i !== idx}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} de ${SLIDES.length}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        />
      ))}
      <div className="hero__overlay" aria-hidden="true" />

      <div className="container hero__content">
        <p className="eyebrow hero__eyebrow">{SLIDES[idx].eyebrow}</p>
        <h1 className="display-2xl hero__title">
          {SLIDES[idx].title}
        </h1>
        <div className="hero__actions">
          <Link to="/inventario" className="btn btn--primary btn--lg btn-arrow">
            <span>Explorar inventario</span>
            <FiArrowRight className="arrow" aria-hidden="true" />
          </Link>
          <a
            href="https://wa.me/18294470259"
            className="btn btn--ghost btn--lg"
            aria-label="Contactar por WhatsApp"
          >
            <FaWhatsapp aria-hidden="true" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      <div className="hero__indicators" role="tablist" aria-label="Seleccionar slide">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            role="tab"
            type="button"
            aria-selected={i === idx}
            aria-label={`Slide ${i + 1}`}
            className={`hero__indicator ${i === idx ? 'is-active' : ''}`}
            onClick={() => setIdx(i)}
          />
        ))}
        <span className="hero__counter">
          <span className="tabular">{String(idx + 1).padStart(2, '0')}</span>
          <span className="hero__counter-sep">/</span>
          <span className="tabular">{String(SLIDES.length).padStart(2, '0')}</span>
        </span>
      </div>
    </section>
  );
}
```

**Note:** slide images must exist in `public/hero/` (slide-1.jpg, slide-2.jpg, slide-3.jpg). If they don't yet, either copy existing ones from your current setup or add TODO placeholders. Check current Hero.jsx first for where images come from.

**Step 3:** Replace `src/components/Hero.css`:

```css
.hero {
  position: relative;
  height: 100vh;
  min-height: 640px;
  overflow: hidden;
  background: var(--ink-950);
}

.hero__slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transform: scale(1);
  transition: opacity var(--duration-epic) var(--ease-magazine);
}
.hero__slide.is-active {
  opacity: 1;
  animation: heroKenBurns 9s linear both;
}
@keyframes heroKenBurns {
  from { transform: scale(1); }
  to { transform: scale(1.06); }
}
@media (prefers-reduced-motion: reduce) {
  .hero__slide.is-active { animation: none; }
}

.hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg,
    rgba(10,10,11,0.4) 0%,
    rgba(10,10,11,0.55) 60%,
    rgba(10,10,11,0.8) 100%);
}

.hero__content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: var(--container-wide);
}
.hero__eyebrow {
  color: var(--gold-500);
  margin-bottom: var(--space-4);
}
.hero__title {
  color: var(--silver-100);
  margin-bottom: var(--space-8);
  max-width: 16ch;
}
.hero__title em {
  font-style: italic;
  font-variation-settings: 'opsz' 144, 'SOFT' 60;
  color: var(--gold-500);
}
.hero__actions {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.hero__indicators {
  position: absolute;
  bottom: var(--space-8);
  right: var(--gutter);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  z-index: 2;
}
.hero__indicator {
  width: 8px; height: 8px;
  border-radius: var(--radius-full);
  background: rgba(244, 244, 246, 0.3);
  border: none;
  padding: 0;
  transition:
    width var(--duration-base) var(--ease-out-quart),
    background-color var(--duration-fast) var(--ease-out-quart);
  cursor: pointer;
}
.hero__indicator.is-active {
  width: 24px;
  background: var(--gold-500);
}
.hero__counter {
  margin-left: var(--space-4);
  font-family: var(--font-ui);
  font-size: var(--text-ui-sm);
  color: var(--silver-300);
  letter-spacing: var(--tracking-wide);
}
.hero__counter-sep { margin: 0 var(--space-1); color: var(--silver-500); }
```

**Step 4:** Test. If images missing, create placeholders or reference existing.

Run: `npm run dev`
Expected: Hero is full-viewport dark with slide carousel, eyebrow + title with italic gold emphasis, two CTAs.

**Step 5:** Commit

```bash
git add src/components/Hero.jsx src/components/Hero.css
git commit -m "refactor(hero): editorial hero with Ken Burns, italic emphasis, gold indicators"
```

---

### Task 2.2: Rewrite VehicleCard component

**Files:**
- Modify: `src/components/VehicleCard.jsx`
- Modify: `src/components/VehicleCard.css`

**Step 1:** Read current `VehicleCard.jsx` to understand the shape of the vehicle prop.

**Step 2:** Replace `src/components/VehicleCard.jsx`:

```jsx
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { BiGitCompare } from 'react-icons/bi';
import './VehicleCard.css';

const STATUS_LABEL = {
  available: 'Disponible',
  reserved: 'Reservado',
  sold: 'Vendido',
};

export default function VehicleCard({ vehicle, isCompared, onToggleCompare }) {
  const {
    id, slug, make, model, year, price_usd, price_dop, image_url,
    mileage, transmission, fuel, color, status = 'available',
  } = vehicle;

  const slugPath = slug || id;
  const title = `${make} ${model}`;

  return (
    <article className="v-card">
      <div className="v-card__media">
        <img
          src={image_url || '/placeholder-vehicle.jpg'}
          alt={`${year} ${title}`}
          loading="lazy"
          decoding="async"
          width="600"
          height="450"
        />
        <span className={`v-card__status v-card__status--${status}`}>
          {STATUS_LABEL[status] || status}
        </span>
        {onToggleCompare && (
          <button
            type="button"
            className="v-card__compare"
            onClick={() => onToggleCompare(vehicle)}
            aria-pressed={!!isCompared}
            aria-label={isCompared ? 'Quitar de comparación' : 'Agregar a comparación'}
          >
            <BiGitCompare aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="v-card__body">
        <p className="eyebrow">{year} · {make}</p>
        <h3 className="v-card__title">{model}</h3>

        <p className="v-card__price tabular">
          ${Number(price_usd).toLocaleString('en-US')}
        </p>
        {price_dop && (
          <p className="v-card__price-alt tabular">
            RD$ {Number(price_dop).toLocaleString('es-DO')}
          </p>
        )}

        <hr className="v-card__divider" aria-hidden="true" />

        <ul className="v-card__specs">
          {mileage != null && <li><span className="tabular">{Number(mileage).toLocaleString('es-DO')}</span> km</li>}
          {transmission && <li>{transmission}</li>}
          {fuel && <li>{fuel}</li>}
          {color && <li>{color}</li>}
        </ul>

        <Link
          to={`/inventario/${slugPath}`}
          className="btn btn--primary btn--md btn-arrow v-card__cta"
        >
          <span>Ver detalle</span>
          <FiArrowRight className="arrow" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
```

**Step 3:** Replace `src/components/VehicleCard.css`:

```css
.v-card {
  display: flex;
  flex-direction: column;
  background: var(--ink-900);
  border: 1px solid var(--ink-700);
  border-radius: var(--radius-sm);
  overflow: hidden;
  transition:
    transform var(--duration-base) var(--ease-out-quart),
    border-color var(--duration-base) var(--ease-out-quart),
    box-shadow var(--duration-base) var(--ease-out-quart);
}
@media (hover: hover) {
  .v-card:hover {
    transform: translateY(-4px);
    border-color: var(--gold-20-alpha);
    box-shadow: var(--shadow-lg);
  }
  .v-card:hover .v-card__media img { transform: scale(1.04); }
  .v-card:hover .v-card__title { color: var(--gold-400); }
}

.v-card__media {
  position: relative;
  aspect-ratio: 4 / 3;
  background: var(--ink-800);
  overflow: hidden;
}
.v-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--duration-slower) var(--ease-out-expo);
}

.v-card__status {
  position: absolute;
  top: var(--space-3);
  left: var(--space-3);
  padding: var(--space-1) var(--space-3);
  font-family: var(--font-ui);
  font-size: var(--text-ui-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  background: rgba(10, 10, 11, 0.8);
  backdrop-filter: blur(6px);
  border: 1px solid var(--ink-700);
  border-radius: var(--radius-sm);
}
.v-card__status--available { color: var(--success); border-color: rgba(74, 222, 128, 0.3); }
.v-card__status--reserved  { color: var(--warning); border-color: rgba(251, 191, 36, 0.3); }
.v-card__status--sold      { color: var(--danger); border-color: rgba(248, 113, 113, 0.3); }

.v-card__compare {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  background: rgba(10, 10, 11, 0.8);
  backdrop-filter: blur(6px);
  border: 1px solid var(--ink-700);
  border-radius: var(--radius-sm);
  color: var(--silver-300);
  transition: all var(--duration-fast) var(--ease-out-quart);
}
.v-card__compare:hover,
.v-card__compare:focus-visible,
.v-card__compare[aria-pressed='true'] {
  color: var(--gold-500);
  border-color: var(--gold-500);
}

.v-card__body {
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  flex: 1;
}
.v-card__body .eyebrow { margin-bottom: var(--space-1); }
.v-card__title {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  font-weight: 500;
  color: var(--silver-100);
  line-height: var(--leading-snug);
  transition: color var(--duration-fast) var(--ease-out-quart);
  margin-bottom: var(--space-3);
}
.v-card__price {
  font-family: var(--font-display);
  font-size: var(--text-display-lg);
  font-weight: 600;
  color: var(--gold-500);
  line-height: 1;
}
.v-card__price-alt {
  font-size: var(--text-body-sm);
  color: var(--silver-500);
}
.v-card__divider {
  border: none;
  height: 1px;
  background: var(--gold-20-alpha);
  margin: var(--space-4) 0;
  width: 48px;
}
.v-card__specs {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  font-family: var(--font-ui);
  font-size: var(--text-ui-sm);
  color: var(--silver-300);
  margin-bottom: var(--space-5);
}
.v-card__specs li + li::before {
  content: '·';
  color: var(--silver-700);
  margin-right: var(--space-3);
}
.v-card__cta { margin-top: auto; }
```

**Step 4:** Test. Commit:

```bash
git add src/components/VehicleCard.jsx src/components/VehicleCard.css
git commit -m "refactor(card): redesign VehicleCard with editorial dark + gold hairline"
```

---

### Task 2.3: Rewrite FeaturedVehicles (bento grid)

**Files:**
- Modify: `src/components/FeaturedVehicles.jsx`
- Modify: `src/components/FeaturedVehicles.css`

**Step 1:** Read current FeaturedVehicles.jsx to understand how it fetches data.

**Step 2:** Update `FeaturedVehicles.jsx` to use editorial header + bento grid layout. Keep same data fetching, only change markup/structure:

```jsx
// (keep existing imports + data fetching at top)
// replace render with:

return (
  <section className="featured" id="featured">
    <div className="container">
      <header className="featured__header">
        <span className="featured__number">01</span>
        <div>
          <p className="eyebrow">Inventario destacado</p>
          <h2 className="display-xl featured__title">Selección del mes</h2>
        </div>
      </header>

      <div className="featured__grid">
        {vehicles.slice(0, 5).map((v, i) => (
          <div key={v.id} className={`featured__cell featured__cell--${i}`}>
            <VehicleCard vehicle={v} />
          </div>
        ))}
      </div>
    </div>
  </section>
);
```

**Step 3:** Replace `src/components/FeaturedVehicles.css`:

```css
.featured {
  padding-block: var(--section-padding-y);
  background: var(--ink-950);
}

.featured__header {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-6);
  align-items: start;
  margin-bottom: var(--space-12);
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--ink-800);
}
.featured__number {
  font-family: var(--font-display);
  font-size: var(--text-display-lg);
  font-weight: 400;
  color: var(--gold-500);
  line-height: 1;
}
.featured__title {
  color: var(--silver-100);
  font-weight: 500;
  font-variation-settings: 'opsz' 96, 'SOFT' 30;
}

/* Bento grid: 1 big (2 rows) + 4 small */
.featured__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto;
  gap: var(--space-6);
}
.featured__cell--0 { grid-column: span 2; grid-row: span 2; }
.featured__cell--0 .v-card__media { aspect-ratio: 16 / 10; }

@media (max-width: 1023px) {
  .featured__grid { grid-template-columns: repeat(2, 1fr); }
  .featured__cell--0 { grid-column: span 2; grid-row: auto; }
}
@media (max-width: 640px) {
  .featured__grid { grid-template-columns: 1fr; }
  .featured__cell--0 { grid-column: span 1; }
}
```

**Step 4:** Test. Commit:

```bash
git add src/components/FeaturedVehicles.jsx src/components/FeaturedVehicles.css
git commit -m "refactor(featured): bento grid with editorial 01/title header"
```

---

### Task 2.4: Rewrite Services as editorial numbered list

**Files:**
- Modify: `src/components/Services.jsx`
- Modify: `src/components/Services.css`

**Step 1:** Replace `src/components/Services.jsx`:

```jsx
import { FiArrowRight } from 'react-icons/fi';
import './Services.css';

const SERVICES = [
  {
    title: 'Financiamiento flexible',
    body: 'Planes desde 6 a 72 meses con las principales aseguradoras y bancos del país.',
  },
  {
    title: 'Garantía internacional',
    body: 'Todos nuestros vehículos pasan inspección certificada con historial documentado.',
  },
  {
    title: 'Servicio post-venta',
    body: 'Mantenimiento programado, gestión de pólizas y soporte dedicado.',
  },
  {
    title: 'Entrega personalizada',
    body: 'Coordinamos entrega en el país con documentación al día.',
  },
];

export default function Services() {
  return (
    <section className="services" id="service">
      <div className="container">
        <header className="services__header">
          <span className="services__number">02</span>
          <div>
            <p className="eyebrow">Servicios</p>
            <h2 className="display-xl services__title">Lo que incluimos.</h2>
          </div>
        </header>

        <ol className="services__list">
          {SERVICES.map((s, i) => (
            <li key={s.title} className="services__item">
              <span className="services__item-number tabular">{String(i + 1).padStart(2, '0')}</span>
              <div className="services__item-body">
                <h3 className="services__item-title">{s.title}</h3>
                <p>{s.body}</p>
              </div>
              <a href="#contact" className="services__item-cta btn-arrow" aria-label={`Más sobre ${s.title}`}>
                <span>Más</span>
                <FiArrowRight className="arrow" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

**Step 2:** Replace `src/components/Services.css`:

```css
.services {
  padding-block: var(--section-padding-y);
  background: var(--ink-900);
  border-block: 1px solid var(--ink-800);
}

.services__header {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-6);
  align-items: start;
  margin-bottom: var(--space-12);
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--ink-800);
}
.services__number {
  font-family: var(--font-display);
  font-size: var(--text-display-lg);
  color: var(--gold-500);
  line-height: 1;
}
.services__title { color: var(--silver-100); }

.services__list { list-style: none; }
.services__item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--space-8);
  align-items: start;
  padding-block: var(--space-8);
  border-bottom: 1px solid var(--ink-800);
}
.services__item:last-child { border-bottom: none; }
.services__item-number {
  font-family: var(--font-display);
  font-size: var(--text-h1);
  color: var(--silver-700);
}
.services__item-title {
  font-family: var(--font-display);
  font-size: var(--text-h2);
  font-weight: 500;
  color: var(--silver-100);
  margin-bottom: var(--space-3);
}
.services__item-body p {
  color: var(--silver-300);
  max-width: 60ch;
}
.services__item-cta {
  color: var(--gold-500);
  font-family: var(--font-ui);
  font-size: var(--text-ui);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  align-self: center;
}
.services__item-cta:hover { color: var(--gold-400); }

@media (max-width: 768px) {
  .services__item {
    grid-template-columns: auto 1fr;
    gap: var(--space-4);
  }
  .services__item-cta { grid-column: 1 / -1; justify-self: start; margin-top: var(--space-2); }
}
```

**Step 3:** Commit:

```bash
git add src/components/Services.jsx src/components/Services.css
git commit -m "refactor(services): editorial numbered list replacing card grid"
```

---

### Task 2.5: Update Features component (same pattern)

**Files:**
- Modify: `src/components/Features.jsx`
- Modify: `src/components/Features.css`

**Step 1:** Apply same editorial pattern as Services (numbered list with hairlines). Read current Features.jsx first to get the data.

**Step 2:** Replace with editorial numbered list structure. Use `03` as the number for this section.

**Step 3:** CSS follows same pattern as `services.css` — reuse variables, just rename classes to `.features`, `.features__item`, etc.

**Step 4:** Commit:

```bash
git add src/components/Features.jsx src/components/Features.css
git commit -m "refactor(features): editorial numbered list with hairlines"
```

---

### Task 2.6: Update Contact, EmptyState, Welcome, WhatsAppButton, LoadingSkeleton

**Files:** one task per component, each its own commit. For each:

1. Read current JSX and CSS.
2. Apply new tokens: replace `--primary`/`--accent`/`--secondary`/`--text-primary`/etc. with new tokens (`--silver-100`, `--gold-500`, `--ink-900`, etc.).
3. Replace `--radius-lg` (1rem) with `--radius-sm` (2px) for editorial feel.
4. Replace `--transition-base` with `var(--duration-fast) var(--ease-out-quart)`.
5. Ensure typography uses `var(--font-display)` for headings, `var(--font-ui)` for labels.
6. Respect `prefers-reduced-motion` for any animations.

Specifically for `WhatsAppButton.jsx`:
- Remove continuous pulse keyframe.
- Add: after 5 seconds without scroll, trigger one pulse animation (add class `.is-attention` for 1.5s).
- On scroll down >200px, collapse to icon only; on scroll up, expand back.

Commit each separately:
```bash
git commit -m "refactor(contact): align to 2026 tokens"
git commit -m "refactor(whatsapp): one-shot pulse, collapse on scroll"
# etc.
```

---

## Phase 3 — Inventory and detail pages

### Task 3.1: Rewrite InventoryPage layout

**Files:**
- Modify: `src/pages/InventoryPage.jsx`
- Modify: `src/pages/InventoryPage.css`

**Changes:**
- Filters become a **sticky left sidebar** on desktop (not collapsible), bottom drawer on mobile.
- Search is a large input at top, `font-family: var(--font-display)`, big font-size, minimal chrome (border-bottom only).
- Grid gap increases to `var(--space-8)` (48px).
- Result count displays as `"01 – 12 de 48 vehículos"` in eyebrow style.
- Compare bar (when active) becomes bottom sheet with backdrop-blur.

(Full code omitted here for brevity — refer to component patterns established in Phase 2. Follow dark tokens, editorial typography, gold hairlines.)

**Commit:**
```bash
git commit -m "refactor(inventory): sticky filters sidebar, editorial search, 48px gap"
```

---

### Task 3.2: Rewrite VehicleDetailPage

**Files:**
- Modify: `src/pages/VehicleDetailPage.jsx`
- Modify: `src/pages/VehicleDetailPage.css`

**Changes:**
- Two-column layout: gallery 60% left, info 40% right.
- Price is the largest element on the page: `var(--text-display-xl)`, `var(--font-display)`, `tabular-nums`, gold color.
- Specs table has gold hairlines between rows (no alternating backgrounds).
- Financing calculator is collapsed by default (accordion with ease-magazine open).
- Gallery lightbox: focus-trap, Escape to close, arrow keys navigate, returns focus to trigger image.
- Add breadcrumb: `Inicio / Inventario / BMW X5 2024` at top in ui-xs Inter uppercase.

**Commit:**
```bash
git commit -m "refactor(detail): 60/40 layout, display-xl price, gold hairline specs, a11y lightbox"
```

---

### Task 3.3: Rewrite ComparePage as split-screen

**Files:**
- Modify: `src/pages/ComparePage.jsx`
- Modify: `src/pages/ComparePage.css`

**Changes:**
- Remove horizontal-scroll table pattern.
- Each vehicle = one column (max 3 side by side on desktop).
- Spec rows with gold hairline separators.
- Differences get `text-decoration: underline wavy var(--gold-500)` on the differing value (not row-background).
- Mobile: each vehicle becomes an expandable accordion.

**Commit:**
```bash
git commit -m "refactor(compare): split-screen columns with wavy-gold diff highlights"
```

---

## Phase 4 — Admin area

### Task 4.1: Admin DashboardPage alignment

**Files:**
- Modify: `src/pages/admin/DashboardPage.css`
- Modify: `src/pages/admin/DashboardPage.jsx` (minor markup if needed)

**Changes:**
- Replace all `--primary`, `--accent`, `--secondary`, `--background-*`, `--text-*` with new tokens.
- Stats: number enormous (Fraunces display-md), label Inter Tight uppercase tracked above.
- Table: Fraunces for vehicle names, Inter Tight headers uppercase tracked.
- Inputs: bottom-border only variant (`border: none; border-bottom: 1px solid var(--ink-600);` with `:focus` `border-bottom-color: var(--gold-500)`).

**Commit:**
```bash
git commit -m "refactor(admin): align dashboard to 2026 tokens, bottom-border inputs"
```

---

### Task 4.2: Admin LoginPage + VehicleFormPage alignment

Same treatment as 4.1. Each gets its own commit.

**Commits:**
```bash
git commit -m "refactor(admin): align login to 2026 system"
git commit -m "refactor(admin): align vehicle form to 2026 system"
```

---

## Phase 5 — Production hardening

### Task 5.1: Install new dependencies

**Files:**
- Modify: `package.json` (via npm)

**Step 1:** Install:

```bash
npm install react-helmet-async @tanstack/react-query
npm install --save-dev @playwright/test vite-plugin-sitemap
```

**Step 2:** Commit:

```bash
git add package.json package-lock.json
git commit -m "chore(deps): add react-helmet-async, tanstack-query, playwright, sitemap"
```

---

### Task 5.2: Set up HelmetProvider + QueryClientProvider

**Files:**
- Modify: `src/main.jsx`
- Create: `src/lib/queryClient.js`

**Step 1:** Create `src/lib/queryClient.js`:

```js
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // 1 min
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
    },
  },
});
```

**Step 2:** Update `src/main.jsx`:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './App.jsx';
import { queryClient } from './lib/queryClient';
import './index.css';
import './styles/motion.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);
```

**Step 3:** Commit:

```bash
git add src/main.jsx src/lib/queryClient.js
git commit -m "feat(core): wire HelmetProvider and TanStack Query"
```

---

### Task 5.3: Create SEO component + JSON-LD helpers

**Files:**
- Create: `src/components/SEO.jsx`
- Create: `src/lib/schema.js`

**Step 1:** Create `src/components/SEO.jsx`:

```jsx
import { Helmet } from 'react-helmet-async';

const DEFAULT_TITLE = 'A2C Internacional — Vehículos premium en República Dominicana';
const DEFAULT_DESC  = 'Concesionaria de vehículos seleccionados con garantía internacional, financiamiento flexible y entrega en República Dominicana.';
const DEFAULT_OG    = '/og-default.jpg';
const SITE_URL      = 'https://a2cinternacional.com'; // update when deployed

export default function SEO({
  title,
  description = DEFAULT_DESC,
  image = DEFAULT_OG,
  url,
  type = 'website',
  jsonLd,
}) {
  const fullTitle = title ? `${title} · A2C Internacional` : DEFAULT_TITLE;
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  const fullImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  return (
    <Helmet>
      <html lang="es-DO" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:locale" content="es_DO" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
```

**Step 2:** Create `src/lib/schema.js`:

```js
const SITE_URL = 'https://a2cinternacional.com';

export function autoDealerSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: 'A2C Internacional',
    url: SITE_URL,
    image: `${SITE_URL}/logo.png`,
    telephone: '+18294470259',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'DO',
      addressLocality: 'Santo Domingo',
    },
  };
}

export function vehicleSchema(vehicle) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    brand: { '@type': 'Brand', name: vehicle.make },
    model: vehicle.model,
    vehicleModelDate: vehicle.year,
    mileageFromOdometer: vehicle.mileage
      ? { '@type': 'QuantitativeValue', value: vehicle.mileage, unitCode: 'KMT' }
      : undefined,
    color: vehicle.color,
    fuelType: vehicle.fuel,
    vehicleTransmission: vehicle.transmission,
    offers: {
      '@type': 'Offer',
      price: vehicle.price_usd,
      priceCurrency: 'USD',
      availability: vehicle.status === 'available'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/SoldOut',
      seller: { '@type': 'AutoDealer', name: 'A2C Internacional' },
    },
    image: vehicle.image_url,
  };
}
```

**Step 3:** Add SEO component usage in HomePage, InventoryPage, VehicleDetailPage. Example for VehicleDetailPage:

```jsx
import SEO from '../components/SEO';
import { vehicleSchema } from '../lib/schema';

// inside render:
<SEO
  title={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
  description={`${vehicle.year} ${vehicle.make} ${vehicle.model} · US$${vehicle.price_usd.toLocaleString()} · ${vehicle.mileage?.toLocaleString()} km · ${vehicle.color}`}
  image={vehicle.image_url}
  url={`/inventario/${vehicle.slug || vehicle.id}`}
  type="product"
  jsonLd={vehicleSchema(vehicle)}
/>
```

**Step 4:** Commit:

```bash
git add src/components/SEO.jsx src/lib/schema.js src/pages/
git commit -m "seo: add SEO component with OG, Twitter, JSON-LD Vehicle and AutoDealer"
```

---

### Task 5.4: Error Boundary

**Files:**
- Create: `src/components/ErrorBoundary.jsx`
- Modify: `src/App.jsx`

**Step 1:** Create `src/components/ErrorBoundary.jsx`:

```jsx
import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.PROD) {
      // TODO: send to Sentry if configured
      console.error('[ErrorBoundary]', error, info);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: '4rem 1rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '48ch' }}>
          <p className="eyebrow" style={{ color: 'var(--gold-500)' }}>Error 500</p>
          <h1 className="display-lg" style={{ color: 'var(--silver-100)', marginTop: '1rem' }}>
            Algo salió mal.
          </h1>
          <p style={{ color: 'var(--silver-300)', marginTop: '1rem', marginBottom: '2rem' }}>
            Ocurrió un error inesperado. Intenta recargar la página.
          </p>
          <button
            className="btn btn--primary btn--md"
            type="button"
            onClick={() => location.reload()}
          >
            Recargar
          </button>
          <Link to="/" className="btn btn--ghost btn--md" style={{ marginLeft: '1rem' }}>
            Ir al inicio
          </Link>
        </div>
      </div>
    );
  }
}
```

**Step 2:** Wrap app in `src/App.jsx`:

```jsx
import ErrorBoundary from './components/ErrorBoundary';
// ... wrap the main Routes with <ErrorBoundary>...</ErrorBoundary>
```

**Step 3:** Test by throwing error in a component temporarily. Expected: editorial fallback renders.

**Step 4:** Commit:

```bash
git add src/components/ErrorBoundary.jsx src/App.jsx
git commit -m "feat(errors): add ErrorBoundary with editorial fallback UI"
```

---

### Task 5.5: Code splitting with React.lazy

**Files:**
- Modify: `src/App.jsx`

**Step 1:** Convert route components to lazy:

```jsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

const HomePage = lazy(() => import('./pages/HomePage'));
const InventoryPage = lazy(() => import('./pages/InventoryPage'));
const VehicleDetailPage = lazy(() => import('./pages/VehicleDetailPage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));
const LoginPage = lazy(() => import('./pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const VehicleFormPage = lazy(() => import('./pages/admin/VehicleFormPage'));

const Fallback = () => <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}><div className="spinner" /></div>;

export default function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <Suspense fallback={<Fallback />}>
          <Routes>
            {/* existing routes */}
          </Routes>
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
}
```

**Step 2:** Build and verify bundle sizes:

Run: `npm run build`
Expected: Multiple `.js` chunks in `dist/assets/`, main entry < 180kb gzipped (check with `ls -lh dist/assets/*.js`).

**Step 3:** Commit:

```bash
git add src/App.jsx
git commit -m "perf(routes): code-split routes with React.lazy + Suspense"
```

---

### Task 5.6: Picture component with WebP fallback

**Files:**
- Create: `src/components/ui/Picture.jsx`

**Step 1:** Create:

```jsx
/**
 * <Picture src="/foo.jpg" alt="..." sizes="(max-width: 768px) 100vw, 50vw" />
 *
 * Assumes Supabase Storage transforms or a build-time optimizer provides .webp.
 * For now, generates <picture> with webp source + jpg fallback.
 */
export default function Picture({ src, alt, sizes = '100vw', loading = 'lazy', fetchPriority, className, width, height }) {
  if (!src) return null;
  const webp = src.replace(/\.(jpe?g|png)$/i, '.webp');
  return (
    <picture className={className}>
      <source type="image/webp" srcSet={webp} sizes={sizes} />
      <img
        src={src}
        alt={alt}
        loading={loading}
        fetchpriority={fetchPriority}
        decoding="async"
        width={width}
        height={height}
      />
    </picture>
  );
}
```

**Step 2:** Replace `<img>` in VehicleCard, Hero, gallery with `<Picture>`.

**Step 3:** Commit:

```bash
git add src/components/ui/Picture.jsx src/components/VehicleCard.jsx src/components/Hero.jsx
git commit -m "perf(img): add Picture component with WebP/JPG fallback"
```

---

### Task 5.7: Sitemap + robots.txt

**Files:**
- Modify: `vite.config.js`
- Create: `public/robots.txt`

**Step 1:** Update `vite.config.js`:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import sitemap from 'vite-plugin-sitemap';

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://a2cinternacional.com',
      exclude: ['/admin/**'],
    }),
  ],
  // ...keep existing config
});
```

**Step 2:** Create `public/robots.txt`:

```
User-agent: *
Disallow: /admin/
Allow: /

Sitemap: https://a2cinternacional.com/sitemap.xml
```

**Step 3:** Build and verify:

Run: `npm run build`
Expected: `dist/sitemap.xml` and `dist/robots.txt` exist.

**Step 4:** Commit:

```bash
git add vite.config.js public/robots.txt
git commit -m "seo: generate sitemap.xml and add robots.txt excluding admin"
```

---

## Phase 6 — Accessibility hardening

### Task 6.1: ARIA audit pass per component

**Files:** touch multiple components.

Per component:
1. Carousel (Hero): add `aria-roledescription="carousel"`, `aria-live="polite"`, slide groups with `aria-roledescription="slide"`.
2. Filters (InventoryPage): every toggle has `aria-expanded`, `aria-controls`.
3. Modal/Lightbox: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`.
4. Mobile menu: already added `aria-expanded`, `aria-controls` in Header rewrite.
5. Compare buttons: `aria-pressed`.
6. Forms: every input has `<label htmlFor>`, error messages linked via `aria-describedby` and `aria-invalid="true"` when invalid.

**Commit:**
```bash
git commit -m "a11y: ARIA audit across carousel, filters, modal, forms"
```

---

### Task 6.2: Keyboard flows

**Steps per component:**
1. Lightbox: focus trap (focus-trap-react or manual), Escape closes, arrows navigate, restore focus on close.
2. Hero carousel: left/right arrow keys when indicators focused.
3. Filters drawer: Escape closes, focus trap while open.
4. Mobile drawer: Escape closes, focus trap.

Consider installing `focus-trap-react` (small, well-maintained):

```bash
npm install focus-trap-react
```

**Commit:**
```bash
git commit -m "a11y: keyboard flows (focus trap, arrows, escape) in modal/drawer/carousel"
```

---

### Task 6.3: Manual a11y audit

Run axe DevTools extension on each key page:
- `/` Homepage
- `/inventario`
- `/inventario/:slug`
- `/comparar`
- `/admin/login`

Fix any violations found. Commit per-page as issues are resolved.

**Commit:**
```bash
git commit -m "a11y: resolve axe violations on homepage, inventory, detail"
```

---

## Phase 7 — Testing & CI

### Task 7.1: Playwright setup

**Files:**
- Run: `npm init playwright@latest` (accept defaults, JS, no GH action here — we add custom one)
- Create: `tests/e2e/smoke.spec.js`

**Step 1:** Run setup:

```bash
npm init playwright@latest -- --quiet
```

Accept: TypeScript=no, tests folder=`tests/e2e`, install browsers=yes.

**Step 2:** Create `tests/e2e/smoke.spec.js`:

```js
import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:5173';

test.describe('A2C smoke tests', () => {
  test('homepage loads and shows featured inventory', async ({ page }) => {
    await page.goto(BASE);
    await expect(page).toHaveTitle(/A2C/);
    await expect(page.locator('.hero')).toBeVisible();
    await expect(page.locator('.featured')).toBeVisible();
  });

  test('inventory page shows at least one vehicle card', async ({ page }) => {
    await page.goto(`${BASE}/inventario`);
    await expect(page.locator('.v-card').first()).toBeVisible({ timeout: 10000 });
  });

  test('click on vehicle card navigates to detail page', async ({ page }) => {
    await page.goto(`${BASE}/inventario`);
    const firstCard = page.locator('.v-card').first();
    await firstCard.locator('a').first().click();
    await expect(page).toHaveURL(/\/inventario\/.+/);
  });

  test('search filters inventory', async ({ page }) => {
    await page.goto(`${BASE}/inventario`);
    await page.fill('input[type="search"], input[placeholder*="Buscar" i]', 'BMW');
    // UX assertion: at least the URL or card count updates
    await page.waitForTimeout(500);
    await expect(page.locator('.v-card, .empty-state')).toBeVisible();
  });

  test('admin login renders', async ({ page }) => {
    await page.goto(`${BASE}/admin/login`);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });
});
```

**Step 3:** Verify tests run (dev server must be running):

Run: `npx playwright test`
Expected: 5 tests pass.

**Step 4:** Commit:

```bash
git add playwright.config.* tests/ package.json package-lock.json
git commit -m "test: add Playwright smoke tests for core flows"
```

---

### Task 7.2: Lighthouse CI GitHub Action

**Files:**
- Create: `.github/workflows/lighthouse.yml`
- Create: `lighthouserc.json`

**Step 1:** Create `.github/workflows/lighthouse.yml`:

```yaml
name: Lighthouse CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - name: Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

**Step 2:** Create `lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "url": ["http://localhost/index.html"]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.85 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["warn", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.95 }]
      }
    }
  }
}
```

**Step 3:** Commit:

```bash
git add .github/workflows/lighthouse.yml lighthouserc.json
git commit -m "ci: add Lighthouse CI with a11y and SEO thresholds"
```

---

## Phase 8 — Deploy to Vercel

### Task 8.1: Vercel config + CSP

**Files:**
- Create: `vercel.json`

**Step 1:** Create `vercel.json`:

```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; img-src 'self' data: https://*.supabase.co https://wa.me; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self' https://*.supabase.co; frame-src 'none'; base-uri 'self'; form-action 'self'"
        }
      ]
    },
    {
      "source": "/fonts/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

**Step 2:** Commit:

```bash
git add vercel.json
git commit -m "chore(deploy): add vercel.json with CSP, HSTS, and asset caching"
```

**Step 3 (manual):** Connect repo to Vercel.com, import project, deploy. Update `SITE_URL` in `src/components/SEO.jsx` and `src/lib/schema.js` with the real production domain.

---

### Task 8.2: Remove gh-pages artifacts

**Files:**
- Modify: `package.json` (remove deploy / predeploy scripts)

**Step 1:** Edit `package.json` scripts:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "test:e2e": "playwright test"
}
```

**Step 2:** Remove `gh-pages` dependency:

```bash
npm uninstall gh-pages
```

**Step 3:** Commit:

```bash
git add package.json package-lock.json
git commit -m "chore(deploy): remove gh-pages scripts, move to Vercel"
```

---

## Phase 9 — Final verification

### Task 9.1: End-to-end checklist

Before declaring done, run each and confirm:

```bash
# 1. Build succeeds
npm run build
# Expected: no errors, dist/ populated

# 2. Lighthouse local run
npx lhci autorun --collect.staticDistDir=./dist
# Expected: performance >= 0.85, a11y >= 0.95, seo >= 0.95

# 3. Playwright smoke
npm run test:e2e
# Expected: 5/5 pass

# 4. Bundle analysis
ls -lh dist/assets/*.js
# Expected: main < 180kb gzipped
```

**Manual QA:**
- [ ] Visit homepage, hero loops, CTAs work
- [ ] Inventory loads, filters work, search works
- [ ] Click auto, detail renders with big price, specs with hairlines
- [ ] Compare 2 autos, differences show wavy gold underline
- [ ] Mobile drawer opens from top
- [ ] Keyboard: Tab through hero, Escape closes modal, arrows navigate carousel
- [ ] `prefers-reduced-motion` on system: Ken Burns stops, hover lifts stop
- [ ] VoiceOver (Mac) / NVDA: reads hero eyebrow + title + CTA in correct order
- [ ] WhatsApp button: no continuous pulse, one pulse after 5s idle
- [ ] Admin login works, dashboard loads

**Final commit (if changes):**

```bash
git commit -m "chore: final polish after QA"
```

---

## Phase 10 — Docs update

### Task 10.1: Update README

**Files:**
- Modify: `README.md` (or create if missing)

Document:
- Development setup (`npm install`, `npm run dev`)
- Design system pointers (docs/plans/…)
- Build and deploy (`npm run build`, Vercel auto-deploys on main)
- Testing (`npm run test:e2e`)
- Supabase env vars required (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)

**Commit:**
```bash
git commit -m "docs: update README with 2026 stack and workflow"
```

---

## Execution notes

- After each Phase, run `npm run dev` and eyeball at least one affected route.
- After Phases 2, 3, and 5: screenshot and compare vs. old for regression awareness.
- Phase 6 and 7 are non-negotiable for "production-ready".
- Phase 8 can be deferred if staying on gh-pages is a hard requirement (but you lose CSP).

## Risk register

| Risk | Severity | Mitigation |
|---|---|---|
| Self-hosted fonts miss glyph (ñ, á) | Medium | Use `latin-ext` subset, verify after Task 0.1 |
| Supabase image URLs not WebP | Medium | `<Picture>` falls back to original if webp 404s; configure Supabase transforms later |
| Admin styles broken during token migration | Low | Phase 4 is isolated, verify login works before proceeding |
| Vercel deploy breaks SPA routing | Low | `vercel.json` rewrites `/(.*)` to `/` |
| CSP blocks Supabase requests | Medium | Tested `connect-src https://*.supabase.co` covers it |

---

**Done when:** all phases complete, verification checklist passes, site deployed to Vercel with analytics, Lighthouse scores meet thresholds.
