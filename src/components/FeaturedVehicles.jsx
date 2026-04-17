import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import VehicleCard from './VehicleCard'
import './FeaturedVehicles.css'

export default function FeaturedVehicles() {
  const [vehicles, setVehicles] = useState([])
  const [exchangeRate, setExchangeRate] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [vehiclesRes, rateRes] = await Promise.all([
          supabase
            .from('vehicles')
            .select('*, vehicle_images(*)')
            .eq('featured', true)
            .order('created_at', { ascending: false })
            .limit(5),
          supabase
            .from('exchange_rates')
            .select('usd_to_dop')
            .order('updated_at', { ascending: false })
            .limit(1),
        ])
        if (cancelled) return
        if (vehiclesRes.data) setVehicles(vehiclesRes.data)
        if (rateRes.data?.[0]?.usd_to_dop) {
          setExchangeRate(rateRes.data[0].usd_to_dop)
        }
      } catch (err) {
        console.error('FeaturedVehicles load error:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading || vehicles.length === 0) return null

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

        <div className="featured__grid">
          {vehicles.map((v, i) => (
            <div key={v.id} className={`featured__cell featured__cell--${i}`}>
              <VehicleCard vehicle={v} exchangeRate={exchangeRate} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
