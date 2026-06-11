import React, { useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FiCheck, FiMinus, FiArrowLeft, FiX } from 'react-icons/fi'
import { fetchVehiclesByIds } from '../lib/api'
import { whatsappLink } from '../lib/siteConfig'
import SEO from '../components/SEO'
import DemoNotice from '../components/DemoNotice'
import './ComparePage.css'

const MAX_COMPARE = 3
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
// Ids válidos: uuid de Supabase o slug del inventario demo
const isValidId = (id) => UUID_RE.test(id) || id.startsWith('demo-')

const seo = (
  <SEO
    title="Comparar vehículos"
    description="Compara lado a lado precio, especificaciones y características de hasta tres vehículos del inventario de A2C International."
    url="/comparar"
    noIndex
  />
)

const ComparePage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const idsParam = searchParams.get('ids') || ''

  const { vehicleIds, hasInvalidIds } = useMemo(() => {
    const raw = idsParam.split(',').map((s) => s.trim()).filter(Boolean)
    const valid = [...new Set(raw)].filter(isValidId).slice(0, MAX_COMPARE)
    return { vehicleIds: valid, hasInvalidIds: raw.length > 0 && valid.length === 0 }
  }, [idsParam])

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['compare', vehicleIds],
    queryFn: () => fetchVehiclesByIds(vehicleIds),
    enabled: vehicleIds.length > 0,
  })

  // Conserva el orden en que el usuario eligió los vehículos
  const vehicles = useMemo(() => {
    const byId = new Map((data?.vehicles || []).map((v) => [v.id, v]))
    return vehicleIds.map((id) => byId.get(id)).filter(Boolean)
  }, [data, vehicleIds])

  const exchangeRate = data?.exchangeRate ?? null

  const removeVehicle = (id) => {
    const remaining = vehicleIds.filter((vid) => vid !== id)
    setSearchParams(remaining.length > 0 ? { ids: remaining.join(',') } : {})
  }

  // Build comparison rows
  const specRows = useMemo(() => {
    if (vehicles.length === 0) return []

    const rows = [
      {
        label: 'Precio USD',
        values: vehicles.map(v =>
          v.price_usd ? `$${Number(v.price_usd).toLocaleString('en-US')}` : '—'
        )
      },
      {
        label: 'Precio DOP',
        values: vehicles.map(v =>
          v.price_usd && exchangeRate
            ? `RD$ ${(Number(v.price_usd) * exchangeRate).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
            : '—'
        )
      },
      {
        label: 'Año',
        values: vehicles.map(v => v.year ? String(v.year) : '—')
      },
      {
        label: 'Kilometraje',
        values: vehicles.map(v =>
          v.mileage ? `${Number(v.mileage).toLocaleString('en-US')} km` : '—'
        )
      },
      {
        label: 'Combustible',
        values: vehicles.map(v => v.fuel_type || '—')
      },
      {
        label: 'Transmisión',
        values: vehicles.map(v => v.transmission || '—')
      },
      {
        label: 'Motor',
        values: vehicles.map(v => v.engine || '—')
      },
      {
        label: 'Carrocería',
        values: vehicles.map(v => v.body_type || '—')
      },
      {
        label: 'Color',
        values: vehicles.map(v => v.color || '—')
      },
      {
        label: 'Puertas',
        values: vehicles.map(v => v.doors ? String(v.doors) : '—')
      },
      {
        label: 'Condición',
        values: vehicles.map(v => v.condition || '—')
      },
      {
        label: 'Estado',
        values: vehicles.map(v => {
          const labels = { disponible: 'Disponible', reservado: 'Reservado', vendido: 'Vendido' }
          return labels[v.status] || v.status || '—'
        })
      }
    ]

    // Mark rows where values differ
    return rows.map(row => ({
      ...row,
      differs: new Set(row.values).size > 1
    }))
  }, [vehicles, exchangeRate])

  // Build features comparison
  const featureComparison = useMemo(() => {
    if (vehicles.length === 0) return []

    // Union of all features
    const allFeatures = new Set()
    vehicles.forEach(v => {
      if (v.features && Array.isArray(v.features)) {
        v.features.forEach(f => allFeatures.add(f))
      }
    })

    return Array.from(allFeatures).sort().map(feature => ({
      name: feature,
      has: vehicles.map(v =>
        v.features && Array.isArray(v.features) && v.features.includes(feature)
      )
    }))
  }, [vehicles])

  const getPrimaryImage = (vehicle) => {
    const primary = vehicle.vehicle_images?.find(img => img.is_primary)
    return primary || vehicle.vehicle_images?.[0] || null
  }

  const getWhatsAppUrl = (v) =>
    whatsappLink(`Hola, me interesa el ${v.brand} ${v.model} ${v.year} que vi en su página web. ¿Está disponible?`)

  if (vehicleIds.length > 0 && isLoading) {
    return (
      <div className="compare-page">
        {seo}
        <div className="container">
          <div className="compare-loading">
            <div className="spinner" />
            <p>Cargando comparación…</p>
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="compare-page">
        {seo}
        <div className="container">
          <div className="compare-error">
            <h2>No pudimos cargar la comparación</h2>
            <p>Revisa tu conexión e inténtalo de nuevo.</p>
            <button type="button" className="compare-error__retry" onClick={() => refetch()}>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (vehicleIds.length === 0 || vehicles.length === 0) {
    const linkBroken = hasInvalidIds || vehicleIds.length > 0
    return (
      <div className="compare-page">
        {seo}
        <div className="container">
          <div className="compare-empty">
            <h2>Comparar vehículos</h2>
            <p>
              {linkBroken
                ? 'Los vehículos de este enlace no existen o ya no están disponibles. Selecciona otros desde el inventario.'
                : 'Selecciona vehículos para comparar desde el inventario.'}
            </p>
            <Link to="/inventario" className="compare-empty__link">
              <FiArrowLeft size={16} aria-hidden="true" />
              Ir al inventario
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="compare-page">
      {seo}
      <div className="container">
        <div className="compare-header">
          <Link to="/inventario" className="compare-back">
            <FiArrowLeft size={16} aria-hidden="true" />
            Volver al inventario
          </Link>
          <h1 className="compare-title">Comparar vehículos</h1>
        </div>

        {data?.demo && <DemoNotice />}
        {vehicles.length < vehicleIds.length && (
          <p className="compare-partial-note" role="note">
            Algunos vehículos del enlace ya no están disponibles.
          </p>
        )}

        <div className="compare-table-wrapper">
          <table className="compare-table">
            {/* Vehicle Headers */}
            <thead>
              <tr>
                <th className="compare-table__label-cell"></th>
                {vehicles.map(v => {
                  const img = getPrimaryImage(v)
                  return (
                    <th key={v.id} className="compare-table__vehicle-header" scope="col">
                      <div className="compare-vehicle-card">
                        <button
                          type="button"
                          className="compare-vehicle-card__remove"
                          onClick={() => removeVehicle(v.id)}
                          aria-label={`Quitar ${v.brand} ${v.model} de la comparación`}
                        >
                          <FiX size={18} aria-hidden="true" />
                        </button>
                        <div className="compare-vehicle-card__image">
                          {img ? (
                            <img src={img.image_url} alt={`${v.brand} ${v.model}`} />
                          ) : (
                            <div className="compare-vehicle-card__placeholder">Sin imagen</div>
                          )}
                        </div>
                        <h3 className="compare-vehicle-card__title">
                          {v.brand} {v.model}
                        </h3>
                        <span className="compare-vehicle-card__year">{v.year}</span>
                        <span className="compare-vehicle-card__price">
                          ${v.price_usd ? Number(v.price_usd).toLocaleString('en-US') : '—'}
                        </span>
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>

            {/* Specs Comparison */}
            <tbody>
              <tr className="compare-table__section-header">
                <td colSpan={vehicles.length + 1}>Especificaciones</td>
              </tr>
              {specRows.map(row => (
                <tr key={row.label} className={row.differs ? 'compare-table__row--differs' : ''}>
                  <td className="compare-table__label">{row.label}</td>
                  {row.values.map((val, idx) => (
                    <td key={idx} className="compare-table__value">{val}</td>
                  ))}
                </tr>
              ))}

              {/* Features Comparison */}
              {featureComparison.length > 0 && (
                <>
                  <tr className="compare-table__section-header">
                    <td colSpan={vehicles.length + 1}>Características</td>
                  </tr>
                  {featureComparison.map(feat => (
                    <tr key={feat.name}>
                      <td className="compare-table__label">{feat.name}</td>
                      {feat.has.map((has, idx) => (
                        <td key={idx} className="compare-table__value compare-table__value--feature">
                          {has ? (
                            <FiCheck size={18} className="compare-feature-check" aria-label="Incluida" />
                          ) : (
                            <FiMinus size={18} className="compare-feature-missing" aria-label="No incluida" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              )}
            </tbody>

            {/* Actions Footer */}
            <tfoot>
              <tr>
                <td className="compare-table__label"></td>
                {vehicles.map(v => (
                  <td key={v.id} className="compare-table__actions">
                    <Link to={`/vehiculo/${v.id}`} className="compare-action-btn compare-action-btn--detail">
                      Ver detalles
                    </Link>
                    <a
                      href={getWhatsAppUrl(v)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="compare-action-btn compare-action-btn--whatsapp"
                    >
                      WhatsApp
                    </a>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ComparePage
