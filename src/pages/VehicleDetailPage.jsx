import React, { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  FiCheck, FiFileText, FiClipboard, FiShare2,
  FiPhone, FiChevronLeft, FiChevronRight, FiX,
  FiMapPin, FiCalendar, FiTag
} from 'react-icons/fi'
import { supabase } from '../lib/supabase'
import VehicleCard from '../components/VehicleCard'
import './VehicleDetailPage.css'

const WHATSAPP_NUMBER = '18294470259'
const PHONE_NUMBER = '+18294470259'

const statusLabels = {
  disponible: 'Disponible',
  reservado: 'Reservado',
  vendido: 'Vendido'
}

const VehicleDetailPage = () => {
  const { id } = useParams()

  const [vehicle, setVehicle] = useState(null)
  const [images, setImages] = useState([])
  const [exchangeRate, setExchangeRate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [relatedVehicles, setRelatedVehicles] = useState([])

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  // Financing calculator state
  const [calcPrice, setCalcPrice] = useState(0)
  const [downPayment, setDownPayment] = useState(0)
  const [interestRate, setInterestRate] = useState(12)
  const [termMonths, setTermMonths] = useState(48)

  useEffect(() => {
    fetchVehicle()
    window.scrollTo(0, 0)
  }, [id])

  const fetchVehicle = async () => {
    setLoading(true)
    setNotFound(false)

    try {
      const [vehicleRes, rateRes] = await Promise.all([
        supabase
          .from('vehicles')
          .select('*, vehicle_images(*)')
          .eq('id', id)
          .single(),
        supabase
          .from('exchange_rates')
          .select('usd_to_dop')
          .order('updated_at', { ascending: false })
          .limit(1)
      ])

      if (vehicleRes.error || !vehicleRes.data) {
        setNotFound(true)
        setLoading(false)
        return
      }

      const vehicleData = vehicleRes.data
      setVehicle(vehicleData)

      // Sort images by display_order
      const sortedImages = (vehicleData.vehicle_images || []).sort(
        (a, b) => (a.display_order || 0) - (b.display_order || 0)
      )
      setImages(sortedImages)

      if (rateRes.data && rateRes.data.length > 0) {
        setExchangeRate(rateRes.data[0].usd_to_dop)
      }

      // Set calculator defaults
      const price = vehicleData.price_usd || 0
      setCalcPrice(price)
      setDownPayment(Math.round(price * 0.2))

      // Fetch related vehicles
      fetchRelated(vehicleData)
    } catch (err) {
      console.error('Error fetching vehicle:', err)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelated = async (v) => {
    try {
      const { data } = await supabase
        .from('vehicles')
        .select('*, vehicle_images(*)')
        .neq('id', v.id)
        .or(`brand.eq.${v.brand},body_type.eq.${v.body_type}`)
        .limit(4)

      if (data) setRelatedVehicles(data)
    } catch (err) {
      console.error('Error fetching related:', err)
    }
  }

  // Price formatting
  const priceUSD = vehicle?.price_usd
    ? Number(vehicle.price_usd).toLocaleString('en-US')
    : null

  const priceDOP = vehicle?.price_usd && exchangeRate
    ? (Number(vehicle.price_usd) * exchangeRate).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })
    : null

  // Financing calculator
  const monthlyPayment = useMemo(() => {
    const loanAmount = calcPrice - downPayment
    if (loanAmount <= 0 || interestRate <= 0 || termMonths <= 0) return null

    const monthlyRate = interestRate / 100 / 12
    const n = termMonths
    const numerator = monthlyRate * Math.pow(1 + monthlyRate, n)
    const denominator = Math.pow(1 + monthlyRate, n) - 1
    const M = loanAmount * (numerator / denominator)

    return {
      monthly: M,
      total: M * n,
      interest: (M * n) - loanAmount
    }
  }, [calcPrice, downPayment, interestRate, termMonths])

  // Gallery navigation
  const nextImage = () => {
    setActiveImageIndex(prev => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setActiveImageIndex(prev => (prev - 1 + images.length) % images.length)
  }

  // Share
  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
          text: `Mira este ${vehicle.brand} ${vehicle.model} ${vehicle.year} en A2C International`,
          url
        })
      } catch (err) {
        // User cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(url)
        alert('Enlace copiado al portapapeles')
      } catch (err) {
        // Fallback
      }
    }
  }

  // WhatsApp link
  const whatsappUrl = vehicle
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `Hola, me interesa el ${vehicle.brand} ${vehicle.model} ${vehicle.year} que vi en su página web. ¿Está disponible?`
      )}`
    : '#'

  // Keyboard nav for lightbox
  useEffect(() => {
    if (!lightboxOpen) return
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') nextImage()
      else if (e.key === 'ArrowLeft') prevImage()
      else if (e.key === 'Escape') setLightboxOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightboxOpen, images.length])

  // Specs data
  const specs = vehicle ? [
    { label: 'Marca', value: vehicle.brand },
    { label: 'Modelo', value: vehicle.model },
    { label: 'Año', value: vehicle.year },
    { label: 'Kilometraje', value: vehicle.mileage ? `${Number(vehicle.mileage).toLocaleString('en-US')} km` : null },
    { label: 'Combustible', value: vehicle.fuel_type },
    { label: 'Transmisión', value: vehicle.transmission },
    { label: 'Motor', value: vehicle.engine },
    { label: 'Carrocería', value: vehicle.body_type },
    { label: 'Color Exterior', value: vehicle.color },
    { label: 'Color Interior', value: vehicle.interior_color },
    { label: 'Puertas', value: vehicle.doors },
    { label: 'Condición', value: vehicle.condition },
    { label: 'VIN', value: vehicle.vin }
  ].filter(s => s.value) : []

  if (loading) {
    return (
      <div className="detail-page">
        <div className="container">
          <div className="detail-loading">
            <div className="spinner" />
            <p>Cargando...</p>
          </div>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="detail-page">
        <div className="container">
          <div className="detail-not-found">
            <h2>Veh&iacute;culo no encontrado</h2>
            <p>El veh&iacute;culo que buscas no existe o ha sido removido.</p>
            <Link to="/inventario" className="detail-not-found__link">
              Volver al inventario
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="detail-breadcrumb">
          <Link to="/inventario">Inventario</Link>
          <span>/</span>
          <span>{vehicle.brand} {vehicle.model} {vehicle.year}</span>
        </div>

        {/* Top section: Gallery + Info */}
        <div className="detail-top">
          {/* Gallery */}
          <div className="detail-gallery">
            <div
              className="detail-gallery__main"
              onClick={() => images.length > 0 && setLightboxOpen(true)}
            >
              {images.length > 0 ? (
                <img
                  src={images[activeImageIndex]?.image_url}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="detail-gallery__main-img"
                />
              ) : (
                <div className="detail-gallery__placeholder">
                  <span>Sin im&aacute;genes disponibles</span>
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    className="detail-gallery__nav detail-gallery__nav--prev"
                    onClick={(e) => { e.stopPropagation(); prevImage() }}
                    aria-label="Imagen anterior"
                  >
                    <FiChevronLeft size={24} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="detail-gallery__nav detail-gallery__nav--next"
                    onClick={(e) => { e.stopPropagation(); nextImage() }}
                    aria-label="Siguiente imagen"
                  >
                    <FiChevronRight size={24} aria-hidden="true" />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="detail-gallery__thumbs">
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    type="button"
                    className={`detail-gallery__thumb ${idx === activeImageIndex ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`Ver imagen ${idx + 1} de ${images.length}`}
                    aria-current={idx === activeImageIndex}
                  >
                    <img
                      src={img.image_url}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Vehicle Header Info */}
          <div className="detail-info">
            <h1 className="detail-info__title">
              {vehicle.brand} {vehicle.model}
            </h1>

            <div className="detail-info__tags">
              <span className="detail-info__tag">
                <FiCalendar size={14} />
                {vehicle.year}
              </span>
              {vehicle.condition && (
                <span className="detail-info__tag">{vehicle.condition}</span>
              )}
              {vehicle.status && (
                <span className={`detail-info__status detail-info__status--${vehicle.status}`}>
                  {statusLabels[vehicle.status] || vehicle.status}
                </span>
              )}
            </div>

            <div className="detail-info__pricing">
              {priceUSD && (
                <span className="detail-info__price-usd">${priceUSD}</span>
              )}
              {priceDOP && (
                <span className="detail-info__price-dop">&asymp; RD$ {priceDOP}</span>
              )}
            </div>

            <div className="detail-info__meta">
              {vehicle.body_type && (
                <span className="detail-info__meta-item">
                  <FiTag size={14} />
                  {vehicle.body_type}
                </span>
              )}
              {vehicle.color && (
                <span className="detail-info__meta-item">
                  Color: {vehicle.color}
                </span>
              )}
              {vehicle.location && (
                <span className="detail-info__meta-item">
                  <FiMapPin size={14} />
                  {vehicle.location}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="detail-actions">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-actions__btn detail-actions__btn--whatsapp"
              >
                Preguntar por WhatsApp
              </a>
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="detail-actions__btn detail-actions__btn--call"
              >
                <FiPhone size={16} />
                Llamar
              </a>
              <button
                type="button"
                onClick={handleShare}
                className="detail-actions__btn detail-actions__btn--share"
              >
                <FiShare2 size={16} aria-hidden="true" />
                Compartir
              </button>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {specs.length > 0 && (
          <section className="detail-section">
            <h2 className="detail-section__title">Especificaciones</h2>
            <div className="detail-specs">
              {specs.map(spec => (
                <div key={spec.label} className="detail-specs__item">
                  <span className="detail-specs__label">{spec.label}</span>
                  <span className="detail-specs__value">{spec.value}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Features */}
        {vehicle.features && vehicle.features.length > 0 && (
          <section className="detail-section">
            <h2 className="detail-section__title">Caracter&iacute;sticas</h2>
            <div className="detail-features">
              {vehicle.features.map((feature, idx) => (
                <div key={idx} className="detail-features__item">
                  <FiCheck size={16} className="detail-features__icon" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Description */}
        {vehicle.description && (
          <section className="detail-section">
            <h2 className="detail-section__title">Descripci&oacute;n</h2>
            <p className="detail-section__text">{vehicle.description}</p>
          </section>
        )}

        {/* Vehicle History */}
        {vehicle.vehicle_history && (
          <section className="detail-section">
            <h2 className="detail-section__title">
              <FiFileText size={20} />
              Historial del Veh&iacute;culo
            </h2>
            <p className="detail-section__text">{vehicle.vehicle_history}</p>
          </section>
        )}

        {/* Inspection Notes */}
        {vehicle.inspection_notes && (
          <section className="detail-section">
            <h2 className="detail-section__title">
              <FiClipboard size={20} />
              Notas de Inspecci&oacute;n
            </h2>
            <p className="detail-section__text">{vehicle.inspection_notes}</p>
          </section>
        )}

        {/* Financing Calculator */}
        <section className="detail-section">
          <h2 className="detail-section__title">Calculadora de Financiamiento</h2>
          <div className="detail-calculator">
            <div className="detail-calculator__inputs">
              <div className="detail-calculator__field">
                <label>Precio del veh&iacute;culo (USD)</label>
                <input
                  type="number"
                  value={calcPrice}
                  onChange={(e) => setCalcPrice(Number(e.target.value))}
                  min="0"
                  step="100"
                />
              </div>
              <div className="detail-calculator__field">
                <label>Inicial (USD)</label>
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  min="0"
                  step="100"
                />
              </div>
              <div className="detail-calculator__field">
                <label>Tasa de inter&eacute;s anual (%)</label>
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  min="0"
                  max="100"
                  step="0.5"
                />
              </div>
              <div className="detail-calculator__field">
                <label>Plazo en meses</label>
                <select
                  value={termMonths}
                  onChange={(e) => setTermMonths(Number(e.target.value))}
                >
                  <option value={12}>12 meses</option>
                  <option value={24}>24 meses</option>
                  <option value={36}>36 meses</option>
                  <option value={48}>48 meses</option>
                  <option value={60}>60 meses</option>
                  <option value={72}>72 meses</option>
                </select>
              </div>
            </div>

            {monthlyPayment && (
              <div className="detail-calculator__results">
                <div className="detail-calculator__result detail-calculator__result--highlight">
                  <span className="detail-calculator__result-label">Cuota Mensual</span>
                  <span className="detail-calculator__result-value">
                    ${monthlyPayment.monthly.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="detail-calculator__result">
                  <span className="detail-calculator__result-label">Total a Pagar</span>
                  <span className="detail-calculator__result-value">
                    ${monthlyPayment.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="detail-calculator__result">
                  <span className="detail-calculator__result-label">Total Intereses</span>
                  <span className="detail-calculator__result-value">
                    ${monthlyPayment.interest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Related Vehicles */}
        {relatedVehicles.length > 0 && (
          <section className="detail-section">
            <h2 className="detail-section__title">Veh&iacute;culos Similares</h2>
            <div className="detail-related-grid">
              {relatedVehicles.map(v => (
                <VehicleCard
                  key={v.id}
                  vehicle={v}
                  exchangeRate={exchangeRate}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && images.length > 0 && (
        <div
          className="detail-lightbox"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Galería de ${vehicle.brand} ${vehicle.model}`}
        >
          <button
            type="button"
            className="detail-lightbox__close"
            onClick={() => setLightboxOpen(false)}
            aria-label="Cerrar galería"
          >
            <FiX size={28} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="detail-lightbox__nav detail-lightbox__nav--prev"
            onClick={(e) => { e.stopPropagation(); prevImage() }}
            aria-label="Imagen anterior"
          >
            <FiChevronLeft size={32} aria-hidden="true" />
          </button>
          <div className="detail-lightbox__content" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[activeImageIndex]?.image_url}
              alt={`${vehicle.brand} ${vehicle.model} — imagen ${activeImageIndex + 1} de ${images.length}`}
              className="detail-lightbox__img"
            />
            <div className="detail-lightbox__counter tabular" aria-live="polite">
              {activeImageIndex + 1} / {images.length}
            </div>
          </div>
          <button
            type="button"
            className="detail-lightbox__nav detail-lightbox__nav--next"
            onClick={(e) => { e.stopPropagation(); nextImage() }}
            aria-label="Siguiente imagen"
          >
            <FiChevronRight size={32} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  )
}

export default VehicleDetailPage
