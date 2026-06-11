import { useEffect, useRef, useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { SITE_NAME, whatsappLink } from '../lib/siteConfig'
import './WhatsAppButton.css'

const WHATSAPP_URL = whatsappLink(
  'Hola, me interesa obtener información sobre sus vehículos.'
)
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
      aria-label={`Abrir chat de WhatsApp con ${SITE_NAME}`}
    >
      <FaWhatsapp aria-hidden="true" />
    </a>
  )
}
