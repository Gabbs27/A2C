import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { FiCheck, FiMinus, FiArrowLeft } from 'react-icons/fi'
import { supabase } from '../lib/supabase'
import './ComparePage.css'

const WHATSAPP_NUMBER = '18294470259'

const ComparePage = () => {
  const [searchParams] = useSearchParams()
  const [vehicles, setVehicles] = useState([])
  const [exchangeRate, setExchangeRate] = useState(null)
  const [loading, setLoading] = useState(true)

  const ids = searchParams.get('ids')
  const vehicleIds = ids ? ids.split(',').filter(Boolean) : []

  useEffect(() => {
    if (vehicleIds.length > 0) {
      fetchVehicles()
    } else {
      setLoading(false)
    }
  }, [ids])

  const fetchVehicles = async () => {
    setLoading(true)
    try {
      const [vehiclesRes, rateRes] = await Promise.all([
        supabase
          .from('vehicles')
          .select('*, vehicle_images(*)')
          .in('id', vehicleIds),
        supabase
          .from('exchange_rates')
          .select('usd_to_dop')
          .order('updated_at', { ascending: false })
          .limit(1)
      ])

      if (vehiclesRes.data) setVehicles(vehiclesRes.data)
      if (rateRes.data && rateRes.data.length > 0) {
        setExchangeRate(rateRes.data[0].usd_to_dop)
      }
    } catch (err) {
      console.error('Error fetching vehicles:', err)
    } finally {
      setLoading(false)
    }
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

  const getWhatsAppUrl = (v) => {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      `Hola, me interesa el ${v.brand} ${v.model} ${v.year} que vi en su página web. ¿Está disponible?`
    )}`
  }

  if (loading) {
    return (
      <div className="compare-page">
        <div className="container">
          <div className="compare-loading">
            <div className="compare-loading__spinner" />
            <p>Cargando comparaci&oacute;n...</p>
          </div>
        </div>
      </div>
    )
  }

  if (vehicleIds.length === 0 || vehicles.length === 0) {
    return (
      <div className="compare-page">
        <div className="container">
          <div className="compare-empty">
            <h2>Comparar Veh&iacute;culos</h2>
            <p>Selecciona veh&iacute;culos para comparar desde el inventario.</p>
            <Link to="/inventario" className="compare-empty__link">
              <FiArrowLeft size={16} />
              Ir al Inventario
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="compare-page">
      <div className="container">
        <div className="compare-header">
          <Link to="/inventario" className="compare-back">
            <FiArrowLeft size={16} />
            Volver al Inventario
          </Link>
          <h1 className="compare-title">Comparar Veh&iacute;culos</h1>
        </div>

        <div className="compare-table-wrapper">
          <table className="compare-table">
            {/* Vehicle Headers */}
            <thead>
              <tr>
                <th className="compare-table__label-cell"></th>
                {vehicles.map(v => {
                  const img = getPrimaryImage(v)
                  return (
                    <th key={v.id} className="compare-table__vehicle-header">
                      <div className="compare-vehicle-card">
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
                    <td colSpan={vehicles.length + 1}>Caracter&iacute;sticas</td>
                  </tr>
                  {featureComparison.map(feat => (
                    <tr key={feat.name}>
                      <td className="compare-table__label">{feat.name}</td>
                      {feat.has.map((has, idx) => (
                        <td key={idx} className="compare-table__value compare-table__value--feature">
                          {has ? (
                            <FiCheck size={18} className="compare-feature-check" />
                          ) : (
                            <FiMinus size={18} className="compare-feature-missing" />
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
                      Ver Detalles
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
