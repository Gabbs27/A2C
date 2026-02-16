import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import VehicleCard from './VehicleCard'
import './FeaturedVehicles.css'

const FeaturedVehicles = () => {
  const [vehicles, setVehicles] = useState([])
  const [exchangeRate, setExchangeRate] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedVehicles()
  }, [])

  const fetchFeaturedVehicles = async () => {
    try {
      const [vehiclesRes, rateRes] = await Promise.all([
        supabase
          .from('vehicles')
          .select('*, vehicle_images(*)')
          .eq('featured', true)
          .order('created_at', { ascending: false })
          .limit(6),
        supabase
          .from('exchange_rates')
          .select('usd_to_dop')
          .order('updated_at', { ascending: false })
          .limit(1)
      ])

      if (vehiclesRes.data) setVehicles(vehiclesRes.data)
      if (rateRes.data && rateRes.data.length > 0) {
        setExchangeRate(rateRes.data[0].usd_to_dop)
      }
    } catch (err) {
      console.error('Error fetching featured vehicles:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading || vehicles.length === 0) return null

  return (
    <section className="featured-vehicles">
      <div className="container">
        <div className="featured-vehicles__header">
          <div className="tagline">SELECCION PREMIUM</div>
          <h2 className="section-title">Vehículos Destacados</h2>
        </div>

        <div className="featured-vehicles__grid">
          {vehicles.map(vehicle => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              exchangeRate={exchangeRate}
            />
          ))}
        </div>

        <div className="featured-vehicles__cta">
          <Link to="/inventario" className="btn btn-primary">
            Ver Todo el Inventario
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedVehicles
