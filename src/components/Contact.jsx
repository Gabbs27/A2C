import React from 'react'
import { FiPhone, FiMail, FiMapPin, FiClock } from 'react-icons/fi'
import './Contact.css'

const Contact = () => {
  return (
    <section className="contact" id="contact">
      <div className="container">
        <h2 className="section-title-center">Visítanos</h2>
        
        <div className="contact-grid">
          <div className="contact-info-section">
            <div className="contact-card">
              <div className="contact-icon">
                <FiMapPin size={32} />
              </div>
              <h3>Ubicación</h3>
              <p>Avenida 6</p>
              <p>Santo Domingo 11114</p>
              <p>República Dominicana</p>
              <a 
                href="https://maps.app.goo.gl/jV8nB1RSGDy96rbc7" 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-link"
              >
                Ver en Google Maps
              </a>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <FiPhone size={32} />
              </div>
              <h3>Teléfono</h3>
              <p><strong>Ventas:</strong> +1 (829) 447-0259</p>
              <a href="tel:+18294470259" className="contact-link">
                Llamar Ahora
              </a>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <FiClock size={32} />
              </div>
              <h3>Horario</h3>
              <p><strong>Lun - Vie:</strong> 9:00 AM - 8:00 PM</p>
              <p><strong>Sábado:</strong> 9:00 AM - 6:00 PM</p>
              <p><strong>Domingo:</strong> 11:00 AM - 5:00 PM</p>
            </div>

            <div className="contact-card">
              <div className="contact-icon">
                <FiMail size={32} />
              </div>
              <h3>Email</h3>
              <p>info@a2cinternational.com</p>
              <a href="mailto:info@a2cinternational.com" className="contact-link">
                Enviar Email
              </a>
            </div>
          </div>

          <div className="map-container">
            <iframe
              src="https://maps.google.com/maps?q=A2C+International+Avenida+6+Santo+Domingo+Republica+Dominicana&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="A2C International - Santo Domingo, República Dominicana"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact

