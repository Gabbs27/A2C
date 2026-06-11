import { Link } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import {
  SITE_NAME,
  PHONE_E164,
  PHONE_DISPLAY,
  EMAIL,
  ADDRESS,
  HOURS,
  whatsappLink,
} from '../lib/siteConfig'
import './Footer.css'

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer id="contact" className="site-footer">
      <div className="site-footer__inner container">
        <div className="site-footer__brand">
          <img
            src={`${import.meta.env.BASE_URL}logo-dark.png`}
            alt={SITE_NAME}
            className="site-footer__logo"
          />
        </div>

        <hr className="hairline site-footer__hairline" />

        <div className="site-footer__grid">
          <div className="site-footer__col">
            <p className="eyebrow site-footer__eyebrow">Compra</p>
            <ul className="site-footer__list">
              <li>
                <Link to="/inventario" className="site-footer__link">
                  Inventario
                </Link>
              </li>
              <li>
                <Link to="/comparar" className="site-footer__link">
                  Comparar
                </Link>
              </li>
            </ul>
          </div>

          <div className="site-footer__col">
            <p className="eyebrow site-footer__eyebrow">Vende</p>
            <ul className="site-footer__list">
              <li>
                <a
                  href={whatsappLink('Hola, quiero cotizar mi vehículo')}
                  className="site-footer__link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cotiza tu vehículo
                </a>
              </li>
              <li>
                <Link to="/#financiamiento" className="site-footer__link">
                  Financiamiento
                </Link>
              </li>
              <li>
                <Link to="/#servicios" className="site-footer__link">
                  Servicio
                </Link>
              </li>
            </ul>
          </div>

          <div className="site-footer__col">
            <p className="eyebrow site-footer__eyebrow">Contacto</p>
            <ul className="site-footer__list">
              <li>
                <span className="site-footer__text">{ADDRESS.short}</span>
              </li>
              <li>
                <a href={`tel:${PHONE_E164}`} className="site-footer__link">
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink()}
                  className="site-footer__link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className="site-footer__link">
                  {EMAIL}
                </a>
              </li>
            </ul>
          </div>

          <div className="site-footer__col">
            <p className="eyebrow site-footer__eyebrow">Horarios</p>
            <ul className="site-footer__list">
              {HOURS.map((slot) => (
                <li key={slot.days}>
                  <span className="site-footer__text">
                    {slot.days}: {slot.opens} – {slot.closes}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="hairline site-footer__hairline" />

        <div className="site-footer__bottom">
          <p className="site-footer__copyright">
            © {year} {SITE_NAME} · Todos los derechos reservados
          </p>
          <nav className="site-footer__legal" aria-label="Legal">
            <Link to="/privacidad" className="site-footer__legal-link">
              Privacidad
            </Link>
            <Link to="/terminos" className="site-footer__legal-link">
              Términos
            </Link>
          </nav>
          <ul className="site-footer__social" aria-label="Redes sociales">
            <li>
              <a
                href={whatsappLink()}
                className="site-footer__social-link"
                aria-label="WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp aria-hidden="true" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer
