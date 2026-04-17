const SITE_URL = 'https://a2cinternational.com'

export function autoDealerSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: 'A2C International',
    url: SITE_URL,
    image: `${SITE_URL}/logo-dark.png`,
    telephone: '+18294470259',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'DO',
      addressLocality: 'Santo Domingo',
      streetAddress: 'Avenida 6',
      postalCode: '11114',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '11:00',
        closes: '17:00',
      },
    ],
  }
}

export function vehicleSchema(vehicle) {
  if (!vehicle) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: `${vehicle.year} ${vehicle.brand} ${vehicle.model}`,
    brand: { '@type': 'Brand', name: vehicle.brand },
    model: vehicle.model,
    vehicleModelDate: vehicle.year,
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
    offers: {
      '@type': 'Offer',
      price: vehicle.price_usd,
      priceCurrency: 'USD',
      availability:
        vehicle.status === 'disponible'
          ? 'https://schema.org/InStock'
          : vehicle.status === 'reservado'
          ? 'https://schema.org/PreOrder'
          : 'https://schema.org/SoldOut',
      seller: { '@type': 'AutoDealer', name: 'A2C International' },
    },
    ...(vehicle.vehicle_images?.[0]?.image_url
      ? { image: vehicle.vehicle_images[0].image_url }
      : {}),
  }
}

export { SITE_URL }
