import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright config para los e2e de A2C.
 * baseURL termina en / para que page.goto('inventario') resuelva bajo /A2C/.
 * (page.goto('/inventario') saltaría el base path — usar rutas relativas.)
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: 'http://localhost:5173/A2C/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /backend-caido\.spec\.js/,
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'] },
      testIgnore: /backend-caido\.spec\.js/,
    },
    {
      // Corre contra el server de :5174, que arranca con credenciales de
      // Supabase falsas para que isSupabaseConfigured sea true sin depender
      // de que exista .env.local (en CI no existe).
      name: 'backend-caido',
      testMatch: /backend-caido\.spec\.js/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:5174/A2C/',
      },
    },
  ],

  webServer: [
    {
      command: 'npm run dev',
      url: 'http://localhost:5173/A2C/',
      reuseExistingServer: !process.env.CI,
      stdout: 'ignore',
      stderr: 'pipe',
      timeout: 60_000,
    },
    {
      command: 'npm run dev -- --port 5174 --strictPort',
      url: 'http://localhost:5174/A2C/',
      reuseExistingServer: !process.env.CI,
      stdout: 'ignore',
      stderr: 'pipe',
      timeout: 60_000,
      // Vite da prioridad a process.env sobre .env.local, así que esto manda
      // aunque haya credenciales reales en el repo. El host nunca se contacta:
      // el test intercepta las peticiones REST antes de que salgan.
      env: {
        ...process.env,
        VITE_SUPABASE_URL: 'https://backend-de-prueba.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'anon-key-de-prueba',
      },
    },
  ],
})
