import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useReducedMotion } from '../hooks/useReducedMotion'
import './Hero.css'

const SLIDES = [
  {
    eyebrow: 'Edición 2026',
    prefix: 'Lujo,',
    emphasis: 'exótico,',
    suffix: 'y mucho más.',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1800&q=80',
  },
  {
    eyebrow: 'Potencia y elegancia',
    prefix: 'Performance',
    emphasis: 'alemán,',
    suffix: 'precisión pura.',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1800&q=80',
  },
  {
    eyebrow: 'Herencia deportiva',
    prefix: 'Conducción',
    emphasis: 'excepcional,',
    suffix: 'sin compromisos.',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1800&q=80',
  },
  {
    eyebrow: 'Aventura sin límites',
    prefix: 'Versatilidad',
    emphasis: 'británica,',
    suffix: 'confort extremo.',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1800&q=80',
  },
]

const AUTOPLAY_MS = 7000

export default function Hero() {
  const [idx, setIdx] = useState(0)
  const reduced = useReducedMotion()
  const timerRef = useRef(null)

  useEffect(() => {
    if (reduced) return undefined
    timerRef.current = setInterval(() => {
      setIdx((i) => (i + 1) % SLIDES.length)
    }, AUTOPLAY_MS)
    return () => clearInterval(timerRef.current)
  }, [reduced])

  const pause = () => clearInterval(timerRef.current)
  const resume = () => {
    if (reduced) return
    pause()
    timerRef.current = setInterval(() => {
      setIdx((i) => (i + 1) % SLIDES.length)
    }, AUTOPLAY_MS)
  }

  const active = SLIDES[idx]

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      aria-label="Vehículos destacados"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className={`hero__slide ${i === idx ? 'is-active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} de ${SLIDES.length}`}
          aria-hidden={i !== idx}
        />
      ))}
      <div className="hero__overlay" aria-hidden="true" />

      <div className="container hero__content">
        <p className="eyebrow hero__eyebrow">{active.eyebrow}</p>
        <h1 className="display-2xl hero__title" key={idx}>
          {active.prefix} <em>{active.emphasis}</em>
          <br />
          {active.suffix}
        </h1>
        <div className="hero__actions">
          <Link to="/inventario" className="btn btn--primary btn--lg btn-arrow">
            <span>Explorar inventario</span>
            <FiArrowRight className="arrow" aria-hidden="true" />
          </Link>
          <a
            href="https://wa.me/18294470259?text=Hola,%20me%20interesa%20vender%20mi%20veh%C3%ADculo"
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
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`hero__indicator ${i === idx ? 'is-active' : ''}`}
            onClick={() => setIdx(i)}
            aria-label={`Ir al slide ${i + 1}`}
            aria-current={i === idx}
          />
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
