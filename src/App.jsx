import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import SEO from './components/SEO'
import { autoDealerSchema } from './lib/schema'
import './App.css'

const HomePage = lazy(() => import('./pages/HomePage'))
const InventoryPage = lazy(() => import('./pages/InventoryPage'))
const VehicleDetailPage = lazy(() => import('./pages/VehicleDetailPage'))
const ComparePage = lazy(() => import('./pages/ComparePage'))
const LoginPage = lazy(() => import('./pages/admin/LoginPage'))
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'))
const VehicleFormPage = lazy(() => import('./pages/admin/VehicleFormPage'))

const Fallback = () => (
  <div
    style={{
      minHeight: '60vh',
      display: 'grid',
      placeItems: 'center',
      background: 'var(--ink-950)',
    }}
  >
    <div className="spinner" />
  </div>
)

function App() {
  return (
    <>
      <SEO jsonLd={autoDealerSchema()} />
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="inventario" element={<InventoryPage />} />
            <Route path="vehiculo/:id" element={<VehicleDetailPage />} />
            <Route path="comparar" element={<ComparePage />} />
            <Route path="admin/login" element={<LoginPage />} />
            <Route
              path="admin"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/vehiculos/nuevo"
              element={
                <ProtectedRoute>
                  <VehicleFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/vehiculos/:id"
              element={
                <ProtectedRoute>
                  <VehicleFormPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

export default App
