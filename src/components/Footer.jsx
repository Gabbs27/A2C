import { Link } from 'react-router-dom'
import { FiInstagram, FiFacebook } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import './Footer.css'

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer id="contact" className="site-footer">
      <div className="site-footer__inner container">
        <div className="site-footer__brand">
          <img
            src={`${import.meta.env.BASE_URL}logo-dark.png`}
            alt="A2C International"
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
                <Link to="/inventario" className="site-footer__link">
                  Disponibles
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
                  href="https://wa.me/18294470259?text=Hola%2C%20quiero%20cotizar%20mi%20veh%C3%ADculo"
                  className="site-footer__link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cotiza tu vehículo
                </a>
              </li>
              <li>
                <a href="#finance" className="site-footer__link">
                  Financiamiento
                </a>
              </li>
              <li>
                <a href="#service" className="site-footer__link">
                  Servicio
                </a>
              </li>
            </ul>
          </div>

          <div className="site-footer__col">
            <p className="eyebrow site-footer__eyebrow">Contacto</p>
            <ul className="site-footer__list">
              <li>
                <span className="site-footer__text">Santo Domingo, R.D.</span>
              </li>
              <li>
                <a href="tel:+18294470259" className="site-footer__link">
                  +1 (829) 447-0259
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/18294470259"
                  className="site-footer__link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          <div className="site-footer__col">
            <p className="eyebrow site-footer__eyebrow">Horarios</p>
            <ul className="site-footer__list">
              <li>
                <span className="site-footer__text">Lun – Vie: 9am – 6pm</span>
              </li>
              <li>
                <span className="site-footer__text">Sáb: 9am – 3pm</span>
              </li>
              <li>
                <span className="site-footer__text">Dom: Cerrado</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="hairline site-footer__hairline" />

        <div className="site-footer__bottom">
          <p className="site-footer__copyright">
            © {year} A2C International · Todos los derechos reservados
          </p>
          <ul className="site-footer__social" aria-label="Redes sociales">
            <li>
              <a
                href="https://instagram.com/"
                className="site-footer__social-link"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiInstagram aria-hidden="true" />
              </a>
            </li>
            <li>
              <a
                href="https://facebook.com/"
                className="site-footer__social-link"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiFacebook aria-hidden="true" />
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/18294470259"
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
