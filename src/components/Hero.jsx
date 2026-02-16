import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi'
import './Hero.css'

const BRANDS = [
  'Mercedes-Benz', 'BMW', 'Porsche', 'Land Rover', 'Toyota',
  'Honda', 'Hyundai', 'Audi', 'Lexus', 'Jeep'
]

const slides = [
  {
    title: 'Lujo. Exótico. Y Mucho Más.',
    subtitle: 'Mercedes-Benz',
    description: 'Lujoso & Confortable',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1600&q=80'
  },
  {
    title: 'Potencia y Elegancia',
    subtitle: 'BMW',
    description: 'Deportivo & Divertido',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1600&q=80'
  },
  {
    title: 'Performance Excepcional',
    subtitle: 'Porsche',
    description: 'Como Nuevo',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=80'
  },
  {
    title: 'Aventura sin Límites',
    subtitle: 'Land Rover',
    description: 'Lujoso & Versátil',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1600&q=80'
  }
]

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [textVisible, setTextVisible] = useState(true)
  const [selectedBrand, setSelectedBrand] = useState('')
  const navigate = useNavigate()

  const goToSlide = useCallback((index) => {
    // Fade out text first
    setTextVisible(false)
    // After text fades out, change slide and fade text back in
    setTimeout(() => {
      setCurrentSlide(index)
      setTextVisible(true)
    }, 300)
  }, [])

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length)
  }, [currentSlide, goToSlide])

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length)
  }, [currentSlide, goToSlide])

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [nextSlide])

  const handleSearch = () => {
    if (selectedBrand) {
      navigate(`/inventario?brand=${encodeURIComponent(selectedBrand)}`)
    } else {
      navigate('/inventario')
    }
  }

  const slide = slides[currentSlide]

  return (
    <section className="hero">
      {/* Background slides - only images */}
      <div className="hero-slider">
        {slides.map((s, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${s.image})` }}
          >
            <div className="hero-overlay" />
          </div>
        ))}
      </div>

      {/* Content - separated from slides so it animates independently */}
      <div className="hero-content-wrapper">
        <div className="container">
          <div className={`hero-content ${textVisible ? 'visible' : ''}`}>
            <h1 className="hero-title">{slide.title}</h1>
            <p className="hero-subtitle">{slide.subtitle}</p>
            <p className="hero-description">{slide.description}</p>
            <div className="hero-buttons">
              <Link to="/inventario" className="btn btn-primary">Comprar un Auto</Link>
              <a
                href="https://wa.me/18294470259?text=Hola,%20me%20interesa%20vender%20mi%20veh%C3%ADculo"
                className="btn btn-secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vender un Auto
              </a>
            </div>
            <div className="hero-search">
              <select
                className="hero-search__select"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <option value="">Todas las Marcas</option>
                {BRANDS.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
              <button className="hero-search__btn" onClick={handleSearch}>
                <FiSearch size={18} />
                Buscar
              </button>
            </div>
          </div>
        </div>
      </div>

      <button className="slider-btn prev" onClick={prevSlide} aria-label="Slide anterior">
        <FiChevronLeft size={30} />
      </button>
      <button className="slider-btn next" onClick={nextSlide} aria-label="Siguiente slide">
        <FiChevronRight size={30} />
      </button>

      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default Hero
