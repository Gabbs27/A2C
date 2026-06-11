import { useState, useEffect, useMemo, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { FiPlus, FiEdit, FiTrash2, FiLogOut, FiSave } from 'react-icons/fi'
import EmptyState from '../../components/EmptyState'
import SEO from '../../components/SEO'
import './DashboardPage.css'

const STATUS_OPTIONS = [
  { value: 'disponible', short: 'D', label: 'Disponible' },
  { value: 'vendido', short: 'V', label: 'Vendido' },
  { value: 'reservado', short: 'R', label: 'Reservado' },
]

const primaryImage = (vehicle) => {
  const images = vehicle.vehicle_images || []
  return (
    images.find((img) => img.is_primary) ||
    [...images].sort(
      (a, b) => (a.display_order || 0) - (b.display_order || 0)
    )[0] ||
    null
  )
}

const DashboardPage = () => {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [vehicles, setVehicles] = useState([])

  // Exchange rate state
  const [currentRate, setCurrentRate] = useState(null)
  const [newRate, setNewRate] = useState('')
  const [rateLoading, setRateLoading] = useState(false)
  const [rateMessage, setRateMessage] = useState({ text: '', type: '' })

  // Row actions state
  const [togglingId, setTogglingId] = useState(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [actionError, setActionError] = useState('')

  const stats = useMemo(
    () => ({
      total: vehicles.length,
      disponible: vehicles.filter((v) => v.status === 'disponible').length,
      vendido: vehicles.filter((v) => v.status === 'vendido').length,
      reservado: vehicles.filter((v) => v.status === 'reservado').length,
    }),
    [vehicles]
  )

  const fetchData = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoadError(
        'El backend no está configurado. Defina las credenciales de Supabase para administrar el inventario.'
      )
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setLoadError('')

      const [vehiclesRes, rateRes] = await Promise.all([
        supabase
          .from('vehicles')
          .select(
            'id, brand, model, year, price_usd, status, created_at, vehicle_images(image_url, is_primary, display_order)'
          )
          .order('created_at', { ascending: false }),
        supabase
          .from('exchange_rates')
          .select('usd_to_dop, updated_at')
          .order('updated_at', { ascending: false })
          .limit(1),
      ])

      if (vehiclesRes.error) throw vehiclesRes.error

      setVehicles(vehiclesRes.data || [])
      setCurrentRate(rateRes.data?.[0] || null)
    } catch (err) {
      console.error('Error cargando datos del panel:', err)
      setLoadError('No se pudieron cargar los datos del panel.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // El mensaje de éxito de la tasa se limpia solo; los errores permanecen
  useEffect(() => {
    if (rateMessage.type !== 'success') return
    const timer = setTimeout(() => setRateMessage({ text: '', type: '' }), 4000)
    return () => clearTimeout(timer)
  }, [rateMessage])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const handleUpdateRate = async (e) => {
    e.preventDefault()
    const parsed = parseFloat(newRate)
    if (isNaN(parsed) || parsed <= 0) {
      setRateMessage({
        text: 'Ingrese una tasa válida mayor que cero.',
        type: 'error',
      })
      return
    }

    setRateLoading(true)
    setRateMessage({ text: '', type: '' })

    try {
      const { error } = await supabase
        .from('exchange_rates')
        .insert({ usd_to_dop: parsed })

      if (error) throw error

      setCurrentRate({
        usd_to_dop: parsed,
        updated_at: new Date().toISOString(),
      })
      setNewRate('')
      setRateMessage({ text: 'Tasa actualizada correctamente.', type: 'success' })
      queryClient.invalidateQueries()
    } catch (err) {
      console.error('Error actualizando la tasa:', err)
      setRateMessage({ text: 'Error al actualizar la tasa.', type: 'error' })
    } finally {
      setRateLoading(false)
    }
  }

  const handleStatusToggle = async (vehicleId, newStatus) => {
    const previous = vehicles
    const current = previous.find((v) => v.id === vehicleId)
    if (!current || current.status === newStatus || togglingId) return

    setActionError('')
    setTogglingId(vehicleId)
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, status: newStatus } : v))
    )

    const { error } = await supabase
      .from('vehicles')
      .update({ status: newStatus })
      .eq('id', vehicleId)

    if (error) {
      console.error('Error actualizando estado:', error)
      setVehicles(previous)
      setActionError(
        `No se pudo actualizar el estado de ${current.brand} ${current.model}. Inténtelo de nuevo.`
      )
    } else {
      queryClient.invalidateQueries()
    }
    setTogglingId(null)
  }

  const handleDelete = async (vehicle) => {
    setActionError('')
    setDeletingId(vehicle.id)

    try {
      const { data: files } = await supabase.storage
        .from('vehicle-images')
        .list(`${vehicle.id}/`)

      if (files && files.length > 0) {
        const filePaths = files.map((f) => `${vehicle.id}/${f.name}`)
        await supabase.storage.from('vehicle-images').remove(filePaths)
      }

      // Borrar el vehículo (el cascade elimina las filas de vehicle_images)
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', vehicle.id)

      if (error) throw error

      setVehicles((prev) => prev.filter((v) => v.id !== vehicle.id))
      queryClient.invalidateQueries()
    } catch (err) {
      console.error('Error eliminando vehículo:', err)
      setActionError(
        `No se pudo eliminar ${vehicle.brand} ${vehicle.model}. Inténtelo de nuevo.`
      )
    } finally {
      setDeletingId(null)
      setConfirmDeleteId(null)
    }
  }

  const formatPrice = (price) => {
    if (price == null) return '—'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('es-DO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const navigateToAdd = () => navigate('/admin/vehiculos/nuevo')

  return (
    <div className="dashboard-page">
      <SEO title="Panel de administración" noIndex />

      <div className="container">
        <header className="dashboard-header">
          <div>
            <span className="eyebrow">A2C International</span>
            <h1 className="dashboard-title">Panel de administración</h1>
          </div>
          <button
            type="button"
            className="dashboard-logout-btn"
            onClick={handleSignOut}
          >
            <FiLogOut aria-hidden="true" />
            Cerrar sesión
          </button>
        </header>

        {loading ? (
          <div className="dashboard-loading" role="status">
            <div className="spinner" />
            <p>Cargando panel...</p>
          </div>
        ) : loadError ? (
          <div className="dashboard-load-error" role="alert">
            <p>{loadError}</p>
            {isSupabaseConfigured && (
              <button
                type="button"
                className="dashboard-retry-btn"
                onClick={fetchData}
              >
                Reintentar
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Stats */}
            <section className="dashboard-stats" aria-label="Resumen del inventario">
              <div className="dashboard-stat">
                <div className="dashboard-stat__label">Total de vehículos</div>
                <div className="dashboard-stat__value tabular">{stats.total}</div>
              </div>
              <div className="dashboard-stat">
                <div className="dashboard-stat__label">Disponibles</div>
                <div className="dashboard-stat__value dashboard-stat__value--success tabular">
                  {stats.disponible}
                </div>
              </div>
              <div className="dashboard-stat">
                <div className="dashboard-stat__label">Reservados</div>
                <div className="dashboard-stat__value dashboard-stat__value--warning tabular">
                  {stats.reservado}
                </div>
              </div>
              <div className="dashboard-stat">
                <div className="dashboard-stat__label">Vendidos</div>
                <div className="dashboard-stat__value dashboard-stat__value--danger tabular">
                  {stats.vendido}
                </div>
              </div>
            </section>

            {/* Tasa de cambio */}
            <section className="dashboard-rate" aria-labelledby="rate-title">
              <h2 id="rate-title" className="dashboard-rate__title">
                Tasa de cambio (USD → DOP)
              </h2>
              <p className="dashboard-rate__current">
                Tasa actual:{' '}
                <strong className="tabular">
                  {currentRate
                    ? `RD$ ${Number(currentRate.usd_to_dop).toFixed(2)}`
                    : 'No configurada'}
                </strong>
                {currentRate?.updated_at && (
                  <span className="dashboard-rate__date">
                    ({formatDate(currentRate.updated_at)})
                  </span>
                )}
              </p>
              <form className="dashboard-rate__form" onSubmit={handleUpdateRate} noValidate>
                <div className="dashboard-rate__field">
                  <label htmlFor="new-rate">Nueva tasa</label>
                  <input
                    id="new-rate"
                    type="number"
                    step="0.01"
                    min="0.01"
                    inputMode="decimal"
                    placeholder="Ej: 58.50"
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="dashboard-rate__btn"
                  disabled={rateLoading || !newRate}
                >
                  <FiSave aria-hidden="true" />
                  {rateLoading ? 'Guardando...' : 'Guardar'}
                </button>
              </form>
              {rateMessage.text && (
                <p
                  className={`dashboard-rate__msg dashboard-rate__msg--${rateMessage.type}`}
                  role={rateMessage.type === 'error' ? 'alert' : 'status'}
                >
                  {rateMessage.text}
                </p>
              )}
            </section>

            {/* Inventario */}
            <section aria-labelledby="vehicles-title">
              <div className="dashboard-toolbar">
                <h2 id="vehicles-title" className="dashboard-toolbar__title">
                  Vehículos{' '}
                  <span className="dashboard-toolbar__count tabular">
                    ({vehicles.length})
                  </span>
                </h2>
                <Link to="/admin/vehiculos/nuevo" className="dashboard-new-btn">
                  <FiPlus aria-hidden="true" />
                  Agregar vehículo
                </Link>
              </div>

              {actionError && (
                <div className="dashboard-alert" role="alert">
                  {actionError}
                </div>
              )}

              {vehicles.length === 0 ? (
                <EmptyState
                  icon={FiPlus}
                  title="No hay vehículos aún"
                  message="Comience agregando su primer vehículo al inventario."
                  action={{ label: 'Agregar vehículo', onClick: navigateToAdd }}
                />
              ) : (
                <div className="dashboard-table-wrapper">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th scope="col">Vehículo</th>
                        <th scope="col">Precio</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Cambiar estado</th>
                        <th scope="col">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles.map((vehicle) => {
                        const image = primaryImage(vehicle)
                        const busy =
                          togglingId === vehicle.id || deletingId === vehicle.id
                        return (
                          <tr key={vehicle.id}>
                            <td className="dashboard-table__vehicle">
                              <div className="dashboard-table__vehicle-cell">
                                {image ? (
                                  <img
                                    className="dashboard-table__thumb"
                                    src={image.image_url}
                                    alt=""
                                    loading="lazy"
                                    width="64"
                                    height="44"
                                  />
                                ) : (
                                  <span
                                    className="dashboard-table__thumb dashboard-table__thumb--empty"
                                    aria-hidden="true"
                                  />
                                )}
                                <span className="dashboard-table__vehicle-info">
                                  <span className="dashboard-table__name">
                                    {vehicle.brand} {vehicle.model}
                                  </span>
                                  <span className="dashboard-table__meta tabular">
                                    {vehicle.year} · {formatDate(vehicle.created_at)}
                                  </span>
                                </span>
                              </div>
                            </td>
                            <td className="dashboard-table__price tabular">
                              {formatPrice(vehicle.price_usd)}
                            </td>
                            <td>
                              <span
                                className={`dashboard-status-badge dashboard-status-badge--${vehicle.status}`}
                              >
                                {vehicle.status}
                              </span>
                            </td>
                            <td>
                              <div
                                className="dashboard-status-toggle"
                                role="group"
                                aria-label={`Cambiar estado de ${vehicle.brand} ${vehicle.model}`}
                              >
                                {STATUS_OPTIONS.map((option) => (
                                  <button
                                    key={option.value}
                                    type="button"
                                    className={`dashboard-status-toggle__btn dashboard-status-toggle__btn--${option.value} ${
                                      vehicle.status === option.value
                                        ? 'is-active'
                                        : ''
                                    }`}
                                    onClick={() =>
                                      handleStatusToggle(vehicle.id, option.value)
                                    }
                                    disabled={busy}
                                    title={option.label}
                                    aria-pressed={vehicle.status === option.value}
                                    aria-label={`Marcar como ${option.label.toLowerCase()}`}
                                  >
                                    {option.short}
                                  </button>
                                ))}
                              </div>
                            </td>
                            <td>
                              <div className="dashboard-table__actions">
                                {confirmDeleteId === vehicle.id ? (
                                  <>
                                    <span className="dashboard-confirm-label">
                                      ¿Eliminar?
                                    </span>
                                    <button
                                      type="button"
                                      className="dashboard-action-btn dashboard-action-btn--danger"
                                      onClick={() => handleDelete(vehicle)}
                                      disabled={deletingId === vehicle.id}
                                    >
                                      {deletingId === vehicle.id
                                        ? 'Eliminando...'
                                        : 'Sí'}
                                    </button>
                                    <button
                                      type="button"
                                      className="dashboard-action-btn"
                                      onClick={() => setConfirmDeleteId(null)}
                                      disabled={deletingId === vehicle.id}
                                    >
                                      No
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      type="button"
                                      className="dashboard-action-btn dashboard-action-btn--edit"
                                      onClick={() =>
                                        navigate(`/admin/vehiculos/${vehicle.id}`)
                                      }
                                      disabled={busy}
                                    >
                                      <FiEdit aria-hidden="true" />
                                      Editar
                                    </button>
                                    <button
                                      type="button"
                                      className="dashboard-action-btn dashboard-action-btn--delete"
                                      onClick={() => {
                                        setActionError('')
                                        setConfirmDeleteId(vehicle.id)
                                      }}
                                      disabled={busy}
                                    >
                                      <FiTrash2 aria-hidden="true" />
                                      Eliminar
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
