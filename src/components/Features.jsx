import './Features.css'

const FEATURES = [
  {
    title: 'Inventario curado',
    body: 'Cada vehículo en piso pasa por inspección técnica rigurosa. Solo unidades con historial verificable.',
  },
  {
    title: 'Red internacional',
    body: 'Acceso a subastas, certificados y proveedores fuera del país para conseguir el modelo que buscas.',
  },
  {
    title: 'Calidad documentada',
    body: 'Título limpio, historial de servicio y reporte detallado del estado técnico al momento de la entrega.',
  },
  {
    title: 'Atención personalizada',
    body: 'Un asesor dedicado durante toda la negociación. Respuesta rápida por WhatsApp o llamada.',
  },
]

export default function Features() {
  return (
    <section className="features" id="vehicles" aria-labelledby="features-title">
      <div className="container">
        <header className="features__header">
          <span className="features__number" aria-hidden="true">03</span>
          <div>
            <p className="eyebrow">Por qué A2C</p>
            <h2 id="features-title" className="display-xl features__title">
              Nuestra diferencia.
            </h2>
          </div>
        </header>

        <ol className="features__list">
          {FEATURES.map((f, i) => (
            <li key={f.title} className="features__item">
              <span className="features__item-number tabular" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="features__item-body">
                <h3 className="features__item-title">{f.title}</h3>
                <p>{f.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
