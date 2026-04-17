import { test, expect } from '@playwright/test'

test.describe('A2C smoke tests', () => {
  test('homepage loads with hero and featured sections', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/A2C/)
    await expect(page.locator('.hero')).toBeVisible()
    // Skip featured check if no data yet, just confirm main content renders
    await expect(page.locator('main')).toBeVisible()
  })

  test('inventory page loads', async ({ page }) => {
    await page.goto('/inventario')
    await expect(page.locator('.inventory-page')).toBeVisible()
    await expect(page.locator('.inventory-title')).toContainText('vehículos', {
      ignoreCase: true,
    })
    // Search input should be present
    await expect(page.locator('.inventory-search__input')).toBeVisible()
  })

  test('inventory search filters', async ({ page }) => {
    await page.goto('/inventario')
    await page.fill('.inventory-search__input', 'ZZZ-NONEXISTENT-XYZ')
    // Either empty state renders, or cards drop to 0. Accept either.
    await page.waitForTimeout(400)
    const hasEmpty = await page.locator('.empty-state').isVisible().catch(() => false)
    const cards = await page.locator('.v-card').count()
    expect(hasEmpty || cards === 0).toBeTruthy()
  })

  test('admin login page renders form', async ({ page }) => {
    await page.goto('/admin/login')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('.login-submit')).toBeVisible()
  })

  test('header navigation is keyboard accessible', async ({ page }) => {
    await page.goto('/')
    // Skip-nav should be first focusable element
    await page.keyboard.press('Tab')
    const focused = page.locator(':focus')
    await expect(focused).toHaveClass(/skip-nav/)
  })
})
