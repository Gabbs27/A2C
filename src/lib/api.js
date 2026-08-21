// Acceso a datos de la web pública. Toda lectura intenta Supabase y, si el
// backend no está configurado o no responde, sirve el inventario de
// demostración para que el sitio nunca se muestre vacío ni roto.
// Las escrituras (admin) NO pasan por aquí: van directo a Supabase.

import { supabase, isSupabaseConfigured } from './supabase'
import {
  DEMO_VEHICLES,
  DEMO_EXCHANGE_RATE,
  getDemoVehicleById,
} from './demoData'

// Un backend que acepta la conexión pero nunca responde (proyecto Supabase
// saliendo de pausa, o saturado) no rechaza la promesa: sin corte, el catch
// de cada función no llegaría a ejecutarse nunca y la página se quedaría en
// skeletons indefinidamente. Con abortSignal el fetch se aborta, postgrest
// lo devuelve como { error } y el fallback a demo sí se activa.
const REQUEST_TIMEOUT_MS = 8000

const withTimeout = (query) =>
  query.abortSignal(AbortSignal.timeout(REQUEST_TIMEOUT_MS))

const sortImages = (vehicle) => ({
  ...vehicle,
  vehicle_images: [...(vehicle.vehicle_images || [])].sort(
    (a, b) => (a.display_order || 0) - (b.display_order || 0)
  ),
})

async function fetchRate() {
  const { data, error } = await withTimeout(
    supabase
      .from('exchange_rates')
      .select('usd_to_dop')
      .order('updated_at', { ascending: false })
      .limit(1)
  )
  // Si la consulta falla (timeout incluido) devolvemos null en vez de la tasa
  // demo: la UI oculta el precio en DOP antes que convertirlo con una tasa
  // inventada sobre vehículos reales. Tabla vacía sí usa la tasa por defecto.
  if (error) return null
  return data?.[0]?.usd_to_dop || DEMO_EXCHANGE_RATE
}

export async function fetchInventory() {
  if (isSupabaseConfigured) {
    try {
      const [vehiclesRes, rate] = await Promise.all([
        withTimeout(
          supabase
            .from('vehicles')
            .select('*, vehicle_images(*)')
            .order('created_at', { ascending: false })
        ),
        fetchRate(),
      ])
      if (!vehiclesRes.error) {
        return {
          vehicles: (vehiclesRes.data || []).map(sortImages),
          exchangeRate: rate,
          demo: false,
        }
      }
    } catch {
      // backend inaccesible: caer a demo
    }
  }
  return {
    vehicles: DEMO_VEHICLES,
    exchangeRate: DEMO_EXCHANGE_RATE,
    demo: true,
  }
}

export async function fetchFeatured(limit = 5) {
  if (isSupabaseConfigured) {
    try {
      const [vehiclesRes, rate] = await Promise.all([
        withTimeout(
          supabase
            .from('vehicles')
            .select('*, vehicle_images(*)')
            .eq('featured', true)
            .order('created_at', { ascending: false })
            .limit(limit)
        ),
        fetchRate(),
      ])
      if (!vehiclesRes.error) {
        return {
          vehicles: (vehiclesRes.data || []).map(sortImages),
          exchangeRate: rate,
          demo: false,
        }
      }
    } catch {
      // backend inaccesible: caer a demo
    }
  }
  return {
    vehicles: DEMO_VEHICLES.filter((v) => v.featured).slice(0, limit),
    exchangeRate: DEMO_EXCHANGE_RATE,
    demo: true,
  }
}

export async function fetchVehicleDetail(id) {
  // Los ids del inventario demo solo existen localmente
  if (id?.startsWith('demo-') || !isSupabaseConfigured) {
    const vehicle = getDemoVehicleById(id)
    return {
      vehicle,
      exchangeRate: DEMO_EXCHANGE_RATE,
      demo: true,
      notFound: !vehicle,
    }
  }
  try {
    const [vehicleRes, rate] = await Promise.all([
      withTimeout(
        supabase.from('vehicles').select('*, vehicle_images(*)').eq('id', id).single()
      ),
      fetchRate(),
    ])
    if (vehicleRes.error && vehicleRes.error.code !== 'PGRST116') {
      throw new Error(vehicleRes.error.message)
    }
    return {
      vehicle: vehicleRes.data ? sortImages(vehicleRes.data) : null,
      exchangeRate: rate,
      demo: false,
      notFound: !vehicleRes.data,
    }
  } catch {
    const vehicle = getDemoVehicleById(id)
    return {
      vehicle,
      exchangeRate: DEMO_EXCHANGE_RATE,
      demo: true,
      notFound: !vehicle,
    }
  }
}

export async function fetchRelated(vehicle, limit = 4) {
  const fallback = () =>
    DEMO_VEHICLES.filter(
      (v) =>
        v.id !== vehicle.id &&
        (v.brand === vehicle.brand || v.body_type === vehicle.body_type)
    ).slice(0, limit)

  if (vehicle.id?.startsWith('demo-') || !isSupabaseConfigured) {
    return { vehicles: fallback(), demo: true }
  }
  try {
    // PostgREST: comillas dobles evitan que comas/parénts. en los valores
    // rompan la expresión .or()
    const quote = (v) => `"${String(v).replace(/"/g, '\\"')}"`
    const { data, error } = await withTimeout(
      supabase
        .from('vehicles')
        .select('*, vehicle_images(*)')
        .neq('id', vehicle.id)
        .or(`brand.eq.${quote(vehicle.brand)},body_type.eq.${quote(vehicle.body_type)}`)
        .eq('status', 'disponible')
        .limit(limit)
    )
    if (error) throw new Error(error.message)
    return { vehicles: (data || []).map(sortImages), demo: false }
  } catch {
    return { vehicles: fallback(), demo: true }
  }
}

export async function fetchVehiclesByIds(ids) {
  if (!ids.length) {
    return { vehicles: [], exchangeRate: DEMO_EXCHANGE_RATE, demo: false }
  }
  const demoOnly = ids.every((id) => id.startsWith('demo-'))
  if (demoOnly || !isSupabaseConfigured) {
    return {
      vehicles: ids.map(getDemoVehicleById).filter(Boolean),
      exchangeRate: DEMO_EXCHANGE_RATE,
      demo: true,
    }
  }
  try {
    const [vehiclesRes, rate] = await Promise.all([
      withTimeout(
        supabase.from('vehicles').select('*, vehicle_images(*)').in('id', ids)
      ),
      fetchRate(),
    ])
    if (vehiclesRes.error) throw new Error(vehiclesRes.error.message)
    return {
      vehicles: (vehiclesRes.data || []).map(sortImages),
      exchangeRate: rate,
      demo: false,
    }
  } catch {
    return {
      vehicles: ids.map(getDemoVehicleById).filter(Boolean),
      exchangeRate: DEMO_EXCHANGE_RATE,
      demo: true,
    }
  }
}
