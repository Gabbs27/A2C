import React from 'react'
import { FiCheck, FiStar, FiShield, FiAward } from 'react-icons/fi'
import './Features.css'

const Features = () => {
  const features = [
    {
      icon: <FiCheck size={40} />,
      title: 'Vehículos Certificados',
      description: 'Cada vehículo pasa por una rigurosa inspección de calidad'
    },
    {
      icon: <FiStar size={40} />,
      title: 'Servicio de Primera',
      description: 'Atención personalizada y dedicada a cada cliente'
    },
    {
      icon: <FiShield size={40} />,
      title: 'Garantía Extendida',
      description: 'Protección completa para tu inversión'
    },
    {
      icon: <FiAward size={40} />,
      title: 'Financiamiento Flexible',
      description: 'Opciones de pago adaptadas a tus necesidades'
    }
  ]

  return (
    <section className="features" id="vehicles">
      <div className="container">
        <h2 className="section-title-center">¿Por Qué Elegir A2C Internacional?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-item">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features



