import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiPause, FiPlay } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { whatsappLink } from '../lib/siteConfig'
import './Hero.css'

const BASE = import.meta.env.BASE_URL

const SLIDES = [
  {
    eyebrow: 'Edición 2026',
    prefix: 'Lujo,',
    emphasis: 'exótico,',
    suffix: 'y mucho más.',
    image: `${BASE}hero/slide-1.jpg`,
  },
  {
    eyebrow: 'Potencia y elegancia',
    prefix: 'Performance',
    emphasis: 'alemán,',
    suffix: 'precisión pura.',
    image: `${BASE}hero/slide-2.jpg`,
  },
  {
    eyebrow: 'Herencia deportiva',
    prefix: 'Conducción',
    emphasis: 'excepcional,',
    suffix: 'sin compromisos.',
    image: `${BASE}hero/slide-3.jpg`,
  },
  {
    eyebrow: 'Aventura sin límites',
    prefix: 'Versatilidad',
    emphasis: 'británica,',
    suffix: 'confort extremo.',
    image: `${BASE}hero/slide-4.jpg`,
  },
]

const AUTOPLAY_MS = 7000

export default function Hero() {
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  // Solo se montan los fondos ya visitados + el siguiente: evita bajar
  // las 4 imágenes en el primer paint (LCP móvil)
  const [loadedSlides, setLoadedSlides] = useState(() => new Set([0, 1]))
  const reduced = useReducedMotion()

  // Re-crear el timer cuando cambia idx reinicia el autoplay tras navegación manual
  useEffect(() => {
    if (reduced || paused || hovered) return undefined
    const timer = setTimeout(() => {
      setIdx((i) => (i + 1) % SLIDES.length)
    }, AUTOPLAY_MS)
    return () => clearTimeout(timer)
  }, [idx, paused, hovered, reduced])

  useEffect(() => {
    const nextIdx = (idx + 1) % SLIDES.length
    const next = new Image()
    next.src = SLIDES[nextIdx].image
    setLoadedSlides((prev) => {
      if (prev.has(idx) && prev.has(nextIdx)) return prev
      const merged = new Set(prev)
      merged.add(idx)
      merged.add(nextIdx)
      return merged
    })
  }, [idx])

  const active = SLIDES[idx]

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      aria-label="Vehículos destacados"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHovered(false)
      }}
    >
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className={`hero__slide ${i === idx ? 'is-active' : ''}`}
          style={
            loadedSlides.has(i)
              ? { backgroundImage: `url(${slide.image})` }
              : undefined
          }
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} de ${SLIDES.length}`}
          aria-hidden={i !== idx}
        />
      ))}
      <div className="hero__overlay" aria-hidden="true" />

      <div className="container hero__content">
        <div className="hero__headline" key={idx}>
          <p className="eyebrow hero__eyebrow">{active.eyebrow}</p>
          <h1 className="display-2xl hero__title">
            {active.prefix} <em>{active.emphasis}</em>
            <br />
            {active.suffix}
          </h1>
        </div>
        <div className="hero__actions">
          <Link to="/inventario" className="btn btn--primary btn--lg btn-arrow">
            <span>Explorar inventario</span>
            <FiArrowRight className="arrow" aria-hidden="true" />
          </Link>
          <a
            href={whatsappLink('Hola, me interesa vender mi vehículo')}
            className="btn btn--ghost btn--lg"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Vender un auto por WhatsApp"
          >
            <FaWhatsapp aria-hidden="true" />
            <span>Vender un auto</span>
          </a>
        </div>
      </div>

      <div className="hero__indicators" aria-label="Navegación de slides">
        <button
          type="button"
          className="hero__playpause"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={
            paused ? 'Reanudar rotación automática' : 'Pausar rotación automática'
          }
        >
          {paused ? (
            <FiPlay aria-hidden="true" />
          ) : (
            <FiPause aria-hidden="true" />
          )}
        </button>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`hero__indicator ${i === idx ? 'is-active' : ''}`}
            onClick={() => setIdx(i)}
            aria-label={`Ir al slide ${i + 1}`}
            aria-current={i === idx}
          >
            <span className="hero__indicator-dot" aria-hidden="true" />
          </button>
        ))}
        <span className="hero__counter">
          <span className="tabular">{String(idx + 1).padStart(2, '0')}</span>
          <span className="hero__counter-sep"> / </span>
          <span className="tabular">{String(SLIDES.length).padStart(2, '0')}</span>
        </span>
      </div>
    </section>
  )
}
