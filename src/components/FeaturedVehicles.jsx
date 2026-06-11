import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { fetchFeatured } from '../lib/api'
import VehicleCard from './VehicleCard'
import LoadingSkeleton from './LoadingSkeleton'
import DemoNotice from './DemoNotice'
import Button from './ui/Button'
import './FeaturedVehicles.css'

const FEATURED_LIMIT = 5

export default function FeaturedVehicles() {
  const { data, isPending } = useQuery({
    queryKey: ['featured', FEATURED_LIMIT],
    queryFn: () => fetchFeatured(FEATURED_LIMIT),
  })

  const vehicles = data?.vehicles || []

  return (
    <section className="featured" id="featured" aria-labelledby="featured-title">
      <div className="container">
        <header className="featured__header">
          <span className="featured__number" aria-hidden="true">01</span>
          <div>
            <p className="eyebrow">Inventario destacado</p>
            <h2 id="featured-title" className="display-xl featured__title">
              Selección del mes.
            </h2>
          </div>
        </header>

        {isPending ? (
          <div
            className="featured__grid"
            role="status"
            aria-busy="true"
            aria-label="Cargando vehículos destacados"
          >
            {Array.from({ length: FEATURED_LIMIT }, (_, i) => (
              <div key={i} className={`featured__cell featured__cell--${i}`}>
                <LoadingSkeleton />
              </div>
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="featured__empty">
            <p className="featured__empty-text">
              Estamos renovando la selección destacada. Mientras tanto, explora
              todo el inventario disponible.
            </p>
            <Button as={Link} to="/inventario" arrow>
              Ver inventario completo
            </Button>
          </div>
        ) : (
          <>
            <div className="featured__grid">
              {vehicles.map((v, i) => (
                <div key={v.id} className={`featured__cell featured__cell--${i}`}>
                  <VehicleCard vehicle={v} exchangeRate={data.exchangeRate} />
                </div>
              ))}
            </div>
            {data.demo && <DemoNotice />}
          </>
        )}
      </div>
    </section>
  )
}
