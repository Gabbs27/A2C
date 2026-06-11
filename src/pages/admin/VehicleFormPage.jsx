import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { FiSave, FiX, FiPlus, FiUpload, FiArrowLeft, FiImage, FiLink, FiLoader } from 'react-icons/fi'
import './VehicleFormPage.css'

const COMMON_FEATURES = [
  'A/C',
  'Cámara de Reversa',
  'Sunroof',
  'Asientos de Cuero',
  'Bluetooth',
  'Navegación GPS',
  'Sensores de Estacionamiento',
  'Cruise Control'
]

const MAX_IMAGE_MB = 10

// Supabase Storage rechaza claves con espacios, acentos o caracteres especiales
const sanitizeFileName = (name) => {
  const dot = name.lastIndexOf('.')
  const rawBase = dot > 0 ? name.slice(0, dot) : name
  const rawExt = dot > 0 ? name.slice(dot + 1) : 'jpg'
  const clean = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  const base = clean(rawBase).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'imagen'
  const ext = clean(rawExt).replace(/[^a-z0-9]/g, '') || 'jpg'
  return `${base}.${ext}`
}

const initialFormData = {
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  price_usd: '',
  condition: 'usado',
  status: 'disponible',
  mileage: '',
  fuel_type: 'gasolina',
  transmission: 'automatica',
  engine: '',
  body_type: 'sedan',
  color: '',
  interior_color: '',
  doors: 4,
  description: '',
  features: [],
  vehicle_history: '',
  inspection_notes: '',
  featured: false,
  vin: '',
  location: 'Santo Domingo, RD',
  instagram_url: ''
}

const VehicleFormPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)
  const maxYear = new Date().getFullYear() + 1

  const [formData, setFormData] = useState(initialFormData)
  const [featureInput, setFeatureInput] = useState('')
  const [pageLoading, setPageLoading] = useState(isEditing)
  const [loadError, setLoadError] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(null)

  // Image state
  const [existingImages, setExistingImages] = useState([]) // from DB
  const [newImageFiles, setNewImageFiles] = useState([]) // File objects to upload
  const [newImagePreviews, setNewImagePreviews] = useState([]) // preview URLs
  const [primaryImageIndex, setPrimaryImageIndex] = useState(-1)
  const [primaryType, setPrimaryType] = useState('existing') // 'existing' or 'new'
  const [removedExistingImages, setRemovedExistingImages] = useState([])
  const [imagesError, setImagesError] = useState('')

  // Si la creación ya pasó pero fallaron subidas, el reintento debe actualizar (no duplicar)
  const createdVehicleIdRef = useRef(null)

  // Image URL import state
  const [imageUrl, setImageUrl] = useState('')
  const [imageUrlLoading, setImageUrlLoading] = useState(false)
  const [imageUrlError, setImageUrlError] = useState('')

  // Fetch existing vehicle data for editing
  useEffect(() => {
    if (!isEditing) return

    const fetchVehicle = async () => {
      setPageLoading(true)
      try {
        const { data: vehicle, error: vehicleError } = await supabase
          .from('vehicles')
          .select('*')
          .eq('id', id)
          .single()

        if (vehicleError) throw vehicleError

        if (vehicle) {
          setFormData({
            brand: vehicle.brand || '',
            model: vehicle.model || '',
            year: vehicle.year || new Date().getFullYear(),
            price_usd: vehicle.price_usd || '',
            condition: vehicle.condition || 'usado',
            status: vehicle.status || 'disponible',
            mileage: vehicle.mileage || '',
            fuel_type: vehicle.fuel_type || 'gasolina',
            transmission: vehicle.transmission || 'automatica',
            engine: vehicle.engine || '',
            body_type: vehicle.body_type || 'sedan',
            color: vehicle.color || '',
            interior_color: vehicle.interior_color || '',
            doors: vehicle.doors || 4,
            description: vehicle.description || '',
            features: vehicle.features || [],
            vehicle_history: vehicle.vehicle_history || '',
            inspection_notes: vehicle.inspection_notes || '',
            featured: vehicle.featured || false,
            vin: vehicle.vin || '',
            location: vehicle.location || 'Santo Domingo, RD',
            instagram_url: vehicle.instagram_url || ''
          })

          // Fetch images
          const { data: images } = await supabase
            .from('vehicle_images')
            .select('*')
            .eq('vehicle_id', id)
            .order('display_order', { ascending: true })

          if (images && images.length > 0) {
            setExistingImages(images)
            const primaryIdx = images.findIndex((img) => img.is_primary)
            if (primaryIdx !== -1) {
              setPrimaryImageIndex(primaryIdx)
              setPrimaryType('existing')
            }
          }
        }
      } catch (err) {
        console.error('Error fetching vehicle:', err)
        setLoadError('No se pudo cargar el vehículo. Es posible que haya sido eliminado o que el enlace no sea válido.')
      } finally {
        setPageLoading(false)
      }
    }

    fetchVehicle()
  }, [id, isEditing])

  // Form field change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Features management
  const handleAddFeature = () => {
    const trimmed = featureInput.trim()
    if (!trimmed) return
    if (formData.features.includes(trimmed)) {
      setFeatureInput('')
      return
    }
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, trimmed]
    }))
    setFeatureInput('')
  }

  const handleFeatureKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddFeature()
    }
  }

  const handleRemoveFeature = (feature) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feature)
    }))
  }

  const handleAddCommonFeature = (feature) => {
    if (formData.features.includes(feature)) return
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, feature]
    }))
  }

  // Image handling
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files)
    e.target.value = ''
    if (files.length === 0) return

    const limit = MAX_IMAGE_MB * 1024 * 1024
    const accepted = files.filter((f) => f.size <= limit)
    const rejected = files.length - accepted.length
    setImagesError(
      rejected > 0
        ? rejected === 1
          ? `1 imagen supera el límite de ${MAX_IMAGE_MB} MB y no se agregó.`
          : `${rejected} imágenes superan el límite de ${MAX_IMAGE_MB} MB y no se agregaron.`
        : ''
    )
    if (accepted.length === 0) return

    const hadNoImages = existingImages.length === 0 && newImageFiles.length === 0
    setNewImageFiles((prev) => [...prev, ...accepted])
    setNewImagePreviews((prev) => [...prev, ...accepted.map((file) => URL.createObjectURL(file))])

    if (hadNoImages && primaryImageIndex === -1) {
      setPrimaryImageIndex(0)
      setPrimaryType('new')
    }
  }

  const handleRemoveNewImage = (index) => {
    URL.revokeObjectURL(newImagePreviews[index])
    const remaining = newImageFiles.length - 1
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index))
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index))

    if (primaryType === 'new' && primaryImageIndex === index) {
      // Se borró la primaria: promover la primera restante
      if (existingImages.length > 0) {
        setPrimaryType('existing')
        setPrimaryImageIndex(0)
      } else if (remaining > 0) {
        setPrimaryType('new')
        setPrimaryImageIndex(0)
      } else {
        setPrimaryImageIndex(-1)
      }
    } else if (primaryType === 'new' && primaryImageIndex > index) {
      setPrimaryImageIndex((prev) => prev - 1)
    }
  }

  const handleRemoveExistingImage = (index) => {
    const image = existingImages[index]
    const remaining = existingImages.length - 1
    setRemovedExistingImages((prev) => [...prev, image])
    setExistingImages((prev) => prev.filter((_, i) => i !== index))

    if (primaryType === 'existing' && primaryImageIndex === index) {
      // Se borró la primaria: promover la primera restante
      if (remaining > 0) {
        setPrimaryImageIndex(0)
      } else if (newImageFiles.length > 0) {
        setPrimaryType('new')
        setPrimaryImageIndex(0)
      } else {
        setPrimaryImageIndex(-1)
      }
    } else if (primaryType === 'existing' && primaryImageIndex > index) {
      setPrimaryImageIndex((prev) => prev - 1)
    }
  }

  const handleSetPrimary = (type, index) => {
    setPrimaryType(type)
    setPrimaryImageIndex(index)
  }

  // Import image from URL
  const handleImportFromUrl = async () => {
    const url = imageUrl.trim()
    if (!url) return

    // Basic URL validation
    try {
      new URL(url)
    } catch {
      setImageUrlError('URL no válida. Ingrese una URL completa (ej: https://ejemplo.com/imagen.jpg)')
      return
    }

    setImageUrlLoading(true)
    setImageUrlError('')

    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Error al descargar la imagen (${response.status})`)
      }

      const contentType = response.headers.get('content-type') || ''
      if (!contentType.startsWith('image/')) {
        throw new Error('La URL no apunta a una imagen válida.')
      }

      const blob = await response.blob()
      if (blob.size > MAX_IMAGE_MB * 1024 * 1024) {
        throw new Error(`La imagen supera el límite de ${MAX_IMAGE_MB} MB.`)
      }
      const extension = contentType.split('/')[1]?.split(';')[0] || 'jpg'
      const fileName = `imported-${Date.now()}.${extension}`
      const file = new File([blob], fileName, { type: blob.type })

      const hadNoImages = existingImages.length === 0 && newImageFiles.length === 0
      setNewImageFiles((prev) => [...prev, file])

      const previewUrl = URL.createObjectURL(blob)
      setNewImagePreviews((prev) => [...prev, previewUrl])

      if (hadNoImages && primaryImageIndex === -1) {
        setPrimaryImageIndex(0)
        setPrimaryType('new')
      }

      setImageUrl('')
      setImageUrlError('')
    } catch (err) {
      console.error('Error importing image from URL:', err)
      if (err instanceof TypeError) {
        // fetch cross-origin bloqueado por CORS en la mayoría de los hosts de imágenes
        setImageUrlError('No se pudo descargar la imagen: el sitio no permite descargas externas. Guarde la imagen en su dispositivo y súbala como archivo.')
      } else {
        setImageUrlError(err.message || 'Error al importar la imagen. Verifique la URL e intente de nuevo.')
      }
    } finally {
      setImageUrlLoading(false)
    }
  }

  // Form validation
  const validateForm = () => {
    if (!formData.brand.trim()) return 'La marca es requerida.'
    if (!formData.model.trim()) return 'El modelo es requerido.'
    if (!formData.year) return 'El año es requerido.'
    const year = parseInt(formData.year, 10)
    if (Number.isNaN(year) || year < 1990 || year > maxYear) {
      return `El año debe estar entre 1990 y ${maxYear}.`
    }
    if (!formData.price_usd) return 'El precio es requerido.'
    const instagramUrl = formData.instagram_url.trim()
    if (instagramUrl) {
      try {
        const parsed = new URL(instagramUrl)
        if (parsed.protocol !== 'https:') throw new Error()
      } catch {
        return 'El enlace de Instagram debe ser una URL válida que comience con https://.'
      }
    }
    return null
  }

  // Upload images to Supabase Storage
  const uploadImages = async (vehicleId) => {
    const uploaded = []
    const failedIndices = []

    for (let i = 0; i < newImageFiles.length; i++) {
      const file = newImageFiles[i]
      setUploadProgress({ current: i + 1, total: newImageFiles.length })
      const path = `${vehicleId}/${Date.now()}-${i}-${sanitizeFileName(file.name)}`

      const { error: uploadError } = await supabase.storage
        .from('vehicle-images')
        .upload(path, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        failedIndices.push(i)
        continue
      }

      const { data: { publicUrl } } = supabase.storage
        .from('vehicle-images')
        .getPublicUrl(path)

      uploaded.push({ originalIndex: i, image_url: publicUrl })
    }

    setUploadProgress(null)
    return { uploaded, failedIndices }
  }

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setSubmitting(true)

    try {
      const vehicleData = {
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        year: parseInt(formData.year),
        price_usd: parseFloat(formData.price_usd),
        condition: formData.condition,
        status: formData.status,
        mileage: formData.mileage ? parseInt(formData.mileage) : null,
        fuel_type: formData.fuel_type,
        transmission: formData.transmission,
        engine: formData.engine.trim() || null,
        body_type: formData.body_type,
        color: formData.color.trim() || null,
        interior_color: formData.interior_color.trim() || null,
        doors: parseInt(formData.doors),
        description: formData.description.trim() || null,
        features: formData.features.length > 0 ? formData.features : null,
        vehicle_history: formData.vehicle_history.trim() || null,
        inspection_notes: formData.inspection_notes.trim() || null,
        featured: formData.featured,
        vin: formData.vin.trim() || null,
        location: formData.location.trim() || null,
        instagram_url: formData.instagram_url.trim() || null
      }

      let vehicleId = id || createdVehicleIdRef.current

      if (vehicleId) {
        // .select().single() hace que un update de cero filas (id inexistente) falle en vez de "guardar" en silencio
        const { error: updateError } = await supabase
          .from('vehicles')
          .update(vehicleData)
          .eq('id', vehicleId)
          .select('id')
          .single()

        if (updateError) throw updateError
      } else {
        const { data: newVehicle, error: insertError } = await supabase
          .from('vehicles')
          .insert(vehicleData)
          .select('id')
          .single()

        if (insertError) throw insertError
        vehicleId = newVehicle.id
        createdVehicleIdRef.current = vehicleId
      }

      // Handle removed existing images
      for (const img of removedExistingImages) {
        const urlParts = img.image_url.split('/vehicle-images/')
        if (urlParts.length > 1) {
          await supabase.storage.from('vehicle-images').remove([urlParts[1]])
        }

        const { error: deleteError } = await supabase
          .from('vehicle_images')
          .delete()
          .eq('id', img.id)

        if (deleteError) throw deleteError
      }

      const totalToUpload = newImageFiles.length
      const { uploaded, failedIndices } = totalToUpload > 0
        ? await uploadImages(vehicleId)
        : { uploaded: [], failedIndices: [] }

      // Reconciliar la primaria: exactamente una entre las imágenes que sobreviven
      let finalPrimary = null
      if (primaryType === 'existing' && existingImages[primaryImageIndex]) {
        finalPrimary = { type: 'existing', id: existingImages[primaryImageIndex].id }
      } else if (primaryType === 'new' && uploaded.some((u) => u.originalIndex === primaryImageIndex)) {
        finalPrimary = { type: 'new', originalIndex: primaryImageIndex }
      }
      if (!finalPrimary) {
        if (existingImages.length > 0) {
          finalPrimary = { type: 'existing', id: existingImages[0].id }
        } else if (uploaded.length > 0) {
          finalPrimary = { type: 'new', originalIndex: uploaded[0].originalIndex }
        }
      }

      // Renumerar las imágenes que quedan para que el orden de galería sea estable
      for (let i = 0; i < existingImages.length; i++) {
        const img = existingImages[i]
        const isPrimary = finalPrimary?.type === 'existing' && finalPrimary.id === img.id
        if (img.display_order !== i || Boolean(img.is_primary) !== isPrimary) {
          const { error: reorderError } = await supabase
            .from('vehicle_images')
            .update({ display_order: i, is_primary: isPrimary })
            .eq('id', img.id)

          if (reorderError) throw reorderError
        }
      }

      let insertedRows = []
      if (uploaded.length > 0) {
        const records = uploaded.map((u, j) => ({
          vehicle_id: vehicleId,
          image_url: u.image_url,
          display_order: existingImages.length + j,
          is_primary: finalPrimary?.type === 'new' && finalPrimary.originalIndex === u.originalIndex
        }))

        const { data: inserted, error: imgInsertError } = await supabase
          .from('vehicle_images')
          .insert(records)
          .select()

        if (imgInsertError) throw imgInsertError
        insertedRows = inserted || []
      }

      if (failedIndices.length > 0) {
        // Quedarse en la página: lo subido pasa a "existente" y solo los fallidos quedan para reintentar
        uploaded.forEach((u) => URL.revokeObjectURL(newImagePreviews[u.originalIndex]))
        const survivors = existingImages.map((img, i) => ({
          ...img,
          display_order: i,
          is_primary: finalPrimary?.type === 'existing' && finalPrimary.id === img.id
        }))
        const merged = [...survivors, ...insertedRows]
        setExistingImages(merged)
        setRemovedExistingImages([])
        setNewImageFiles((prev) => prev.filter((_, i) => failedIndices.includes(i)))
        setNewImagePreviews((prev) => prev.filter((_, i) => failedIndices.includes(i)))
        const primaryIdx = merged.findIndex((img) => img.is_primary)
        setPrimaryType('existing')
        setPrimaryImageIndex(primaryIdx)
        setError(`${failedIndices.length} de ${totalToUpload} imágenes no se pudieron subir. Verifique su conexión e intente guardar de nuevo.`)
        return
      }

      navigate('/admin')
    } catch (err) {
      console.error('Error saving vehicle:', err)
      setError('Error al guardar el vehículo. Por favor intente de nuevo.')
    } finally {
      setSubmitting(false)
      setUploadProgress(null)
    }
  }

  // Cleanup preview URLs on unmount
  const previewsRef = useRef([])
  useEffect(() => {
    previewsRef.current = newImagePreviews
  }, [newImagePreviews])
  useEffect(() => {
    return () => {
      previewsRef.current.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  if (pageLoading) {
    return (
      <div className="vehicle-form-page">
        <div className="vehicle-form-container">
          <div className="form-loading">
            <div className="spinner" />
            <p>Cargando vehículo...</p>
          </div>
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="vehicle-form-page">
        <div className="vehicle-form-container">
          <div className="vehicle-form-header">
            <h1>Editar Vehículo</h1>
          </div>
          <div className="form-load-error">
            <div className="form-error" role="alert">{loadError}</div>
            <Link to="/admin" className="back-btn">
              <FiArrowLeft />
              Volver al Panel
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="vehicle-form-page">
      <div className="vehicle-form-container">
        {/* Header */}
        <div className="vehicle-form-header">
          <h1>{isEditing ? 'Editar Vehículo' : 'Nuevo Vehículo'}</h1>
          <Link to="/admin" className="back-btn">
            <FiArrowLeft />
            Volver al Panel
          </Link>
        </div>

        <form className="vehicle-form" onSubmit={handleSubmit}>
          {/* Información básica */}
          <div className="form-section">
            <h2>Información Básica</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="brand">Marca <span className="required">*</span></label>
                <input
                  id="brand"
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Ej: Toyota"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="model">Modelo <span className="required">*</span></label>
                <input
                  id="model"
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="Ej: Camry"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="year">Año <span className="required">*</span></label>
                <input
                  id="year"
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  min="1990"
                  max={maxYear}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="price_usd">Precio (USD) <span className="required">*</span></label>
                <input
                  id="price_usd"
                  type="number"
                  name="price_usd"
                  value={formData.price_usd}
                  onChange={handleChange}
                  placeholder="Ej: 35000"
                  min="0"
                  step="1"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="condition">Condición</label>
                <select id="condition" name="condition" value={formData.condition} onChange={handleChange}>
                  <option value="nuevo">Nuevo</option>
                  <option value="usado">Usado</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="status">Estado</label>
                <select id="status" name="status" value={formData.status} onChange={handleChange}>
                  <option value="disponible">Disponible</option>
                  <option value="vendido">Vendido</option>
                  <option value="reservado">Reservado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Especificaciones */}
          <div className="form-section">
            <h2>Especificaciones</h2>
            <div className="form-grid-3">
              <div className="form-group">
                <label htmlFor="mileage">Kilometraje</label>
                <input
                  id="mileage"
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  placeholder="Ej: 45000"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label htmlFor="fuel_type">Combustible</label>
                <select id="fuel_type" name="fuel_type" value={formData.fuel_type} onChange={handleChange}>
                  <option value="gasolina">Gasolina</option>
                  <option value="diesel">Diésel</option>
                  <option value="electrico">Eléctrico</option>
                  <option value="hibrido">Híbrido</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="transmission">Transmisión</label>
                <select id="transmission" name="transmission" value={formData.transmission} onChange={handleChange}>
                  <option value="automatica">Automática</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="engine">Motor</label>
                <input
                  id="engine"
                  type="text"
                  name="engine"
                  value={formData.engine}
                  onChange={handleChange}
                  placeholder="3.5L V6"
                />
              </div>
              <div className="form-group">
                <label htmlFor="body_type">Tipo de Carrocería</label>
                <select id="body_type" name="body_type" value={formData.body_type} onChange={handleChange}>
                  <option value="sedan">Sedán</option>
                  <option value="suv">SUV</option>
                  <option value="pickup">Pickup</option>
                  <option value="coupe">Coupé</option>
                  <option value="convertible">Convertible</option>
                  <option value="van">Van</option>
                  <option value="truck">Camión</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="color">Color</label>
                <input
                  id="color"
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="Ej: Negro"
                />
              </div>
              <div className="form-group">
                <label htmlFor="interior_color">Color Interior</label>
                <input
                  id="interior_color"
                  type="text"
                  name="interior_color"
                  value={formData.interior_color}
                  onChange={handleChange}
                  placeholder="Ej: Beige"
                />
              </div>
              <div className="form-group">
                <label htmlFor="doors">Puertas</label>
                <input
                  id="doors"
                  type="number"
                  name="doors"
                  value={formData.doors}
                  onChange={handleChange}
                  min="2"
                  max="6"
                />
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="form-section">
            <h2>Descripción</h2>
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="description">Descripción</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Descripción detallada del vehículo..."
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="feature-input">Características</label>
                <div className="features-input-row">
                  <input
                    id="feature-input"
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={handleFeatureKeyDown}
                    placeholder="Agregar característica..."
                  />
                  <button type="button" className="features-add-btn" onClick={handleAddFeature}>
                    <FiPlus />
                    Agregar
                  </button>
                </div>

                {formData.features.length > 0 && (
                  <div className="features-tags">
                    {formData.features.map((feature) => (
                      <span key={feature} className="feature-tag">
                        {feature}
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(feature)}
                          aria-label={`Quitar ${feature}`}
                        >
                          <FiX />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="common-features">
                  <div className="common-features-label">Características comunes:</div>
                  <div className="common-features-list">
                    {COMMON_FEATURES.filter((f) => !formData.features.includes(f)).map((feature) => (
                      <button
                        key={feature}
                        type="button"
                        className="common-feature-btn"
                        onClick={() => handleAddCommonFeature(feature)}
                      >
                        + {feature}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="vehicle_history">Historial del Vehículo</label>
                <textarea
                  id="vehicle_history"
                  name="vehicle_history"
                  value={formData.vehicle_history}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Historial de propietarios, accidentes, etc."
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="inspection_notes">Notas de Inspección</label>
                <textarea
                  id="inspection_notes"
                  name="inspection_notes"
                  value={formData.inspection_notes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Notas de la inspección del vehículo..."
                />
              </div>
            </div>
          </div>

          {/* Configuración */}
          <div className="form-section">
            <h2>Configuración</h2>
            <div className="form-grid">
              <div className="form-group full-width">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                  />
                  <label htmlFor="featured">Mostrar en página principal</label>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="vin">VIN</label>
                <input
                  id="vin"
                  type="text"
                  name="vin"
                  value={formData.vin}
                  onChange={handleChange}
                  placeholder="Número de identificación"
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">Ubicación</label>
                <input
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Santo Domingo, RD"
                />
              </div>
              <div className="form-group full-width">
                <label htmlFor="instagram_url">Instagram URL</label>
                <input
                  id="instagram_url"
                  type="url"
                  name="instagram_url"
                  value={formData.instagram_url}
                  onChange={handleChange}
                  placeholder="https://instagram.com/p/..."
                />
              </div>
            </div>
          </div>

          {/* Imágenes */}
          <div className="form-section">
            <h2>Imágenes</h2>
            <div className="image-upload-area">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                aria-label="Seleccionar imágenes"
              />
              <div className="image-upload-icon">
                <FiImage />
              </div>
              <div className="image-upload-text">
                <span>Haga clic para seleccionar</span> o arrastre las imágenes aquí
              </div>
            </div>
            {imagesError && (
              <div className="image-upload-error" role="alert">{imagesError}</div>
            )}

            {/* Import from URL */}
            <div className="image-url-import">
              <label className="image-url-label" htmlFor="image-url-input">
                <FiLink />
                Importar imagen desde URL
              </label>
              <div className="image-url-input-row">
                <input
                  id="image-url-input"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => { setImageUrl(e.target.value); setImageUrlError('') }}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="image-url-input"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleImportFromUrl() } }}
                />
                <button
                  type="button"
                  className="image-url-btn"
                  onClick={handleImportFromUrl}
                  disabled={imageUrlLoading || submitting || !imageUrl.trim()}
                >
                  {imageUrlLoading ? (
                    <>
                      <FiLoader className="spin-icon" />
                      Importando...
                    </>
                  ) : (
                    <>
                      <FiUpload />
                      Importar
                    </>
                  )}
                </button>
              </div>
              {imageUrlError && (
                <div className="image-url-error" role="alert">{imageUrlError}</div>
              )}
            </div>

            {(existingImages.length > 0 || newImagePreviews.length > 0) && (
              <div className="image-previews">
                {/* Existing images */}
                {existingImages.map((img, index) => (
                  <div
                    key={`existing-${img.id}`}
                    className={`image-preview-item ${primaryType === 'existing' && primaryImageIndex === index ? 'primary' : ''}`}
                  >
                    <img src={img.image_url} alt={`Imagen ${index + 1}`} />
                    <div className="image-preview-overlay">
                      <label className="image-primary-radio">
                        <input
                          type="radio"
                          name="primary-image"
                          checked={primaryType === 'existing' && primaryImageIndex === index}
                          onChange={() => handleSetPrimary('existing', index)}
                        />
                        Principal
                      </label>
                      <button
                        type="button"
                        className="image-remove-btn"
                        onClick={() => handleRemoveExistingImage(index)}
                        aria-label={`Eliminar imagen ${index + 1}`}
                      >
                        <FiX />
                      </button>
                    </div>
                    {primaryType === 'existing' && primaryImageIndex === index && (
                      <div className="primary-label">Principal</div>
                    )}
                  </div>
                ))}

                {/* New image previews */}
                {newImagePreviews.map((previewUrl, index) => (
                  <div
                    key={`new-${index}`}
                    className={`image-preview-item ${primaryType === 'new' && primaryImageIndex === index ? 'primary' : ''}`}
                  >
                    <img src={previewUrl} alt={`Nueva imagen ${index + 1}`} />
                    <div className="image-preview-overlay">
                      <label className="image-primary-radio">
                        <input
                          type="radio"
                          name="primary-image"
                          checked={primaryType === 'new' && primaryImageIndex === index}
                          onChange={() => handleSetPrimary('new', index)}
                        />
                        Principal
                      </label>
                      <button
                        type="button"
                        className="image-remove-btn"
                        onClick={() => handleRemoveNewImage(index)}
                        aria-label={`Eliminar nueva imagen ${index + 1}`}
                      >
                        <FiX />
                      </button>
                    </div>
                    {primaryType === 'new' && primaryImageIndex === index && (
                      <div className="primary-label">Principal</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error */}
          {error && <div className="form-error" role="alert">{error}</div>}

          {/* Submit */}
          <div className="form-submit-section">
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? (
                uploadProgress
                  ? `Subiendo imagen ${uploadProgress.current} de ${uploadProgress.total}...`
                  : 'Guardando...'
              ) : (
                <>
                  <FiSave />
                  {isEditing ? 'Actualizar Vehículo' : 'Guardar Vehículo'}
                </>
              )}
            </button>
            <Link to="/admin" className="cancel-btn">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default VehicleFormPage
