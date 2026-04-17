import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import './Welcome.css'

export default function Welcome() {
  return (
    <section className="welcome" id="about" aria-labelledby="welcome-title">
      <div className="container container-content welcome__inner">
        <p className="eyebrow welcome__eyebrow">Sale and Services</p>
        <h2 id="welcome-title" className="display-xl welcome__title">
          Construido para <em>impresionar.</em>
        </h2>
        <p className="welcome__lead">
          En A2C International cada vehículo es seleccionado por su estilo, potencia y
          rendimiento. Ya sea que estés comprando, vendiendo o dando servicio a tu auto,
          estamos aquí para hacer tu experiencia rápida, clara y memorable.
        </p>
        <div className="welcome__actions">
          <Link to="/inventario" className="btn btn--primary btn--md btn-arrow">
            <span>Comenzar a comprar</span>
            <FiArrowRight className="arrow" aria-hidden="true" />
          </Link>
          <a href="#contact" className="btn btn--ghost btn--md">
            Encuéntranos
          </a>
        </div>
      </div>
    </section>
  )
}
