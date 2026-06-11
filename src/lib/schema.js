import {
  SITE_NAME,
  PHONE_E164,
  ADDRESS,
  HOURS_SCHEMA,
} from './siteConfig'

// Dominio canónico. En despliegues alternativos definir VITE_SITE_URL.
const SITE_URL = (
  import.meta.env.VITE_SITE_URL || 'https://a2cinternational.com'
).replace(/\/$/, '')

export function autoDealerSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: SITE_NAME,
    url: SITE_URL,
    image: `${SITE_URL}/logo-dark.png`,
    telephone: PHONE_E164,
    priceRange: '$$$',
    address: {
      '@type': 'PostalAddress',
      addressCountry: ADDRESS.country,
      addressLocality: ADDRESS.locality,
      streetAddress: ADDRESS.street,
      postalCode: ADDRESS.postalCode,
    },
    openingHoursSpecification: HOURS_SCHEMA.map((spec) => ({
      '@type': 'OpeningHoursSpecification',
      ...spec,
    })),
  }
}

export function vehicleSchema(vehicle) {
  if (!vehicle) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: `${vehicle.year} ${vehicle.brand} ${vehicle.model}`,
    url: `${SITE_URL}/vehiculo/${vehicle.id}`,
    brand: { '@type': 'Brand', name: vehicle.brand },
    model: vehicle.model,
    vehicleModelDate: vehicle.year,
    itemCondition:
      vehicle.condition?.toLowerCase() === 'nuevo'
        ? 'https://schema.org/NewCondition'
        : 'https://schema.org/UsedCondition',
    ...(vehicle.mileage
      ? {
          mileageFromOdometer: {
            '@type': 'QuantitativeValue',
            value: vehicle.mileage,
            unitCode: 'KMT',
          },
        }
      : {}),
    ...(vehicle.color ? { color: vehicle.color } : {}),
    ...(vehicle.fuel_type ? { fuelType: vehicle.fuel_type } : {}),
    ...(vehicle.transmission ? { vehicleTransmission: vehicle.transmission } : {}),
    ...(vehicle.body_type ? { bodyType: vehicle.body_type } : {}),
    ...(vehicle.vin ? { vehicleIdentificationNumber: vehicle.vin } : {}),
    ...(vehicle.price_usd
      ? {
          offers: {
            '@type': 'Offer',
            price: vehicle.price_usd,
            priceCurrency: 'USD',
            url: `${SITE_URL}/vehiculo/${vehicle.id}`,
            itemCondition:
              vehicle.condition?.toLowerCase() === 'nuevo'
                ? 'https://schema.org/NewCondition'
                : 'https://schema.org/UsedCondition',
            availability:
              vehicle.status === 'disponible'
                ? 'https://schema.org/InStock'
                : vehicle.status === 'reservado'
                ? 'https://schema.org/PreOrder'
                : 'https://schema.org/SoldOut',
            seller: { '@type': 'AutoDealer', name: SITE_NAME },
          },
        }
      : {}),
    ...(vehicle.vehicle_images?.[0]?.image_url
      ? { image: vehicle.vehicle_images[0].image_url }
      : {}),
  }
}

export { SITE_URL }
