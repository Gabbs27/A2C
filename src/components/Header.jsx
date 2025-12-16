import React, { useState, useEffect } from 'react'
import { FiMenu, FiX, FiPhone } from 'react-icons/fi'
import './Header.css'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-top">
        <div className="container">
          <div className="header-top-content">
            <div className="contact-info">
              <a href="tel:+1234567890" className="phone-link">
                <FiPhone /> Ventas — (609) 245-6634
              </a>
              <a href="tel:+1234567891" className="phone-link">
                <FiPhone /> Servicio — (609) 245-6634
              </a>
            </div>
            <div className="address">
              1723 N. Olden Ave
            </div>
          </div>
        </div>
      </div>

      <div className="header-main">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <h1>A2C <span>Internacional</span></h1>
            </div>

            <nav className={`nav ${isMobileMenuOpen ? 'active' : ''}`}>
              <a href="#shop" onClick={() => setIsMobileMenuOpen(false)}>Comprar</a>
              <a href="#vehicles" onClick={() => setIsMobileMenuOpen(false)}>Vehículos Eléctricos</a>
              <a href="#sell" onClick={() => setIsMobileMenuOpen(false)}>Vender/Intercambiar</a>
              <a href="#finance" onClick={() => setIsMobileMenuOpen(false)}>Financiamiento</a>
              <a href="#service" onClick={() => setIsMobileMenuOpen(false)}>Servicio</a>
              <a href="#about" onClick={() => setIsMobileMenuOpen(false)}>Acerca de</a>
            </nav>

            <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header



