import { test, expect } from '@playwright/test'

// Regresión del peor modo de falla del backend: un servidor que acepta la
// conexión pero nunca responde (proyecto Supabase saliendo de pausa, o
// saturado). No rechaza la promesa, así que sin el timeout de api.js el
// catch nunca corre, el fallback a demo nunca se activa y el visitante se
// queda mirando skeletons indefinidamente.
//
// Este proyecto corre contra el server de :5174, arrancado con credenciales
// falsas para que isSupabaseConfigured sea true (ver playwright.config.js).
// El host nunca se contacta: interceptamos las peticiones REST aquí.

// api.js corta a los 8s; dejamos margen para el arranque de la página.
const FALLBACK = { timeout: 15_000 }

/** Deja las peticiones a PostgREST colgadas para siempre, sin responder. */
const colgarBackend = (page) =>
  page.route('**/rest/v1/**', () => {
    // A propósito: ni fulfill, ni continue, ni abort.
  })

const VEHICULO_REAL = {
  id: '11111111-1111-4111-8111-111111111111',
  brand: 'Toyota',
  model: 'Fortuner',
  year: 2024,
  price_usd: 55000,
  mileage: 12000,
  fuel_type: 'Diesel',
  transmission: 'Automática',
  body_type: 'SUV',
  condition: 'Usado',
  status: 'disponible',
  color: 'Blanco Perla',
  featured: true,
  vehicle_images: [],
}

/** Backend sano: responde normal. Control de que el timeout no estorba. */
const responderBackend = (page) =>
  page.route('**/rest/v1/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(
        route.request().url().includes('/exchange_rates')
          ? [{ usd_to_dop: 61.25 }]
          : [VEHICULO_REAL]
      ),
    })
  )

test.describe('Backend colgado', () => {
  test('el inventario cae a demo en vez de quedarse cargando', async ({ page }) => {
    await colgarBackend(page)
    await page.goto('inventario')

    await expect(page.locator('.v-card').first()).toBeVisible(FALLBACK)
    await expect(page.locator('.demo-notice')).toBeVisible()

    // El estado de carga tiene que haber terminado, no solo haberse rellenado
    await expect(page.locator('.inventory-subtitle')).not.toHaveText(/cargando/i)
  })

  test('los destacados del home caen a demo', async ({ page }) => {
    await colgarBackend(page)
    await page.goto('')

    await expect(page.locator('#featured .v-card').first()).toBeVisible(FALLBACK)
    await expect(page.locator('#featured .demo-notice')).toBeVisible()
  })

  test('el detalle de un vehículo resuelve en vez de colgarse', async ({ page }) => {
    await colgarBackend(page)
    // Un id que no es del inventario demo fuerza la consulta a Supabase
    await page.goto('vehiculo/00000000-0000-4000-8000-000000000000')

    // Sin backend no se puede saber si existe: lo importante es que la página
    // llegue a un estado final y no se quede en el spinner.
    await expect(page.getByText('Vehículo no encontrado')).toBeVisible(FALLBACK)
    await expect(page.locator('.detail-loading')).toHaveCount(0)
  })
})

test.describe('Backend sano', () => {
  // Control: sin esto, los tests de arriba pasarían igual si el timeout
  // fuera tan agresivo que nunca dejara pasar una respuesta legítima.
  test('sirve el inventario real y no el de demostración', async ({ page }) => {
    await responderBackend(page)
    await page.goto('inventario')

    await expect(page.getByRole('heading', { name: 'Fortuner' })).toBeVisible(FALLBACK)
    await expect(page.locator('.demo-notice')).toHaveCount(0)
    await expect(page.getByRole('heading', { name: 'AMG GT' })).toHaveCount(0)
  })
})
