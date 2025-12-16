import React, { useState, useEffect } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import './Hero.css'

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

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



