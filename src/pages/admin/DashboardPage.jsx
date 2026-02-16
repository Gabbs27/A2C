import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { FiPlus, FiEdit, FiTrash2, FiLogOut, FiSave } from 'react-icons/fi'
import EmptyState from '../../components/EmptyState'
import './DashboardPage.css'

const DashboardPage = () => {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [vehicles, setVehicles] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    disponible: 0,
    vendido: 0,
    reservado: 0
  })

  // Exchange rate state
  const [currentRate, setCurrentRate] = useState(null)
  const [newRate, setNewRate] = useState('')
  const [rateLoading, setRateLoading] = useState(false)
  const [rateMessage, setRateMessage] = useState({ text: '', type: '' })

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)

      // Fetch all vehicles for stats
      const { data: allVehicles, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('id, brand, model, year, price_usd, status, created_at')
        .order('created_at', { ascending: false })
        .limit(10)

      if (vehiclesError) throw vehiclesError

      // Fetch counts for stats
      const { count: totalCount } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact', head: true })

      const { count: disponibleCount } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'disponible')

      const { count: vendidoCount } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'vendido')

      const { count: reservadoCount } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'reservado')

      setStats({
        total: totalCount || 0,
        disponible: disponibleCount || 0,
        vendido: vendidoCount || 0,
        reservado: reservadoCount || 0
      })

      setVehicles(allVehicles || [])

      // Fetch exchange rate
      const { data: rateData } = await supabase
        .from('exchange_rates')
        .select('usd_to_dop, updated_at')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      if (rateData) {
        setCurrentRate(rateData)
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  // Exchange rate update
  const handleUpdateRate = async (e) => {
    e.preventDefault()
    if (!newRate || isNaN(parseFloat(newRate))) return

    setRateLoading(true)
    setRateMessage({ text: '', type: '' })

    try {
      const { error } = await supabase
        .from('exchange_rates')
        .insert({ usd_to_dop: parseFloat(newRate) })

      if (error) throw error

      setCurrentRate({
        usd_to_dop: parseFloat(newRate),
        updated_at: new Date().toISOString()
      })
      setNewRate('')
      setRateMessage({ text: 'Tasa actualizada correctamente', type: 'success' })
    } catch (err) {
      setRateMessage({ text: 'Error al actualizar la tasa', type: 'error' })
      console.error(err)
    } finally {
      setRateLoading(false)
    }
  }

  // Delete vehicle
  const handleDelete = async (vehicle) => {
    const confirmed = window.confirm(
      '¿Estás seguro de eliminar este vehículo? Esta acción no se puede deshacer.'
    )
    if (!confirmed) return

    try {
      // Delete images from storage
      const { data: files } = await supabase.storage
        .from('vehicle-images')
        .list(`${vehicle.id}/`)

      if (files && files.length > 0) {
        const filePaths = files.map((f) => `${vehicle.id}/${f.name}`)
        await supabase.storage.from('vehicle-images').remove(filePaths)
      }

      // Delete vehicle (cascade handles vehicle_images rows)
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', vehicle.id)

      if (error) throw error

      // Refresh data
      await fetchData()
    } catch (err) {
      console.error('Error deleting vehicle:', err)
      alert('Error al eliminar el vehículo.')
    }
  }

  // Status toggle
  const handleStatusToggle = async (vehicleId, newStatus) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({ status: newStatus })
        .eq('id', vehicleId)

      if (error) throw error

      // Refresh data
      await fetchData()
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('es-DO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="spinner" />
          <p>Cargando panel...</p>
        </div>
      </div>
    )
  }

  const navigateToAdd = () => navigate('/admin/vehiculos/nuevo')

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Panel de Administraci&oacute;n</h1>
        <button className="dashboard-logout-btn" onClick={handleSignOut}>
          <FiLogOut />
          Cerrar Sesi&oacute;n
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Veh&iacute;culos</div>
        </div>
        <div className="stat-card disponible">
          <div className="stat-number">{stats.disponible}</div>
          <div className="stat-label">Disponibles</div>
        </div>
        <div className="stat-card vendido">
          <div className="stat-number">{stats.vendido}</div>
          <div className="stat-label">Vendidos</div>
        </div>
        <div className="stat-card reservado">
          <div className="stat-number">{stats.reservado}</div>
          <div className="stat-label">Reservados</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <div className="quick-action-card">
          <h3>Acciones R&aacute;pidas</h3>
          <Link to="/admin/vehiculos/nuevo" className="add-vehicle-btn">
            <FiPlus />
            Agregar Veh&iacute;culo
          </Link>
        </div>

        <div className="quick-action-card">
          <h3>Tasa de Cambio (USD → DOP)</h3>
          <div className="exchange-rate-section">
            <div className="exchange-rate-current">
              Tasa actual:{' '}
              <span>
                {currentRate
                  ? `RD$ ${currentRate.usd_to_dop.toFixed(2)}`
                  : 'No configurada'}
              </span>
              {currentRate && (
                <span style={{ marginLeft: '8px', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                  ({formatDate(currentRate.updated_at)})
                </span>
              )}
            </div>
            <form className="exchange-rate-form" onSubmit={handleUpdateRate}>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Ej: 58.50"
                value={newRate}
                onChange={(e) => setNewRate(e.target.value)}
              />
              <button type="submit" disabled={rateLoading || !newRate}>
                <FiSave />
                {rateLoading ? 'Guardando...' : 'Guardar'}
              </button>
            </form>
            {rateMessage.text && (
              <div className={`exchange-rate-msg ${rateMessage.type}`}>
                {rateMessage.text}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Vehicles */}
      <div className="vehicles-section">
        <div className="vehicles-section-header">
          <h2>Veh&iacute;culos Recientes</h2>
        </div>

        {vehicles.length === 0 ? (
          <EmptyState
            icon={FiPlus}
            title="No hay vehiculos aun"
            message="Comienza agregando tu primer vehiculo al inventario."
            action={{ label: 'Agregar Vehiculo', onClick: navigateToAdd }}
            dark
          />
        ) : (
          <div className="vehicles-table-wrapper">
            <table className="vehicles-table">
              <thead>
                <tr>
                  <th>Veh&iacute;culo</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Estado R&aacute;pido</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td className="vehicle-name">
                      {vehicle.brand} {vehicle.model} {vehicle.year}
                    </td>
                    <td className="vehicle-price">
                      {formatPrice(vehicle.price_usd)}
                    </td>
                    <td>
                      <span className={`status-badge ${vehicle.status}`}>
                        {vehicle.status}
                      </span>
                    </td>
                    <td>
                      <div className="status-toggles">
                        <button
                          className={`status-toggle-btn d ${vehicle.status === 'disponible' ? 'active' : ''}`}
                          onClick={() => handleStatusToggle(vehicle.id, 'disponible')}
                          title="Disponible"
                        >
                          D
                        </button>
                        <button
                          className={`status-toggle-btn v ${vehicle.status === 'vendido' ? 'active' : ''}`}
                          onClick={() => handleStatusToggle(vehicle.id, 'vendido')}
                          title="Vendido"
                        >
                          V
                        </button>
                        <button
                          className={`status-toggle-btn r ${vehicle.status === 'reservado' ? 'active' : ''}`}
                          onClick={() => handleStatusToggle(vehicle.id, 'reservado')}
                          title="Reservado"
                        >
                          R
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn edit"
                          onClick={() => navigate(`/admin/vehiculos/${vehicle.id}`)}
                        >
                          <FiEdit />
                          Editar
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDelete(vehicle)}
                        >
                          <FiTrash2 />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
