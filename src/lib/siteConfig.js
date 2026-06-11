// Única fuente de verdad para datos de contacto y marca.
// Cualquier cambio aquí se refleja en Header, Footer, Contact, detalle,
// schema.org y botón de WhatsApp.

export const SITE_NAME = 'A2C International'
export const SITE_TAGLINE = 'Sale and Services'

export const PHONE_E164 = '+18294470259'
export const PHONE_DISPLAY = '+1 (829) 447-0259'
export const WHATSAPP_NUMBER = '18294470259'

export const EMAIL = 'info@a2cinternational.com'

export const ADDRESS = {
  street: 'Avenida 6',
  locality: 'Santo Domingo',
  postalCode: '11114',
  country: 'DO',
  display: 'Avenida 6, Santo Domingo 11114, República Dominicana',
  short: 'Santo Domingo, R.D.',
  mapsUrl: 'https://maps.google.com/?q=A2C+International+Santo+Domingo',
}

// Horario comercial (única versión válida en todo el sitio)
export const HOURS = [
  { days: 'Lun – Vie', opens: '9:00 AM', closes: '8:00 PM' },
  { days: 'Sábado', opens: '9:00 AM', closes: '6:00 PM' },
  { days: 'Domingo', opens: '11:00 AM', closes: '5:00 PM' },
]

export const HOURS_SCHEMA = [
  {
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '20:00',
  },
  { dayOfWeek: 'Saturday', opens: '09:00', closes: '18:00' },
  { dayOfWeek: 'Sunday', opens: '11:00', closes: '17:00' },
]

// Redes sociales: null = aún sin perfil público, no se renderiza
export const SOCIAL = {
  instagram: null,
  facebook: null,
}

export const whatsappLink = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ''}`
