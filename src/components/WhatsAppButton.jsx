import React from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import './WhatsAppButton.css'

const WHATSAPP_URL = 'https://wa.me/18294470259?text=Hola, me interesa obtener información sobre sus vehículos.'

const WhatsAppButton = () => {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button"
      aria-label="Contactar por WhatsApp"
    >
      <FaWhatsapp size={28} />
    </a>
  )
}

export default WhatsAppButton
