import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'
import './Header.css'

const NAV_ITEMS = [
  { label: 'Comprar', to: '/inventario', type: 'link' },
  {
    label: 'Vender',
    href: 'https://wa.me/18294470259?text=Hola%2C%20me%20interesa%20vender%20mi%20veh%C3%ADculo',
    type: 'external',
  },
  { label: 'Financiamiento', href: '#finance', type: 'anchor' },
  { label: 'Servicio', href: '#service', type: 'anchor' },
  { label: 'Contacto', href: '#contact', type: 'anchor' },
]

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const location = useLocation()

  // Track scroll >32px for header style change
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 32)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [isDrawerOpen])

  // Close drawer on navigation
  useEffect(() => {
    setIsDrawerOpen(false)
  }, [location.pathname, location.hash])

  const closeDrawer = () => setIsDrawerOpen(false)

  const renderNavLink = (item, inDrawer = false) => {
    const className = inDrawer ? 'site-header__drawer-link' : 'site-header__nav-link'

    if (item.type === 'link') {
      return (
        <Link key={item.label} to={item.to} className={className} onClick={closeDrawer}>
          <span>{item.label}</span>
        </Link>
      )
    }

    const extraProps =
      item.type === 'external'
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {}

    return (
      <a
        key={item.label}
        href={item.href}
        className={className}
        onClick={closeDrawer}
        {...extraProps}
      >
        <span>{item.label}</span>
      </a>
    )
  }

  return (
    <header
      className={`site-header ${isScrolled ? 'is-scrolled' : ''} ${
        isDrawerOpen ? 'is-drawer-open' : ''
      }`}
    >
      <div className="site-header__inner">
        <button
          type="button"
          className="site-header__hamburger"
          aria-label={isDrawerOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isDrawerOpen}
          aria-controls="primary-nav"
          onClick={() => setIsDrawerOpen((v) => !v)}
        >
          {isDrawerOpen ? <FiX size={22} aria-hidden="true" /> : <FiMenu size={22} aria-hidden="true" />}
        </button>

        <Link to="/" className="site-header__logo" onClick={closeDrawer}>
          <img
            src="/logo-dark.png"
            alt=""
            width="160"
            height="48"
            className="site-header__logo-img"
          />
          <span className="sr-only">A2C Internacional</span>
        </Link>

        <nav
          id="primary-nav"
          className="site-header__nav"
          aria-label="Navegación principal"
        >
          {NAV_ITEMS.map((item) => renderNavLink(item, false))}
        </nav>
      </div>

      <div
        className="site-header__drawer"
        data-open={isDrawerOpen}
        aria-hidden={!isDrawerOpen}
      >
        <nav className="site-header__drawer-nav" aria-label="Navegación móvil">
          {NAV_ITEMS.map((item) => renderNavLink(item, true))}
        </nav>
      </div>
    </header>
  )
}

export default Header
