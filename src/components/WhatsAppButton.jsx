import { useEffect, useRef, useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { useReducedMotion } from '../hooks/useReducedMotion'
import './WhatsAppButton.css'

const WHATSAPP_URL =
  'https://wa.me/18294470259?text=Hola,%20me%20interesa%20obtener%20informaci%C3%B3n%20sobre%20sus%20veh%C3%ADculos.'
const IDLE_MS = 5000

export default function WhatsAppButton() {
  const reduced = useReducedMotion()
  const [attention, setAttention] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const idleTimer = useRef(null)

  useEffect(() => {
    if (reduced) return undefined

    const scheduleAttention = () => {
      clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(() => {
        setAttention(true)
        setTimeout(() => setAttention(false), 1500)
      }, IDLE_MS)
    }

    const handleScroll = () => {
      const scrolled = window.scrollY
      setCollapsed(scrolled > 200)
      scheduleAttention()
    }

    scheduleAttention()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(idleTimer.current)
    }
  }, [reduced])

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`wa-btn ${attention ? 'is-attention' : ''} ${collapsed ? 'is-collapsed' : ''}`}
      aria-label="Contactar por WhatsApp"
    >
      <FaWhatsapp aria-hidden="true" />
    </a>
  )
}
