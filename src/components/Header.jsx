import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'
import { SITE_NAME, whatsappLink } from '../lib/siteConfig'
import './Header.css'

const NAV_ITEMS = [
  { label: 'Comprar', to: '/inventario', type: 'link' },
  {
    label: 'Vender',
    href: whatsappLink('Hola, quiero vender mi vehículo'),
    type: 'external',
  },
  { label: 'Financiamiento', to: '/#financiamiento', type: 'hash' },
  { label: 'Servicio', to: '/#servicios', type: 'hash' },
  { label: 'Contacto', to: '/#contacto', type: 'hash' },
]

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const location = useLocation()
  const hamburgerRef = useRef(null)
  const drawerRef = useRef(null)
  const wasDrawerOpen = useRef(false)

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

  // Close on Escape while the drawer is open
  useEffect(() => {
    if (!isDrawerOpen) return undefined
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsDrawerOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isDrawerOpen])

  // Focus management: first link on open, back to the hamburger on close
  useEffect(() => {
    if (isDrawerOpen) {
      wasDrawerOpen.current = true
      requestAnimationFrame(() => {
        drawerRef.current?.querySelector('a')?.focus()
      })
    } else if (wasDrawerOpen.current) {
      wasDrawerOpen.current = false
      hamburgerRef.current?.focus()
    }
  }, [isDrawerOpen])

  const closeDrawer = () => setIsDrawerOpen(false)

  const renderNavLink = (item, inDrawer = false) => {
    const className = inDrawer ? 'site-header__drawer-link' : 'site-header__nav-link'

    if (item.type === 'link') {
      return (
        <NavLink
          key={item.label}
          to={item.to}
          className={({ isActive }) => `${className} ${isActive ? 'is-active' : ''}`}
          onClick={closeDrawer}
        >
          <span>{item.label}</span>
        </NavLink>
      )
    }

    if (item.type === 'hash') {
      return (
        <Link key={item.label} to={item.to} className={className} onClick={closeDrawer}>
          <span>{item.label}</span>
        </Link>
      )
    }

    return (
      <a
        key={item.label}
        href={item.href}
        className={className}
        onClick={closeDrawer}
        target="_blank"
        rel="noopener noreferrer"
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
          ref={hamburgerRef}
          className="site-header__hamburger"
          aria-label={isDrawerOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isDrawerOpen}
          aria-controls="mobile-drawer"
          onClick={() => setIsDrawerOpen((v) => !v)}
        >
          {isDrawerOpen ? <FiX size={22} aria-hidden="true" /> : <FiMenu size={22} aria-hidden="true" />}
        </button>

        <Link to="/" className="site-header__logo" onClick={closeDrawer}>
          <img
            src={`${import.meta.env.BASE_URL}logo-dark.png`}
            alt=""
            width="160"
            height="48"
            className="site-header__logo-img"
          />
          <span className="sr-only">{SITE_NAME}</span>
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
        id="mobile-drawer"
        ref={drawerRef}
        className="site-header__drawer"
        data-open={isDrawerOpen}
        aria-hidden={!isDrawerOpen}
        // React 18: '' añade el atributo inert, undefined lo quita
        inert={isDrawerOpen ? undefined : ''}
      >
        <nav className="site-header__drawer-nav" aria-label="Navegación móvil">
          {NAV_ITEMS.map((item) => renderNavLink(item, true))}
        </nav>
      </div>
    </header>
  )
}

export default Header
