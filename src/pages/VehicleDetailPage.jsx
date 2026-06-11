import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  FiCheck, FiFileText, FiClipboard, FiShare2,
  FiPhone, FiChevronLeft, FiChevronRight, FiX,
  FiMapPin, FiCalendar, FiTag, FiArrowLeft, FiArrowRight
} from 'react-icons/fi'
import { fetchVehicleDetail, fetchRelated } from '../lib/api'
import { PHONE_E164, whatsappLink } from '../lib/siteConfig'
import { vehicleSchema } from '../lib/schema'
import SEO from '../components/SEO'
import DemoNotice from '../components/DemoNotice'
import VehicleCard from '../components/VehicleCard'
import './VehicleDetailPage.css'

const statusLabels = {
  disponible: 'Disponible',
  reservado: 'Reservado',
  vendido: 'Vendido'
}

const VehicleDetailPage = () => {
  const { id } = useParams()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => fetchVehicleDetail(id)
  })

  const vehicle = data?.vehicle || null
  const exchangeRate = data?.exchangeRate || null
  const demo = data?.demo || false
  const notFound = isError || data?.notFound || (!isLoading && !vehicle)

  const { data: relatedData } = useQuery({
    queryKey: ['related', vehicle?.id],
    queryFn: () => fetchRelated(vehicle, 4),
    enabled: Boolean(vehicle)
  })
  const relatedVehicles = relatedData?.vehicles || []

  const images = useMemo(
    () =>
      [...(vehicle?.vehicle_images || [])].sort(
        (a, b) => (a.display_order || 0) - (b.display_order || 0)
      ),
    [vehicle]
  )

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const lightboxRef = useRef(null)
  const lightboxCloseRef = useRef(null)
  const lastFocusedRef = useRef(null)
  const swipeStartX = useRef(null)
  const swipedRef = useRef(false)

  // Share feedback state
  const [shareFeedback, setShareFeedback] = useState(null)
  const shareTimerRef = useRef(null)

  // Financing calculator state
  const [calcPrice, setCalcPrice] = useState(0)
  const [downPayment, setDownPayment] = useState(0)
  const [interestRate, setInterestRate] = useState(12)
  const [termMonths, setTermMonths] = useState(48)

  useEffect(() => {
    setActiveImageIndex(0)
    setLightboxOpen(false)
  }, [id])

  useEffect(() => {
    if (!vehicle) return
    const price = Number(vehicle.price_usd) || 0
    setCalcPrice(price)
    setDownPayment(Math.round(price * 0.2))
  }, [vehicle])

  useEffect(() => () => clearTimeout(shareTimerRef.current), [])

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
    if (loanAmount <= 0 || termMonths <= 0) return null

    const n = termMonths
    let M
    if (interestRate <= 0) {
      // 0% de interés: la fórmula estándar dividiría entre cero
      M = loanAmount / n
    } else {
      const monthlyRate = interestRate / 100 / 12
      const numerator = monthlyRate * Math.pow(1 + monthlyRate, n)
      const denominator = Math.pow(1 + monthlyRate, n) - 1
      M = loanAmount * (numerator / denominator)
    }

    return {
      monthly: M,
      total: M * n,
      interest: (M * n) - loanAmount
    }
  }, [calcPrice, downPayment, interestRate, termMonths])

  const downCoversPrice = calcPrice > 0 && downPayment >= calcPrice

  const formatUSD = (value) =>
    value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const formatDOP = (value) =>
    (value * exchangeRate).toLocaleString('en-US', { maximumFractionDigits: 0 })

  // Gallery navigation
  const nextImage = () => {
    setActiveImageIndex(prev => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setActiveImageIndex(prev => (prev - 1 + images.length) % images.length)
  }

  const handleGalleryKey = (e) => {
    if (images.length < 2) return
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      nextImage()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      prevImage()
    }
  }

  // Swipe táctil: un deslizamiento horizontal cambia de imagen y no abre el lightbox
  const handleGalleryPointerDown = (e) => {
    swipeStartX.current = e.clientX
    swipedRef.current = false
  }

  const handleGalleryPointerUp = (e) => {
    if (swipeStartX.current == null) return
    const deltaX = e.clientX - swipeStartX.current
    swipeStartX.current = null
    if (Math.abs(deltaX) > 40 && images.length > 1) {
      swipedRef.current = true
      if (deltaX < 0) nextImage()
      else prevImage()
    }
  }

  const handleGalleryClick = () => {
    if (swipedRef.current) {
      swipedRef.current = false
      return
    }
    setLightboxOpen(true)
  }

  // Share
  const showShareFeedback = (state) => {
    setShareFeedback(state)
    clearTimeout(shareTimerRef.current)
    shareTimerRef.current = setTimeout(() => setShareFeedback(null), 2000)
  }

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
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      showShareFeedback('copied')
    } catch (err) {
      showShareFeedback('error')
    }
  }

  // WhatsApp links
  const whatsappUrl = vehicle
    ? whatsappLink(
        `Hola, me interesa el ${vehicle.brand} ${vehicle.model} ${vehicle.year} que vi en su página web. ¿Está disponible?`
      )
    : whatsappLink()

  const askPriceUrl = vehicle
    ? whatsappLink(
        `Hola, quisiera consultar el precio del ${vehicle.brand} ${vehicle.model} ${vehicle.year} que vi en su página web.`
      )
    : whatsappLink()

  // Scroll-lock + foco al abrir el lightbox; restaura ambos al cerrar
  useEffect(() => {
    if (!lightboxOpen) return
    lastFocusedRef.current = document.activeElement
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    lightboxCloseRef.current?.focus()
    return () => {
      document.body.style.overflow = prevOverflow
      if (lastFocusedRef.current instanceof HTMLElement) {
        lastFocusedRef.current.focus()
      }
    }
  }, [lightboxOpen])

  // Keyboard nav for lightbox
  useEffect(() => {
    if (!lightboxOpen) return
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') nextImage()
      else if (e.key === 'ArrowLeft') prevImage()
      else if (e.key === 'Escape') setLightboxOpen(false)
      else if (e.key === 'Tab') {
        // Focus trap simple: Tab cicla entre los controles del diálogo
        const focusables = lightboxRef.current?.querySelectorAll('button')
        if (!focusables?.length) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        } else if (!lightboxRef.current.contains(document.activeElement)) {
          e.preventDefault()
          first.focus()
        }
      }
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

  const seoDescription = vehicle
    ? [
        `${vehicle.brand} ${vehicle.model} ${vehicle.year} en A2C International, Santo Domingo.`,
        vehicle.mileage ? `${Number(vehicle.mileage).toLocaleString('en-US')} km.` : null,
        vehicle.transmission ? `Transmisión ${vehicle.transmission}.` : null,
        vehicle.fuel_type ? `Combustible ${vehicle.fuel_type}.` : null,
        priceUSD ? `Precio: US$ ${priceUSD}.` : 'Precio a consultar.'
      ].filter(Boolean).join(' ')
    : null

  if (isLoading) {
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
        <SEO title="Vehículo no encontrado" noIndex />
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
      <SEO
        title={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
        description={seoDescription}
        url={`/vehiculo/${id}`}
        image={images[0]?.image_url}
        type="product"
        jsonLd={vehicleSchema(vehicle)}
      />
      <div className="container">
        {/* Breadcrumb */}
        <nav className="detail-breadcrumb" aria-label="Ruta de navegación">
          <Link to="/inventario" className="detail-breadcrumb__back">
            <FiArrowLeft size={14} aria-hidden="true" />
            Volver al inventario
          </Link>
          <span aria-hidden="true">/</span>
          <span>{vehicle.brand} {vehicle.model} {vehicle.year}</span>
        </nav>

        {demo && <DemoNotice />}

        {/* Top section: Gallery + Info */}
        <div className="detail-top">
          {/* Gallery */}
          <div className="detail-gallery">
            <div className="detail-gallery__main">
              {images.length > 0 ? (
                <button
                  type="button"
                  className="detail-gallery__zoom"
                  onClick={handleGalleryClick}
                  onKeyDown={handleGalleryKey}
                  onPointerDown={handleGalleryPointerDown}
                  onPointerUp={handleGalleryPointerUp}
                  aria-label={
                    images.length > 1
                      ? `Ampliar imagen ${activeImageIndex + 1} de ${images.length}. Usa las flechas para cambiar de imagen`
                      : 'Ampliar imagen'
                  }
                >
                  <img
                    src={images[activeImageIndex]?.image_url}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="detail-gallery__main-img"
                  />
                </button>
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
                    onClick={prevImage}
                    aria-label="Imagen anterior"
                  >
                    <FiChevronLeft size={24} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="detail-gallery__nav detail-gallery__nav--next"
                    onClick={nextImage}
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
              {priceUSD ? (
                <>
                  <span className="detail-info__price-usd">${priceUSD}</span>
                  {priceDOP && (
                    <span className="detail-info__price-dop">&asymp; RD$ {priceDOP}</span>
                  )}
                </>
              ) : (
                <a
                  href={askPriceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="detail-info__price-ask"
                >
                  Consultar precio
                  <FiArrowRight size={18} aria-hidden="true" />
                </a>
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
                href={`tel:${PHONE_E164}`}
                className="detail-actions__btn detail-actions__btn--call"
              >
                <FiPhone size={16} />
                Llamar
              </a>
              <button
                type="button"
                onClick={handleShare}
                className={`detail-actions__btn detail-actions__btn--share${shareFeedback === 'copied' ? ' is-copied' : ''}`}
                aria-live="polite"
              >
                {shareFeedback === 'copied' ? (
                  <>
                    <FiCheck size={16} aria-hidden="true" />
                    Enlace copiado
                  </>
                ) : shareFeedback === 'error' ? (
                  'No se pudo copiar'
                ) : (
                  <>
                    <FiShare2 size={16} aria-hidden="true" />
                    Compartir
                  </>
                )}
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
                  onBlur={() => {
                    if (calcPrice > 0 && downPayment > calcPrice) setDownPayment(calcPrice)
                  }}
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

            {monthlyPayment ? (
              <div className="detail-calculator__results">
                <div className="detail-calculator__result detail-calculator__result--highlight">
                  <span className="detail-calculator__result-label">Cuota Mensual</span>
                  <span className="detail-calculator__result-value">
                    ${formatUSD(monthlyPayment.monthly)}
                  </span>
                  {exchangeRate && (
                    <span className="detail-calculator__result-dop">
                      &asymp; RD$ {formatDOP(monthlyPayment.monthly)} /mes
                    </span>
                  )}
                </div>
                <div className="detail-calculator__result">
                  <span className="detail-calculator__result-label">Total a Pagar</span>
                  <span className="detail-calculator__result-value">
                    ${formatUSD(monthlyPayment.total)}
                  </span>
                  {exchangeRate && (
                    <span className="detail-calculator__result-dop">
                      &asymp; RD$ {formatDOP(monthlyPayment.total)}
                    </span>
                  )}
                </div>
                <div className="detail-calculator__result">
                  <span className="detail-calculator__result-label">Total Intereses</span>
                  <span className="detail-calculator__result-value">
                    ${formatUSD(monthlyPayment.interest)}
                  </span>
                  {exchangeRate && (
                    <span className="detail-calculator__result-dop">
                      &asymp; RD$ {formatDOP(monthlyPayment.interest)}
                    </span>
                  )}
                </div>
              </div>
            ) : downCoversPrice ? (
              <div className="detail-calculator__results">
                <p className="detail-calculator__note">
                  No necesitas financiamiento: el inicial cubre el precio total del veh&iacute;culo.
                </p>
              </div>
            ) : null}
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
          ref={lightboxRef}
          className="detail-lightbox"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Galería de ${vehicle.brand} ${vehicle.model}`}
        >
          <button
            ref={lightboxCloseRef}
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
