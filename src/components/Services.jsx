import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import { whatsappLink } from '../lib/siteConfig'
import './Services.css'

const SERVICES = [
  {
    title: 'Compra tu auto',
    body: 'Explora nuestra colección curada de vehículos. Cada unidad es inspeccionada y preparada para ofrecer la mejor experiencia de conducción.',
    cta: { label: 'Ver inventario', to: '/inventario', type: 'internal' },
  },
  {
    title: 'Vende tu auto',
    body: 'Comparte los detalles de tu vehículo por WhatsApp, obtén una oferta justa y deja el papeleo en nuestras manos.',
    cta: {
      label: 'Escribir por WhatsApp',
      href: whatsappLink('Hola, me interesa vender mi vehículo'),
      type: 'external',
    },
  },
  {
    title: 'Garantía y confianza',
    body: 'Cada vehículo viene con inspección completa, historial documentado y garantía. Financiamiento transparente para compras sin sorpresas.',
    cta: { label: 'Conocer más', href: '#financiamiento', type: 'anchor' },
  },
  {
    title: 'Entrega personalizada',
    body: 'Coordinamos entrega en toda República Dominicana con documentación al día y acompañamiento en cada paso.',
    cta: { label: 'Contactar', href: '#contacto', type: 'anchor' },
  },
]

function CTALink({ cta }) {
  const children = (
    <>
      <span>{cta.label}</span>
      <FiArrowRight className="arrow" aria-hidden="true" />
    </>
  )
  if (cta.type === 'internal') {
    return (
      <Link to={cta.to} className="services__item-cta btn-arrow">
        {children}
      </Link>
    )
  }
  if (cta.type === 'external') {
    return (
      <a
        href={cta.href}
        className="services__item-cta btn-arrow"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    )
  }
  return (
    <a href={cta.href} className="services__item-cta btn-arrow">
      {children}
    </a>
  )
}

export default function Services() {
  return (
    <section className="services" id="servicios" aria-labelledby="services-title">
      <div className="container">
        <header className="services__header">
          <span className="services__number" aria-hidden="true">02</span>
          <div>
            <p className="eyebrow">Servicios</p>
            <h2 id="services-title" className="display-xl services__title">
              Lo que incluimos.
            </h2>
          </div>
        </header>

        <ol className="services__list">
          {SERVICES.map((s, i) => (
            <li key={s.title} className="services__item">
              <span className="services__item-number tabular" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="services__item-body">
                <h3 className="services__item-title">{s.title}</h3>
                <p>{s.body}</p>
              </div>
              <CTALink cta={s.cta} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
