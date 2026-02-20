import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { FiSave, FiX, FiPlus, FiUpload, FiArrowLeft, FiImage, FiLink, FiLoader } from 'react-icons/fi'
import './VehicleFormPage.css'

const COMMON_FEATURES = [
  'A/C',
  'Camara de Reversa',
  'Sunroof',
  'Asientos de Cuero',
  'Bluetooth',
  'Navegacion GPS',
  'Sensores de Estacionamiento',
  'Cruise Control'
]

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

  const [formData, setFormData] = useState(initialFormData)
  const [featureInput, setFeatureInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(isEditing)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Image state
  const [existingImages, setExistingImages] = useState([]) // from DB
  const [newImageFiles, setNewImageFiles] = useState([]) // File objects to upload
  const [newImagePreviews, setNewImagePreviews] = useState([]) // preview URLs
  const [primaryImageIndex, setPrimaryImageIndex] = useState(-1) // index in existingImages, or 'new-{idx}' for new images
  const [primaryType, setPrimaryType] = useState('existing') // 'existing' or 'new'
  const [removedExistingImages, setRemovedExistingImages] = useState([])

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
        setError('Error al cargar el vehiculo.')
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
    if (files.length === 0) return

    const newFiles = [...newImageFiles, ...files]
    setNewImageFiles(newFiles)

    const newPreviews = files.map((file) => URL.createObjectURL(file))
    setNewImagePreviews((prev) => [...prev, ...newPreviews])

    // If no primary set yet, set first image as primary
    if (existingImages.length === 0 && newImageFiles.length === 0 && primaryImageIndex === -1) {
      setPrimaryImageIndex(0)
      setPrimaryType('new')
    }

    // Reset file input
    e.target.value = ''
  }

  const handleRemoveNewImage = (index) => {
    URL.revokeObjectURL(newImagePreviews[index])
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index))
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index))

    if (primaryType === 'new' && primaryImageIndex === index) {
      setPrimaryImageIndex(-1)
    } else if (primaryType === 'new' && primaryImageIndex > index) {
      setPrimaryImageIndex((prev) => prev - 1)
    }
  }

  const handleRemoveExistingImage = async (index) => {
    const image = existingImages[index]
    setRemovedExistingImages((prev) => [...prev, image])
    setExistingImages((prev) => prev.filter((_, i) => i !== index))

    if (primaryType === 'existing' && primaryImageIndex === index) {
      setPrimaryImageIndex(-1)
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
      setImageUrlError('URL no valida. Ingrese una URL completa (ej: https://ejemplo.com/imagen.jpg)')
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
        throw new Error('La URL no apunta a una imagen valida.')
      }

      const blob = await response.blob()
      const extension = contentType.split('/')[1]?.split(';')[0] || 'jpg'
      const fileName = `imported-${Date.now()}.${extension}`
      const file = new File([blob], fileName, { type: blob.type })

      const newFiles = [...newImageFiles, file]
      setNewImageFiles(newFiles)

      const previewUrl = URL.createObjectURL(blob)
      setNewImagePreviews((prev) => [...prev, previewUrl])

      // If no primary set yet, set this image as primary
      if (existingImages.length === 0 && newImageFiles.length === 0 && primaryImageIndex === -1) {
        setPrimaryImageIndex(0)
        setPrimaryType('new')
      }

      setImageUrl('')
      setImageUrlError('')
    } catch (err) {
      console.error('Error importing image from URL:', err)
      setImageUrlError(err.message || 'Error al importar la imagen. Verifique la URL e intente de nuevo.')
    } finally {
      setImageUrlLoading(false)
    }
  }

  // Form validation
  const validateForm = () => {
    if (!formData.brand.trim()) return 'La marca es requerida.'
    if (!formData.model.trim()) return 'El modelo es requerido.'
    if (!formData.year) return 'El año es requerido.'
    if (!formData.price_usd) return 'El precio es requerido.'
    return null
  }

  // Upload images to Supabase Storage
  const uploadImages = async (vehicleId) => {
    const uploadedImages = []

    for (let i = 0; i < newImageFiles.length; i++) {
      const file = newImageFiles[i]
      const fileName = `${vehicleId}/${Date.now()}-${file.name}`

      const { error: uploadError } = await supabase.storage
        .from('vehicle-images')
        .upload(fileName, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        continue
      }

      const { data: { publicUrl } } = supabase.storage
        .from('vehicle-images')
        .getPublicUrl(fileName)

      const isPrimary = primaryType === 'new' && primaryImageIndex === i

      uploadedImages.push({
        vehicle_id: vehicleId,
        image_url: publicUrl,
        display_order: existingImages.length + i,
        is_primary: isPrimary
      })
    }

    return uploadedImages
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

      let vehicleId = id

      if (isEditing) {
        // Update vehicle
        const { error: updateError } = await supabase
          .from('vehicles')
          .update(vehicleData)
          .eq('id', id)

        if (updateError) throw updateError

        // Handle removed existing images
        for (const img of removedExistingImages) {
          // Delete from storage - extract path from URL
          const urlParts = img.image_url.split('/vehicle-images/')
          if (urlParts.length > 1) {
            const storagePath = urlParts[1]
            await supabase.storage.from('vehicle-images').remove([storagePath])
          }

          // Delete from DB
          await supabase
            .from('vehicle_images')
            .delete()
            .eq('id', img.id)
        }

        // If primary changed among existing images, update
        if (primaryType === 'existing' && primaryImageIndex >= 0) {
          // Reset all existing images to not primary
          await supabase
            .from('vehicle_images')
            .update({ is_primary: false })
            .eq('vehicle_id', id)

          // Set the selected one as primary
          if (existingImages[primaryImageIndex]) {
            await supabase
              .from('vehicle_images')
              .update({ is_primary: true })
              .eq('id', existingImages[primaryImageIndex].id)
          }
        } else if (primaryType === 'new' || existingImages.length === 0) {
          // Reset all existing images to not primary (new primary will be among uploaded)
          await supabase
            .from('vehicle_images')
            .update({ is_primary: false })
            .eq('vehicle_id', id)
        }
      } else {
        // Create vehicle
        const { data: newVehicle, error: insertError } = await supabase
          .from('vehicles')
          .insert(vehicleData)
          .select('id')
          .single()

        if (insertError) throw insertError
        vehicleId = newVehicle.id
      }

      // Upload new images
      if (newImageFiles.length > 0) {
        const uploadedImages = await uploadImages(vehicleId)

        if (uploadedImages.length > 0) {
          // If no primary was set among existing, check if one is set in new
          const hasPrimaryInExisting = primaryType === 'existing' && primaryImageIndex >= 0
          if (!hasPrimaryInExisting && !isEditing && uploadedImages.length > 0) {
            // If creating and no existing images, set first new image as primary if none selected
            const hasPrimaryInNew = uploadedImages.some((img) => img.is_primary)
            if (!hasPrimaryInNew) {
              uploadedImages[0].is_primary = true
            }
          }

          const { error: imgInsertError } = await supabase
            .from('vehicle_images')
            .insert(uploadedImages)

          if (imgInsertError) {
            console.error('Error inserting images:', imgInsertError)
          }
        }
      }

      navigate('/admin')
    } catch (err) {
      console.error('Error saving vehicle:', err)
      setError('Error al guardar el vehiculo. Por favor intente de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (pageLoading) {
    return (
      <div className="vehicle-form-page">
        <div className="form-loading">
          <div className="spinner spinner--dark" />
          <p>Cargando vehiculo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="vehicle-form-page">
      {/* Header */}
      <div className="vehicle-form-header">
        <h1>{isEditing ? 'Editar Vehiculo' : 'Nuevo Vehiculo'}</h1>
        <Link to="/admin" className="back-btn">
          <FiArrowLeft />
          Volver al Panel
        </Link>
      </div>

      <form className="vehicle-form" onSubmit={handleSubmit}>
        {/* Informacion Basica */}
        <div className="form-section">
          <h2>Informacion Basica</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Marca <span className="required">*</span></label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Ej: Toyota"
                required
              />
            </div>
            <div className="form-group">
              <label>Modelo <span className="required">*</span></label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="Ej: Camry"
                required
              />
            </div>
            <div className="form-group">
              <label>Ano <span className="required">*</span></label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="1990"
                max="2026"
                required
              />
            </div>
            <div className="form-group">
              <label>Precio (USD) <span className="required">*</span></label>
              <input
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
              <label>Condicion</label>
              <select name="condition" value={formData.condition} onChange={handleChange}>
                <option value="nuevo">Nuevo</option>
                <option value="usado">Usado</option>
              </select>
            </div>
            <div className="form-group">
              <label>Estado</label>
              <select name="status" value={formData.status} onChange={handleChange}>
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
              <label>Kilometraje</label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                placeholder="Ej: 45000"
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Combustible</label>
              <select name="fuel_type" value={formData.fuel_type} onChange={handleChange}>
                <option value="gasolina">Gasolina</option>
                <option value="diesel">Diesel</option>
                <option value="electrico">Electrico</option>
                <option value="hibrido">Hibrido</option>
              </select>
            </div>
            <div className="form-group">
              <label>Transmision</label>
              <select name="transmission" value={formData.transmission} onChange={handleChange}>
                <option value="automatica">Automatica</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            <div className="form-group">
              <label>Motor</label>
              <input
                type="text"
                name="engine"
                value={formData.engine}
                onChange={handleChange}
                placeholder="3.5L V6"
              />
            </div>
            <div className="form-group">
              <label>Tipo de Carroceria</label>
              <select name="body_type" value={formData.body_type} onChange={handleChange}>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="pickup">Pickup</option>
                <option value="coupe">Coupe</option>
                <option value="convertible">Convertible</option>
                <option value="van">Van</option>
                <option value="truck">Truck</option>
              </select>
            </div>
            <div className="form-group">
              <label>Color</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="Ej: Negro"
              />
            </div>
            <div className="form-group">
              <label>Color Interior</label>
              <input
                type="text"
                name="interior_color"
                value={formData.interior_color}
                onChange={handleChange}
                placeholder="Ej: Beige"
              />
            </div>
            <div className="form-group">
              <label>Puertas</label>
              <input
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

        {/* Descripcion */}
        <div className="form-section">
          <h2>Descripcion</h2>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Descripcion</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Descripcion detallada del vehiculo..."
              />
            </div>

            <div className="form-group full-width">
              <label>Caracteristicas</label>
              <div className="features-input-row">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={handleFeatureKeyDown}
                  placeholder="Agregar caracteristica..."
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
                      <button type="button" onClick={() => handleRemoveFeature(feature)}>
                        <FiX />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="common-features">
                <div className="common-features-label">Caracteristicas comunes:</div>
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
              <label>Historial del Vehiculo</label>
              <textarea
                name="vehicle_history"
                value={formData.vehicle_history}
                onChange={handleChange}
                rows={3}
                placeholder="Historial de propietarios, accidentes, etc."
              />
            </div>

            <div className="form-group full-width">
              <label>Notas de Inspeccion</label>
              <textarea
                name="inspection_notes"
                value={formData.inspection_notes}
                onChange={handleChange}
                rows={3}
                placeholder="Notas de la inspeccion del vehiculo..."
              />
            </div>
          </div>
        </div>

        {/* Configuracion */}
        <div className="form-section">
          <h2>Configuracion</h2>
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
                <label htmlFor="featured">Mostrar en pagina principal</label>
              </div>
            </div>
            <div className="form-group">
              <label>VIN</label>
              <input
                type="text"
                name="vin"
                value={formData.vin}
                onChange={handleChange}
                placeholder="Numero de identificacion"
              />
            </div>
            <div className="form-group">
              <label>Ubicacion</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Santo Domingo, RD"
              />
            </div>
            <div className="form-group full-width">
              <label>Instagram URL</label>
              <input
                type="text"
                name="instagram_url"
                value={formData.instagram_url}
                onChange={handleChange}
                placeholder="https://instagram.com/p/..."
              />
            </div>
          </div>
        </div>

        {/* Imagenes */}
        <div className="form-section">
          <h2>Imagenes</h2>
          <div className="image-upload-area">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
            />
            <div className="image-upload-icon">
              <FiImage />
            </div>
            <div className="image-upload-text">
              <span>Click para seleccionar</span> o arrastra imagenes aqui
            </div>
          </div>

          {/* Import from URL */}
          <div className="image-url-import">
            <label className="image-url-label">
              <FiLink />
              Importar imagen desde URL
            </label>
            <div className="image-url-input-row">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => { setImageUrl(e.target.value); setImageUrlError('') }}
                placeholder="https://example.com/image.jpg"
                className="image-url-input"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleImportFromUrl() } }}
              />
              <button
                type="button"
                className="image-url-btn"
                onClick={handleImportFromUrl}
                disabled={imageUrlLoading || !imageUrl.trim()}
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
              <div className="image-url-error">{imageUrlError}</div>
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
        {error && <div className="form-error">{error}</div>}

        {/* Submit */}
        <div className="form-submit-section">
          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? (
              <>Guardando...</>
            ) : (
              <>
                <FiSave />
                {isEditing ? 'Actualizar Vehiculo' : 'Guardar Vehiculo'}
              </>
            )}
          </button>
          <Link to="/admin" className="cancel-btn">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}

export default VehicleFormPage
