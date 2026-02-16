import React from 'react'
import { Link } from 'react-router-dom'
import { FiShoppingCart, FiDollarSign, FiShield } from 'react-icons/fi'
import './Services.css'

const Services = () => {
  return (
    <section className="services">
      <div className="container">
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon"><FiShoppingCart size={50} /></div>
            <h3 className="service-title">Compra tu Auto</h3>
            <p className="service-description">
              Explora nuestra exclusiva colección de vehículos de lujo y exóticos. Cada auto es inspeccionado y preparado para ofrecerte la mejor experiencia de conducción.
            </p>
            <Link to="/inventario" className="service-btn">Ver Inventario</Link>
          </div>

          <div className="service-card">
            <div className="service-icon"><FiDollarSign size={50} /></div>
            <h3 className="service-title">Vender tu Auto Nunca Fue Tan Fácil</h3>
            <p className="service-description">
              En A2C Internacional, hemos simplificado el proceso de venta. Simplemente comparte los detalles de tu auto, obtén una oferta en efectivo y deja el papeleo en nuestras manos.
            </p>
            <a
              href="https://wa.me/18294470259?text=Hola,%20me%20interesa%20vender%20mi%20veh%C3%ADculo"
              className="service-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vender tu Auto
            </a>
          </div>

          <div className="service-card">
            <div className="service-icon"><FiShield size={50} /></div>
            <h3 className="service-title">Garantía y Confianza</h3>
            <p className="service-description">
              Cada vehículo viene con inspección completa y garantía. Financiamiento flexible y proceso transparente para que compres con total tranquilidad.
            </p>
            <Link to="/inventario" className="service-btn">Explorar Vehículos</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services



