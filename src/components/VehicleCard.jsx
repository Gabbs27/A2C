import React from 'react'
import { Link } from 'react-router-dom'
import { FiDroplet, FiSettings, FiActivity } from 'react-icons/fi'
import './VehicleCard.css'

const statusLabels = {
  disponible: 'Disponible',
  reservado: 'Reservado',
  vendido: 'Vendido'
}

const VehicleCard = ({ vehicle, exchangeRate, onCompareToggle, isComparing }) => {
  const primaryImage = vehicle.vehicle_images?.find(img => img.is_primary)
    || vehicle.vehicle_images?.[0]

  const priceUSD = vehicle.price_usd
    ? Number(vehicle.price_usd).toLocaleString('en-US')
    : '—'

  const priceDOP = vehicle.price_usd && exchangeRate
    ? (Number(vehicle.price_usd) * exchangeRate).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })
    : null

  const mileageFormatted = vehicle.mileage
    ? Number(vehicle.mileage).toLocaleString('en-US') + ' km'
    : null

  const handleCompareClick = (e) => {
    e.stopPropagation()
    if (onCompareToggle) {
      onCompareToggle(vehicle.id)
    }
  }

  return (
    <div className="vehicle-card">
      <Link to={`/vehiculo/${vehicle.id}`} className="vehicle-card__link">
        <div className="vehicle-card__image-wrapper">
          {primaryImage ? (
            <img
              src={primaryImage.image_url}
              alt={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
              className="vehicle-card__image"
              loading="lazy"
            />
          ) : (
            <div className="vehicle-card__image-placeholder">
              <span>Sin imagen</span>
            </div>
          )}

          {vehicle.status && (
            <span className={`vehicle-card__status vehicle-card__status--${vehicle.status}`}>
              {statusLabels[vehicle.status] || vehicle.status}
            </span>
          )}
        </div>

        <div className="vehicle-card__body">
          <div className="vehicle-card__header">
            <h3 className="vehicle-card__title">
              {vehicle.brand} {vehicle.model}
            </h3>
            <span className="vehicle-card__year">{vehicle.year}</span>
          </div>

          <div className="vehicle-card__pricing">
            <span className="vehicle-card__price-usd">${priceUSD}</span>
            {priceDOP && (
              <span className="vehicle-card__price-dop">RD$ {priceDOP}</span>
            )}
          </div>

          <div className="vehicle-card__badges">
            {mileageFormatted && (
              <span className="vehicle-card__badge">
                <FiActivity size={13} />
                {mileageFormatted}
              </span>
            )}
            {vehicle.fuel_type && (
              <span className="vehicle-card__badge">
                <FiDroplet size={13} />
                {vehicle.fuel_type}
              </span>
            )}
            {vehicle.transmission && (
              <span className="vehicle-card__badge">
                <FiSettings size={13} />
                {vehicle.transmission}
              </span>
            )}
          </div>
        </div>
      </Link>

      {onCompareToggle && (
        <div className="vehicle-card__compare">
          <label className="vehicle-card__compare-label">
            <input
              type="checkbox"
              checked={isComparing || false}
              onChange={handleCompareClick}
              className="vehicle-card__compare-checkbox"
            />
            <span>Comparar</span>
          </label>
        </div>
      )}
    </div>
  )
}

export default VehicleCard
