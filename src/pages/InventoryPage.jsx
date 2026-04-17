import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { FiSearch, FiFilter, FiX, FiChevronDown } from 'react-icons/fi'
import { supabase } from '../lib/supabase'
import VehicleCard from '../components/VehicleCard'
import LoadingSkeleton from '../components/LoadingSkeleton'
import EmptyState from '../components/EmptyState'
import './InventoryPage.css'

const BODY_TYPES = ['Todos', 'Sedan', 'SUV', 'Pickup', 'Coupe', 'Convertible', 'Van', 'Truck']
const FUEL_TYPES = ['Todos', 'Gasolina', 'Diesel', 'Eléctrico', 'Híbrido']
const TRANSMISSIONS = ['Todos', 'Automática', 'Manual']
const CONDITIONS = ['Todos', 'Nuevo', 'Usado']
const SORT_OPTIONS = [
  { value: 'recent', label: 'Más Reciente' },
  { value: 'price_asc', label: 'Precio: Menor a Mayor' },
  { value: 'price_desc', label: 'Precio: Mayor a Menor' },
  { value: 'year_desc', label: 'Año: Más Nuevo' },
  { value: 'year_asc', label: 'Año: Más Antiguo' }
]
const MAX_COMPARE = 3

const InventoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [vehicles, setVehicles] = useState([])
  const [exchangeRate, setExchangeRate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [compareIds, setCompareIds] = useState([])

  // Read filters from URL params
  const search = searchParams.get('search') || ''
  const brand = searchParams.get('brand') || 'Todos'
  const bodyType = searchParams.get('body_type') || 'Todos'
  const fuelType = searchParams.get('fuel_type') || 'Todos'
  const transmission = searchParams.get('transmission') || 'Todos'
  const condition = searchParams.get('condition') || 'Todos'
  const yearMin = searchParams.get('year_min') || ''
  const yearMax = searchParams.get('year_max') || ''
  const priceMin = searchParams.get('price_min') || ''
  const priceMax = searchParams.get('price_max') || ''
  const sort = searchParams.get('sort') || 'recent'

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [vehiclesRes, rateRes] = await Promise.all([
        supabase
          .from('vehicles')
          .select('*, vehicle_images(*)')
          .order('created_at', { ascending: false }),
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
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Get unique brands from vehicles
  const uniqueBrands = useMemo(() => {
    const brands = [...new Set(vehicles.map(v => v.brand).filter(Boolean))]
    brands.sort()
    return ['Todos', ...brands]
  }, [vehicles])

  // Update a single filter in URL params
  const updateFilter = useCallback((key, value) => {
    const newParams = new URLSearchParams(searchParams)
    if (!value || value === 'Todos' || value === '') {
      newParams.delete(key)
    } else {
      newParams.set(key, value)
    }
    setSearchParams(newParams, { replace: true })
  }, [searchParams, setSearchParams])

  const clearFilters = useCallback(() => {
    setSearchParams({}, { replace: true })
  }, [setSearchParams])

  const hasActiveFilters = useMemo(() => {
    return search || brand !== 'Todos' || bodyType !== 'Todos' ||
      fuelType !== 'Todos' || transmission !== 'Todos' || condition !== 'Todos' ||
      yearMin || yearMax || priceMin || priceMax
  }, [search, brand, bodyType, fuelType, transmission, condition, yearMin, yearMax, priceMin, priceMax])

  // Filter and sort vehicles
  const filteredVehicles = useMemo(() => {
    let result = [...vehicles]

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(v =>
        `${v.brand} ${v.model}`.toLowerCase().includes(searchLower)
      )
    }

    // Brand filter
    if (brand !== 'Todos') {
      result = result.filter(v => v.brand === brand)
    }

    // Body type filter
    if (bodyType !== 'Todos') {
      result = result.filter(v =>
        v.body_type && v.body_type.toLowerCase() === bodyType.toLowerCase()
      )
    }

    // Fuel type filter
    if (fuelType !== 'Todos') {
      result = result.filter(v =>
        v.fuel_type && v.fuel_type.toLowerCase() === fuelType.toLowerCase()
      )
    }

    // Transmission filter
    if (transmission !== 'Todos') {
      result = result.filter(v =>
        v.transmission && v.transmission.toLowerCase() === transmission.toLowerCase()
      )
    }

    // Condition filter
    if (condition !== 'Todos') {
      result = result.filter(v =>
        v.condition && v.condition.toLowerCase() === condition.toLowerCase()
      )
    }

    // Year range
    if (yearMin) {
      result = result.filter(v => v.year >= Number(yearMin))
    }
    if (yearMax) {
      result = result.filter(v => v.year <= Number(yearMax))
    }

    // Price range
    if (priceMin) {
      result = result.filter(v => v.price_usd >= Number(priceMin))
    }
    if (priceMax) {
      result = result.filter(v => v.price_usd <= Number(priceMax))
    }

    // Sort
    switch (sort) {
      case 'price_asc':
        result.sort((a, b) => (a.price_usd || 0) - (b.price_usd || 0))
        break
      case 'price_desc':
        result.sort((a, b) => (b.price_usd || 0) - (a.price_usd || 0))
        break
      case 'year_desc':
        result.sort((a, b) => (b.year || 0) - (a.year || 0))
        break
      case 'year_asc':
        result.sort((a, b) => (a.year || 0) - (b.year || 0))
        break
      case 'recent':
      default:
        // Already sorted by created_at desc from Supabase
        break
    }

    return result
  }, [vehicles, search, brand, bodyType, fuelType, transmission, condition, yearMin, yearMax, priceMin, priceMax, sort])

  // Compare feature
  const handleCompareToggle = useCallback((vehicleId) => {
    setCompareIds(prev => {
      if (prev.includes(vehicleId)) {
        return prev.filter(id => id !== vehicleId)
      }
      if (prev.length >= MAX_COMPARE) return prev
      return [...prev, vehicleId]
    })
  }, [])

  const goToCompare = () => {
    navigate(`/comparar?ids=${compareIds.join(',')}`)
  }

  if (loading) {
    return (
      <div className="inventory-page">
        <div className="container">
          <div className="inventory-header">
            <h1 className="inventory-title">Nuestros Veh&iacute;culos</h1>
            <p className="inventory-subtitle">Cargando inventario...</p>
          </div>
          <div className="inventory-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="inventory-page">
      <div className="container">
        {/* Page Header */}
        <header className="inventory-header">
          <p className="eyebrow">Inventario</p>
          <h1 className="display-xl inventory-title">Nuestros vehículos.</h1>
          <p className="inventory-subtitle tabular" aria-live="polite" aria-atomic="true">
            {String(filteredVehicles.length).padStart(2, '0')} de {String(vehicles.length).padStart(2, '0')} vehículos
          </p>
        </header>

        {/* Search Bar */}
        <div className="inventory-search">
          <div className="inventory-search__input-wrapper">
            <FiSearch className="inventory-search__icon" size={18} />
            <input
              type="text"
              className="inventory-search__input"
              placeholder="Buscar por marca o modelo..."
              value={search}
              onChange={(e) => updateFilter('search', e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="inventory-search__clear"
                onClick={() => updateFilter('search', '')}
                aria-label="Limpiar búsqueda"
              >
                <FiX size={16} aria-hidden="true" />
              </button>
            )}
          </div>
          <button
            type="button"
            className={`inventory-filter-toggle ${filtersOpen ? 'active' : ''}`}
            onClick={() => setFiltersOpen(!filtersOpen)}
            aria-expanded={filtersOpen}
            aria-controls="inventory-filters-panel"
          >
            <FiFilter size={16} />
            Filtros
            <FiChevronDown size={14} className={`inventory-filter-toggle__arrow ${filtersOpen ? 'rotated' : ''}`} />
          </button>
        </div>

        {/* Filters Bar */}
        <div
          id="inventory-filters-panel"
          className={`inventory-filters ${filtersOpen ? 'open' : ''}`}
          aria-hidden={!filtersOpen}
        >
          <div className="inventory-filters__grid">
            <div className="inventory-filter-group">
              <label>Marca</label>
              <select
                value={brand}
                onChange={(e) => updateFilter('brand', e.target.value)}
              >
                {uniqueBrands.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="inventory-filter-group">
              <label>Carrocer&iacute;a</label>
              <select
                value={bodyType}
                onChange={(e) => updateFilter('body_type', e.target.value)}
              >
                {BODY_TYPES.map(bt => (
                  <option key={bt} value={bt}>{bt}</option>
                ))}
              </select>
            </div>

            <div className="inventory-filter-group">
              <label>Combustible</label>
              <select
                value={fuelType}
                onChange={(e) => updateFilter('fuel_type', e.target.value)}
              >
                {FUEL_TYPES.map(ft => (
                  <option key={ft} value={ft}>{ft}</option>
                ))}
              </select>
            </div>

            <div className="inventory-filter-group">
              <label>Transmisi&oacute;n</label>
              <select
                value={transmission}
                onChange={(e) => updateFilter('transmission', e.target.value)}
              >
                {TRANSMISSIONS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="inventory-filter-group">
              <label>Condici&oacute;n</label>
              <select
                value={condition}
                onChange={(e) => updateFilter('condition', e.target.value)}
              >
                {CONDITIONS.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="inventory-filter-group inventory-filter-group--range">
              <label>A&ntilde;o</label>
              <div className="inventory-filter-range">
                <input
                  type="number"
                  placeholder="Min"
                  value={yearMin}
                  onChange={(e) => updateFilter('year_min', e.target.value)}
                  min="1990"
                  max="2030"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={yearMax}
                  onChange={(e) => updateFilter('year_max', e.target.value)}
                  min="1990"
                  max="2030"
                />
              </div>
            </div>

            <div className="inventory-filter-group inventory-filter-group--range">
              <label>Precio (USD)</label>
              <div className="inventory-filter-range">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => updateFilter('price_min', e.target.value)}
                  min="0"
                  step="1000"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => updateFilter('price_max', e.target.value)}
                  min="0"
                  step="1000"
                />
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <button type="button" className="inventory-filters__clear" onClick={clearFilters}>
              <FiX size={14} aria-hidden="true" />
              Limpiar Filtros
            </button>
          )}
        </div>

        {/* Sort Bar */}
        <div className="inventory-sort">
          <label className="inventory-sort__label">Ordenar por:</label>
          <select
            className="inventory-sort__select"
            value={sort}
            onChange={(e) => updateFilter('sort', e.target.value)}
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Vehicle Grid */}
        {filteredVehicles.length > 0 ? (
          <div className="inventory-grid">
            {filteredVehicles.map(vehicle => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                exchangeRate={exchangeRate}
                onCompareToggle={handleCompareToggle}
                isComparing={compareIds.includes(vehicle.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FiSearch}
            title="No se encontraron vehiculos"
            message="No hay vehiculos que coincidan con los filtros seleccionados. Intenta ajustar tus criterios de busqueda."
            action={{ label: 'Limpiar Filtros', onClick: clearFilters }}
          />
        )}

        {/* Compare Floating Bar */}
        {compareIds.length >= 2 && (
          <div className="inventory-compare-bar">
            <div className="inventory-compare-bar__content">
              <span className="inventory-compare-bar__text">
                {compareIds.length} veh&iacute;culos seleccionados
              </span>
              <div className="inventory-compare-bar__actions">
                <button
                  type="button"
                  className="inventory-compare-bar__clear"
                  onClick={() => setCompareIds([])}
                >
                  Limpiar selecci&oacute;n
                </button>
                <button
                  type="button"
                  className="inventory-compare-bar__btn"
                  onClick={goToCompare}
                >
                  Comparar {compareIds.length} veh&iacute;culos
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InventoryPage
