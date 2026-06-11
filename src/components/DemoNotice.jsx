import './DemoNotice.css'

// Nota discreta cuando la página sirve el inventario de demostración
// (backend no configurado o inaccesible). Ver src/lib/api.js.
export default function DemoNotice() {
  return (
    <p className="demo-notice" role="note">
      Mostrando inventario de demostración — los vehículos publicados pueden
      variar. <span className="demo-notice__sep">·</span> Escríbenos para
      conocer la disponibilidad actual.
    </p>
  )
}
