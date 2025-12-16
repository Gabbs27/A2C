import React from 'react'
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-section">
              <h3 className="footer-logo">A2C <span>INTERNATIONAL</span></h3>
              <p className="footer-description">
                Tu destino para vehículos de lujo y exóticos. Experiencia premium 
                en cada transacción. SALE AND SERVICES.
              </p>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="Facebook">
                  <FiFacebook size={20} />
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <FiInstagram size={20} />
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <FiTwitter size={20} />
                </a>
              </div>
            </div>

            <div className="footer-section">
              <h4 className="footer-title">Enlaces Rápidos</h4>
              <ul className="footer-links">
                <li><a href="#shop">Inventario</a></li>
                <li><a href="#vehicles">Vehículos Eléctricos</a></li>
                <li><a href="#sell">Vender/Intercambiar</a></li>
                <li><a href="#finance">Financiamiento</a></li>
                <li><a href="#service">Servicio</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-title">Contacto</h4>
              <div className="contact-info-footer">
                <div className="contact-item">
                  <FiPhone />
                  <p>Ventas: +1 (829) 447-0259</p>
                </div>
                <div className="contact-item">
                  <FiMail />
                  <p>info@a2cinternacional.com</p>
                </div>
                <div className="contact-item">
                  <FiMapPin />
                  <div>
                    <p>Avenida 6, Santo Domingo 11114</p>
                    <p>República Dominicana</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="footer-section">
              <h4 className="footer-title">Horario</h4>
              <ul className="hours-list">
                <li>
                  <span>Lunes - Viernes:</span>
                  <span>9:00 AM - 8:00 PM</span>
                </li>
                <li>
                  <span>Sábado:</span>
                  <span>9:00 AM - 6:00 PM</span>
                </li>
                <li>
                  <span>Domingo:</span>
                  <span>11:00 AM - 5:00 PM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p>&copy; 2025 A2C INTERNATIONAL. Todos los derechos reservados.</p>
            <div className="footer-bottom-links">
              <a href="#">Política de Privacidad</a>
              <a href="#">Términos de Servicio</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer



