import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { whatsappLink } from '../lib/siteConfig'
import './Financing.css'

const TERMS = [12, 24, 36, 48, 60, 72]

export default function Financing() {
  const [price, setPrice] = useState(30000)
  const [downPayment, setDownPayment] = useState(6000)
  const [termMonths, setTermMonths] = useState(48)
  const [rate, setRate] = useState(12)

  const monthly = useMemo(() => {
    const loan = price - downPayment
    if (loan <= 0 || termMonths <= 0 || rate < 0) return null
    const r = rate / 100 / 12
    if (r === 0) return loan / termMonths
    const factor = Math.pow(1 + r, termMonths)
    return loan * ((r * factor) / (factor - 1))
  }, [price, downPayment, termMonths, rate])

  return (
    <section
      className="financing"
      id="financiamiento"
      aria-labelledby="financing-title"
    >
      <div className="container">
        <header className="financing__header">
          <span className="financing__number" aria-hidden="true">04</span>
          <div>
            <p className="eyebrow">Financiamiento</p>
            <h2 id="financing-title" className="display-xl financing__title">
              Financiamiento <em>a tu medida.</em>
            </h2>
          </div>
        </header>

        <div className="financing__grid">
          <div className="financing__copy">
            <p className="financing__lead">
              Trabajamos con bancos aliados para que estrenes sin esperas: tasas
              competitivas, inicial desde el 20% y aprobación rápida. Tú eliges
              el vehículo; nosotros estructuramos el plan.
            </p>
            <ul className="financing__points">
              <li>Tasas competitivas con bancos aliados</li>
              <li>Inicial desde el 20% del valor del vehículo</li>
              <li>Aprobación rápida y acompañamiento en todo el proceso</li>
            </ul>
            <div className="financing__actions">
              <Link to="/inventario" className="btn btn--primary btn--md btn-arrow">
                <span>Explorar inventario</span>
                <FiArrowRight className="arrow" aria-hidden="true" />
              </Link>
              <a
                href={whatsappLink('Hola, quiero información sobre financiamiento')}
                className="btn btn--ghost btn--md"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp aria-hidden="true" />
                <span>Consultar por WhatsApp</span>
              </a>
            </div>
          </div>

          <form
            className="financing__calc"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Calculadora de cuota mensual"
          >
            <div className="financing__fields">
              <div className="financing__field">
                <label htmlFor="fin-precio">Precio (USD)</label>
                <input
                  id="fin-precio"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  step="500"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>
              <div className="financing__field">
                <label htmlFor="fin-inicial">Inicial (USD)</label>
                <input
                  id="fin-inicial"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  step="500"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                />
              </div>
              <div className="financing__field">
                <label htmlFor="fin-plazo">Plazo</label>
                <select
                  id="fin-plazo"
                  value={termMonths}
                  onChange={(e) => setTermMonths(Number(e.target.value))}
                >
                  {TERMS.map((t) => (
                    <option key={t} value={t}>
                      {t} meses
                    </option>
                  ))}
                </select>
              </div>
              <div className="financing__field">
                <label htmlFor="fin-tasa">Tasa anual (%)</label>
                <input
                  id="fin-tasa"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max="100"
                  step="0.5"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="financing__result" aria-live="polite">
              <span className="financing__result-label">
                Cuota mensual estimada
              </span>
              <p className="financing__result-value">
                <span className="tabular">
                  {monthly !== null
                    ? `$${monthly.toLocaleString('en-US', {
                        maximumFractionDigits: 0,
                      })}`
                    : '—'}
                </span>
                {monthly !== null && (
                  <span className="financing__result-unit"> USD / mes</span>
                )}
              </p>
            </div>

            <p className="financing__disclaimer">
              Cálculo estimado. No constituye oferta de crédito.
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
