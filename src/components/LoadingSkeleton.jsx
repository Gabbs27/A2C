import './LoadingSkeleton.css'

// Espeja la anatomía de VehicleCard (media 4:3, eyebrow, título, precio,
// divider, specs) para que la carga no produzca saltos de layout.
export default function LoadingSkeleton() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-card__media" />
      <div className="skeleton-card__body">
        <div className="skeleton skeleton-card__eyebrow" />
        <div className="skeleton skeleton-card__title" />
        <div className="skeleton skeleton-card__price" />
        <div className="skeleton-card__divider" />
        <div className="skeleton-card__specs">
          <div className="skeleton skeleton-card__spec" />
          <div className="skeleton skeleton-card__spec" />
          <div className="skeleton skeleton-card__spec" />
        </div>
      </div>
    </div>
  )
}
