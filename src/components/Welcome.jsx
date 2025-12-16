import React from 'react'
import './Welcome.css'

const Welcome = () => {
  return (
    <section className="welcome" id="about">
      <div className="container">
        <div className="welcome-content">
          <div className="tagline">SALE AND SERVICES</div>
          <h2 className="section-title">A2C INTERNATIONAL: Construido para Impresionar</h2>
          <p className="welcome-text">
            Bienvenido a A2C INTERNATIONAL, donde cada vehículo es seleccionado cuidadosamente 
            por su estilo, potencia y rendimiento. Ya sea que estés comprando, vendiendo o 
            dando servicio a tu auto, estamos aquí para hacer tu experiencia rápida, fácil e 
            inolvidable. Alcancemos la grandeza juntos durante tu visita.
          </p>
          <div className="welcome-buttons">
            <a href="#shop" className="btn btn-primary">Comenzar a Comprar</a>
            <a href="#contact" className="btn btn-outline">Encuéntranos</a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Welcome



