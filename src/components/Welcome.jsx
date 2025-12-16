import React from 'react'
import './Welcome.css'

const Welcome = () => {
  return (
    <section className="welcome" id="about">
      <div className="container">
        <div className="welcome-content">
          <h2 className="section-title">A2C Internacional: Construido para Impresionar</h2>
          <p className="welcome-text">
            Bienvenido a A2C Internacional, donde cada vehículo es seleccionado cuidadosamente 
            por su estilo, potencia y rendimiento. Ya sea que estés comprando, vendiendo o 
            dando servicio a tu auto, estamos aquí para hacer tu experiencia rápida, fácil e 
            inolvidable. Alcancemos la grandeza juntos durante tu visita.
          </p>
          <div className="welcome-buttons">
            <button className="btn btn-primary">Comenzar a Comprar</button>
            <button className="btn btn-outline">Encuentra tu Ubicación</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Welcome



