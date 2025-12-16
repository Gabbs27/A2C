import React from 'react'
import { FiShoppingCart, FiDollarSign, FiTool } from 'react-icons/fi'
import './Services.css'

const Services = () => {
  const services = [
    {
      icon: <FiShoppingCart size={50} />,
      title: 'Compra tu Auto',
      description: 'Explora nuestra exclusiva colección de vehículos de lujo y exóticos. Cada auto es inspeccionado y preparado para ofrecerte la mejor experiencia de conducción.',
      buttonText: 'Ver Inventario',
      link: '#shop'
    },
    {
      icon: <FiDollarSign size={50} />,
      title: 'Vender tu Auto Nunca Fue Tan Fácil',
      description: 'En A2C Internacional, hemos simplificado el proceso de venta. Simplemente comparte los detalles de tu auto, obtén una oferta en efectivo y deja el papeleo en nuestras manos.',
      buttonText: 'Vender tu Auto',
      link: '#sell'
    },
    {
      icon: <FiTool size={50} />,
      title: 'Servicio Premier, Cuidado Inigualable',
      description: 'Tratamos tu auto como si fuera nuestro. Desde mantenimiento rutinario hasta reparaciones expertas, nuestro servicio premier asegura que tu vehículo reciba el cuidado de primera.',
      buttonText: 'Programar Servicio',
      link: '#service'
    }
  ]

  return (
    <section className="services">
      <div className="container">
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <a href={service.link} className="service-btn">
                {service.buttonText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services



