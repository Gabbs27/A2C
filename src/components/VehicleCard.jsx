import { Link } from 'react-router-dom'
import { BiGitCompare } from 'react-icons/bi'
import './VehicleCard.css'

const STATUS_LABELS = {
  disponible: 'Disponible',
  reservado: 'Reservado',
  vendido: 'Vendido',
}

export default function VehicleCard({
  vehicle,
  exchangeRate,
  onCompareToggle,
  isComparing,
}) {
  const primaryImage =
    vehicle.vehicle_images?.find((img) => img.is_primary) ||
    vehicle.vehicle_images?.[0]

  const priceUSD = vehicle.price_usd
    ? Number(vehicle.price_usd).toLocaleString('en-US')
    : null

  const priceDOP =
    vehicle.price_usd && exchangeRate
      ? (Number(vehicle.price_usd) * exchangeRate).toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      : null

  const mileageFormatted = vehicle.mileage
    ? Number(vehicle.mileage).toLocaleString('en-US')
    : null

  const handleCompare = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onCompareToggle) onCompareToggle(vehicle.id)
  }

  const detailHref = `/vehiculo/${vehicle.id}`
  const ariaLabel = `${vehicle.brand} ${vehicle.model} ${vehicle.year}`

  return (
    <article className="v-card">
      <Link to={detailHref} className="v-card__media-link" aria-label={ariaLabel}>
        <div className="v-card__media">
          {primaryImage ? (
            <img
              src={primaryImage.image_url}
              alt={`${vehicle.year} ${vehicle.brand} ${vehicle.model}`}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="v-card__media-placeholder">Sin imagen</div>
          )}

          {vehicle.status && (
            <span className={`v-card__status v-card__status--${vehicle.status}`}>
              {STATUS_LABELS[vehicle.status] || vehicle.status}
            </span>
          )}
        </div>
      </Link>

      {onCompareToggle && (
        <button
          type="button"
          className="v-card__compare"
          onClick={handleCompare}
          aria-pressed={!!isComparing}
          aria-label={
            isComparing
              ? `Quitar ${ariaLabel} de comparación`
              : `Agregar ${ariaLabel} a comparación`
          }
        >
          <BiGitCompare aria-hidden="true" />
        </button>
      )}

      <div className="v-card__body">
        <p className="eyebrow">
          <span className="tabular">{vehicle.year}</span> · {vehicle.brand}
        </p>
        <h3 className="v-card__title">
          <Link to={detailHref}>{vehicle.model}</Link>
        </h3>

        {priceUSD ? (
          <p className="v-card__price tabular">
            <span aria-hidden="true">$</span>
            <span className="sr-only">USD </span>
            {priceUSD}
          </p>
        ) : (
          <p className="v-card__price v-card__price--consult">
            Consultar precio
          </p>
        )}
        {priceDOP && (
          <p className="v-card__price-alt tabular">
            <span aria-hidden="true">RD$</span>
            <span className="sr-only">Peso dominicano </span> {priceDOP}
          </p>
        )}

        <hr className="v-card__divider" aria-hidden="true" />

        <ul className="v-card__specs">
          {mileageFormatted && (
            <li>
              <span className="tabular">{mileageFormatted}</span> km
            </li>
          )}
          {vehicle.transmission && <li>{vehicle.transmission}</li>}
          {vehicle.fuel_type && <li>{vehicle.fuel_type}</li>}
          {vehicle.color && <li>{vehicle.color}</li>}
        </ul>
      </div>
    </article>
  )
}
