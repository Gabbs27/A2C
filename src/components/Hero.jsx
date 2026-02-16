import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi'
import './Hero.css'

const BRANDS = [
  'Mercedes-Benz', 'BMW', 'Porsche', 'Land Rover', 'Toyota',
  'Honda', 'Hyundai', 'Audi', 'Lexus', 'Jeep'
]

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedBrand, setSelectedBrand] = useState('')
  const navigate = useNavigate()

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const handleSearch = () => {
    if (selectedBrand) {
      navigate(`/inventario?brand=${encodeURIComponent(selectedBrand)}`)
    } else {
      navigate('/inventario')
    }
  }

  return (
    <section className="hero">
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="hero-overlay"></div>
            <div className="container">
              <div className="hero-content">
                <h1 className="hero-title">{slide.title}</h1>
                <p className="hero-subtitle">{slide.subtitle}</p>
                <p className="hero-description">{slide.description}</p>
                <div className="hero-buttons">
                  <button className="btn btn-primary">Comprar un Auto</button>
                  <button className="btn btn-secondary">Vender un Auto</button>
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
        ))}
      </div>

      <button className="slider-btn prev" onClick={prevSlide}>
        <FiChevronLeft size={30} />
      </button>
      <button className="slider-btn next" onClick={nextSlide}>
        <FiChevronRight size={30} />
      </button>

      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  )
}

export default Hero



