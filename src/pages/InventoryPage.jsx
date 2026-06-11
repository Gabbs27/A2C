import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { FiSearch, FiFilter, FiX, FiChevronDown, FiAlertCircle } from 'react-icons/fi'
import { useQuery } from '@tanstack/react-query'
import { fetchInventory } from '../lib/api'
import VehicleCard from '../components/VehicleCard'
import LoadingSkeleton from '../components/LoadingSkeleton'
import EmptyState from '../components/EmptyState'
import DemoNotice from '../components/DemoNotice'
import SEO from '../components/SEO'
import './InventoryPage.css'

const CONDITIONS = ['Todos', 'Nuevo', 'Usado']
const STATUS_OPTIONS = [
  { value: 'Todos', label: 'Todos' },
  { value: 'disponible', label: 'Disponible' },
  { value: 'reservado', label: 'Reservado' },
  { value: 'vendido', label: 'Vendido' }
]
const SORT_OPTIONS = [
  { value: 'recent', label: 'Más Reciente' },
  { value: 'price_asc', label: 'Precio: Menor a Mayor' },
  { value: 'price_desc', label: 'Precio: Mayor a Menor' },
  { value: 'year_desc', label: 'Año: Más Nuevo' },
  { value: 'year_asc', label: 'Año: Más Antiguo' }
]
const MAX_COMPARE = 3
const COMPARE_STORAGE_KEY = 'a2c-compare'
const SEARCH_DEBOUNCE_MS = 250

// Opciones de filtro derivadas del inventario real para que nunca
// queden desfasadas de lo que los admins guardan en la base de datos
const uniqueOptions = (vehicles, key) => {
  const values = [...new Set(vehicles.map(v => v[key]).filter(Boolean))]
  values.sort((a, b) => a.localeCompare(b, 'es'))
  return ['Todos', ...values]
}

const readStoredCompareIds = () => {
  try {
    const stored = JSON.parse(sessionStorage.getItem(COMPARE_STORAGE_KEY) || '[]')
    return Array.isArray(stored) ? stored.slice(0, MAX_COMPARE) : []
  } catch {
    return []
  }
}

const InventoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [filtersOpen, setFiltersOpen] = useState(false)
  const [compareIds, setCompareIds] = useState(readStoredCompareIds)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['inventory'],
    queryFn: fetchInventory
  })

  const vehicles = useMemo(() => data?.vehicles ?? [], [data])
  const exchangeRate = data?.exchangeRate ?? null

  // Read filters from URL params
  const search = searchParams.get('search') || ''
  const brand = searchParams.get('brand') || 'Todos'
  const bodyType = searchParams.get('body_type') || 'Todos'
  const fuelType = searchParams.get('fuel_type') || 'Todos'
  const transmission = searchParams.get('transmission') || 'Todos'
  const condition = searchParams.get('condition') || 'Todos'
  const status = searchParams.get('status') || 'Todos'
  const yearMin = searchParams.get('year_min') || ''
  const yearMax = searchParams.get('year_max') || ''
  const priceMin = searchParams.get('price_min') || ''
  const priceMax = searchParams.get('price_max') || ''
  const sort = searchParams.get('sort') || 'recent'

  const uniqueBrands = useMemo(() => uniqueOptions(vehicles, 'brand'), [vehicles])
  const bodyTypes = useMemo(() => uniqueOptions(vehicles, 'body_type'), [vehicles])
  const fuelTypes = useMemo(() => uniqueOptions(vehicles, 'fuel_type'), [vehicles])
  const transmissions = useMemo(() => uniqueOptions(vehicles, 'transmission'), [vehicles])

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

  // Input controlado localmente; la URL se actualiza con debounce
  const [searchInput, setSearchInput] = useState(search)

  useEffect(() => {
    setSearchInput(search)
  }, [search])

  useEffect(() => {
    if (searchInput === search) return undefined
    const timer = setTimeout(() => updateFilter('search', searchInput), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [searchInput, search, updateFilter])

  // La selección de comparación sobrevive a la navegación dentro de la sesión
  useEffect(() => {
    sessionStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareIds))
  }, [compareIds])

  // Descarta ids guardados que ya no existen en el inventario
  useEffect(() => {
    if (!data) return
    setCompareIds(prev => {
      const next = prev.filter(id => data.vehicles.some(v => v.id === id))
      return next.length === prev.length ? prev : next
    })
  }, [data])

  const hasActiveFilters = useMemo(() => {
    return search || brand !== 'Todos' || bodyType !== 'Todos' ||
      fuelType !== 'Todos' || transmission !== 'Todos' || condition !== 'Todos' ||
      status !== 'Todos' || yearMin || yearMax || priceMin || priceMax
  }, [search, brand, bodyType, fuelType, transmission, condition, status, yearMin, yearMax, priceMin, priceMax])

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

    // Availability filter
    if (status !== 'Todos') {
      result = result.filter(v => v.status === status)
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

    // Vendidos siempre al final, preservando el orden elegido
    return [
      ...result.filter(v => v.status !== 'vendido'),
      ...result.filter(v => v.status === 'vendido')
    ]
  }, [vehicles, search, brand, bodyType, fuelType, transmission, condition, status, yearMin, yearMax, priceMin, priceMax, sort])

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

  const subtitle = isLoading
    ? 'Cargando inventario…'
    : isError
      ? 'Inventario no disponible'
      : `${String(filteredVehicles.length).padStart(2, '0')} de ${String(vehicles.length).padStart(2, '0')} vehículos`

  const showCompareBar = !isLoading && !isError && compareIds.length >= 2

  return (
    <div className={`inventory-page${showCompareBar ? ' has-compare-bar' : ''}`}>
      <SEO
        title="Inventario"
        description="Explora nuestro inventario de vehículos disponibles en Santo Domingo."
        url="/inventario"
      />
      <div className="container">
        {/* Page Header */}
        <header className="inventory-header">
          <p className="eyebrow">Inventario</p>
          <h1 className="display-xl inventory-title">Nuestros vehículos.</h1>
          <p className="inventory-subtitle tabular" aria-live="polite" aria-atomic="true">
            {subtitle}
          </p>
        </header>

        {data?.demo && <DemoNotice />}

        {isLoading && (
          <div className="inventory-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && isError && (
          <EmptyState
            variant="error"
            icon={FiAlertCircle}
            eyebrow="Error"
            title="No pudimos cargar el inventario"
            message="Ocurrió un problema al obtener los vehículos. Revisa tu conexión e inténtalo de nuevo."
            action={{ label: 'Reintentar', onClick: () => refetch() }}
          />
        )}

        {!isLoading && !isError && (
          <>
            {/* Search Bar */}
            <div className="inventory-search">
              <div className="inventory-search__input-wrapper">
                <FiSearch className="inventory-search__icon" size={18} />
                <input
                  type="text"
                  className="inventory-search__input"
                  placeholder="Buscar por marca o modelo..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                {searchInput && (
                  <button
                    type="button"
                    className="inventory-search__clear"
                    onClick={() => {
                      setSearchInput('')
                      updateFilter('search', '')
                    }}
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
              <div className="inventory-filters__inner">
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
                    <label>Carrocería</label>
                    <select
                      value={bodyType}
                      onChange={(e) => updateFilter('body_type', e.target.value)}
                    >
                      {bodyTypes.map(bt => (
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
                      {fuelTypes.map(ft => (
                        <option key={ft} value={ft}>{ft}</option>
                      ))}
                    </select>
                  </div>

                  <div className="inventory-filter-group">
                    <label>Transmisión</label>
                    <select
                      value={transmission}
                      onChange={(e) => updateFilter('transmission', e.target.value)}
                    >
                      {transmissions.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="inventory-filter-group">
                    <label>Condición</label>
                    <select
                      value={condition}
                      onChange={(e) => updateFilter('condition', e.target.value)}
                    >
                      {CONDITIONS.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="inventory-filter-group">
                    <label>Disponibilidad</label>
                    <select
                      value={status}
                      onChange={(e) => updateFilter('status', e.target.value)}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="inventory-filter-group inventory-filter-group--range">
                    <label>Año</label>
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
                    Limpiar filtros
                  </button>
                )}
              </div>
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
                eyebrow="Sin resultados"
                title="No se encontraron vehículos"
                message="No hay vehículos que coincidan con los filtros seleccionados. Intenta ajustar tus criterios de búsqueda."
                action={hasActiveFilters ? { label: 'Limpiar filtros', onClick: clearFilters } : undefined}
              />
            )}

            {/* Compare Floating Bar */}
            {showCompareBar && (
              <div className="inventory-compare-bar">
                <div className="inventory-compare-bar__content">
                  <span className="inventory-compare-bar__text">
                    {compareIds.length} vehículos seleccionados
                  </span>
                  <div className="inventory-compare-bar__actions">
                    <button
                      type="button"
                      className="inventory-compare-bar__clear"
                      onClick={() => setCompareIds([])}
                    >
                      Limpiar selección
                    </button>
                    <button
                      type="button"
                      className="inventory-compare-bar__btn"
                      onClick={goToCompare}
                    >
                      Comparar {compareIds.length} vehículos
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default InventoryPage
