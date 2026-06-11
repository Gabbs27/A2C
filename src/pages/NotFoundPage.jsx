import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import './NotFoundPage.css'

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <SEO title="Página no encontrada" noIndex />
      <div className="container not-found__inner">
        <p className="eyebrow not-found__eyebrow">Error 404</p>
        <h1 className="display-xl not-found__title">
          Esta página <em>no existe.</em>
        </h1>
        <p className="not-found__lead">
          La dirección que buscas fue movida o nunca existió. Nuestro
          inventario, en cambio, sigue donde siempre.
        </p>
        <div className="not-found__actions">
          <Link to="/inventario" className="not-found__link not-found__link--primary">
            Explorar inventario
          </Link>
          <Link to="/" className="not-found__link">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
