import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import InventoryPage from './pages/InventoryPage'
import VehicleDetailPage from './pages/VehicleDetailPage'
import ComparePage from './pages/ComparePage'
import LoginPage from './pages/admin/LoginPage'
import DashboardPage from './pages/admin/DashboardPage'
import VehicleFormPage from './pages/admin/VehicleFormPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="inventario" element={<InventoryPage />} />
        <Route path="vehiculo/:id" element={<VehicleDetailPage />} />
        <Route path="comparar" element={<ComparePage />} />
        <Route path="admin/login" element={<LoginPage />} />
        <Route path="admin" element={<DashboardPage />} />
        <Route path="admin/vehiculos/nuevo" element={<VehicleFormPage />} />
        <Route path="admin/vehiculos/:id" element={<VehicleFormPage />} />
      </Route>
    </Routes>
  )
}

export default App
