import { test, expect } from '@playwright/test'

// baseURL termina en /A2C/: navegar SIEMPRE con rutas relativas (sin slash
// inicial) — un path absoluto tipo '/inventario' saltaría el base path.
// Sin backend, la app sirve el inventario demo (12 vehículos con ids
// estables como 'demo-amg-gt' — ver src/lib/demoData.js).

// Margen extra para contenido que espera el fallback Supabase → demo.
const DATA = { timeout: 15_000 }

test.describe('Home', () => {
  test('hero y sección de destacados visibles', async ({ page }) => {
    await page.goto('')
    await expect(page).toHaveTitle(/A2C/)
    await expect(page.locator('.hero')).toBeVisible()
    await expect(page.locator('#featured')).toBeVisible(DATA)
    await expect(page.locator('#featured .v-card').first()).toBeVisible()
  })

  test('skip-nav es el primer elemento enfocable', async ({ page }, testInfo) => {
    // WebKit no enfoca <a> con Tab (comportamiento nativo de Safari)
    test.skip(testInfo.project.name === 'mobile', 'Tab no enfoca links en WebKit')
    await page.goto('')
    // Esperar a que React monte: un Tab antes de la hidratación no mueve el foco
    await expect(page.locator('.hero')).toBeVisible()
    await page.keyboard.press('Tab')
    await expect(page.locator('.skip-nav')).toBeFocused()
  })

  test('home sin overflow horizontal en móvil', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Solo aplica al proyecto mobile')
    await page.goto('')
    await expect(page.locator('.hero')).toBeVisible()
    await expect(page.locator('#featured')).toBeVisible(DATA)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth
    )
    expect(overflow).toBeLessThanOrEqual(1)
  })
})

test.describe('Inventario', () => {
  test('lista los vehículos del inventario demo', async ({ page }) => {
    await page.goto('inventario')
    const cards = page.locator('.v-card')
    await expect(cards.first()).toBeVisible(DATA)
    expect(await cards.count()).toBeGreaterThan(0)
    await expect(page.getByPlaceholder(/buscar/i)).toBeVisible()
  })

  test('la búsqueda filtra por marca', async ({ page }) => {
    await page.goto('inventario')
    const cards = page.locator('.v-card')
    await expect(cards.first()).toBeVisible(DATA)
    await page.getByPlaceholder(/buscar/i).fill('mercedes')
    await expect(cards.filter({ hasNotText: /mercedes/i })).toHaveCount(0)
    await expect(cards.first()).toBeVisible()
  })

  test('filtro de disponibilidad oculta vendidos (si existe)', async ({ page }) => {
    await page.goto('inventario')
    const cards = page.locator('.v-card')
    await expect(cards.first()).toBeVisible(DATA)

    const toggle = page.getByRole('button', { name: /^filtros\b/i })
    if (await toggle.count()) await toggle.first().click()

    const availability = page
      .locator('select')
      .filter({ has: page.locator('option', { hasText: /^\s*Disponibles?\s*$/ }) })
    test.skip((await availability.count()) === 0, 'No hay filtro de disponibilidad')

    await availability.first().selectOption({ label: 'Disponible' })
    await expect(cards.filter({ hasText: 'Vendido' })).toHaveCount(0)
    await expect(cards.first()).toBeVisible()
  })

  test('estado vacío con término sin resultados y limpiar filtros', async ({ page }) => {
    await page.goto('inventario')
    const cards = page.locator('.v-card')
    await expect(cards.first()).toBeVisible(DATA)

    await page.getByPlaceholder(/buscar/i).fill('zzz-sin-resultados-999')
    await expect(cards).toHaveCount(0)
    const emptyState = page.locator('.empty-state')
    await expect(emptyState).toBeVisible()

    await emptyState.getByRole('button', { name: /limpiar/i }).click()
    await expect(cards.first()).toBeVisible()
  })
})

test.describe('Detalle de vehículo', () => {
  test('muestra título, precio, specs, galería y CTA de WhatsApp', async ({ page }) => {
    await page.goto('vehiculo/demo-amg-gt')

    await expect(
      page.getByRole('heading', { level: 1, name: /amg gt/i })
    ).toBeVisible(DATA)
    await expect(page.getByText(/148,500/).first()).toBeVisible()
    await expect(
      page.getByRole('heading', { name: /especificaciones/i })
    ).toBeVisible()
    await expect(page.getByText(/577 HP/).first()).toBeVisible()
    await expect(page.locator('img[alt*="AMG GT"]').first()).toBeVisible()

    // El botón flotante global también es wa.me; el CTA del vehículo lleva
    // el modelo codificado en el mensaje.
    const cta = page.locator('a[href*="wa.me"][href*="AMG"]').first()
    await expect(cta).toBeVisible()
    await expect(cta).toHaveAttribute('href', /wa\.me\/\d+/)
  })
})

test.describe('Comparador', () => {
  test('muestra la tabla con 2 vehículos', async ({ page }) => {
    await page.goto('comparar?ids=demo-amg-gt,demo-bmw-m4')
    const table = page.getByRole('table')
    await expect(table).toBeVisible(DATA)
    await expect(table.getByText(/AMG GT/).first()).toBeVisible()
    await expect(table.getByText(/M4 Competition/).first()).toBeVisible()
  })
})

test.describe('404', () => {
  test('ruta inexistente muestra la página 404 con link al inventario', async ({ page }) => {
    await page.goto('ruta-inexistente')
    await expect(page.getByText(/error 404/i)).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/no existe/i)
    const link = page.getByRole('link', { name: /explorar inventario/i })
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', /\/inventario$/)
  })
})

test.describe('Admin', () => {
  test('la página de login renderiza el formulario', async ({ page }) => {
    await page.goto('admin/login')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })
})
