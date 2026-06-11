import { FiPhone, FiMail, FiMapPin, FiClock } from 'react-icons/fi'
import {
  ADDRESS,
  EMAIL,
  HOURS,
  PHONE_DISPLAY,
  PHONE_E164,
} from '../lib/siteConfig'
import './Contact.css'

const CONTACT_ITEMS = [
  {
    icon: FiMapPin,
    label: 'Ubicación',
    lines: [
      ADDRESS.street,
      `${ADDRESS.locality} ${ADDRESS.postalCode}`,
      'República Dominicana',
    ],
    link: {
      href: ADDRESS.mapsUrl,
      label: 'Ver en Google Maps',
      external: true,
    },
  },
  {
    icon: FiPhone,
    label: 'Teléfono',
    lines: [`Ventas: ${PHONE_DISPLAY}`],
    link: { href: `tel:${PHONE_E164}`, label: 'Llamar ahora' },
  },
  {
    icon: FiClock,
    label: 'Horario',
    lines: HOURS.map((h) => `${h.days}: ${h.opens} – ${h.closes}`),
  },
  {
    icon: FiMail,
    label: 'Email',
    lines: [EMAIL],
    link: { href: `mailto:${EMAIL}`, label: 'Enviar email' },
  },
]

export default function Contact() {
  return (
    <section
      className="contact-section"
      id="contacto"
      aria-labelledby="contact-title"
    >
      <div className="container">
        <header className="contact-section__header">
          <span className="contact-section__number" aria-hidden="true">05</span>
          <div>
            <p className="eyebrow">Contacto</p>
            <h2 id="contact-title" className="display-xl contact-section__title">
              Visítanos o escríbenos.
            </h2>
          </div>
        </header>

        <div className="contact-section__grid">
          <ul className="contact-section__list">
            {CONTACT_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.label} className="contact-section__item">
                  <div className="contact-section__icon">
                    <Icon aria-hidden="true" />
                  </div>
                  <div className="contact-section__body">
                    <p className="eyebrow contact-section__label">{item.label}</p>
                    {item.lines.map((line, i) => (
                      <p key={i} className="contact-section__line">
                        {line}
                      </p>
                    ))}
                    {item.link && (
                      <a
                        className="contact-section__link"
                        href={item.link.href}
                        {...(item.link.external
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                      >
                        {item.link.label}
                      </a>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="contact-section__map">
            <iframe
              src="https://maps.google.com/maps?q=A2C+International+Avenida+6+Santo+Domingo+Republica+Dominicana&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="A2C International - Santo Domingo, República Dominicana"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
