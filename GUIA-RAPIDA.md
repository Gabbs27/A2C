# 🚀 GUÍA RÁPIDA - A2C INTERNATIONAL

## ⚡ Inicio Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar servidor de desarrollo
npm run dev

# 3. Abrir en navegador
# http://localhost:5173/
```

## 🎨 Colores de la Marca

### Usar estos colores EXACTAMENTE:

**Principal - Plata Metálico**
```css
--primary: #C0C0C0
--primary-light: #D8D8D8
--primary-dark: #A8A8A8
```

**Secundario - Negro/Gris Oscuro**
```css
--secondary: #1A1A1A
```

**Acento - Azul (para botones)**
```css
--accent-blue: #3B82F6
--accent-blue-hover: #2563EB
```

## 📝 Cambios Comunes

### 1. Cambiar Texto del Header
**Archivo:** `src/components/Header.jsx`
```jsx
// Línea 45
<h1>A2C <span>INTERNATIONAL</span></h1>
```

### 2. Actualizar Teléfono
**Archivo:** `src/components/Header.jsx` (línea 27)
**Archivo:** `src/components/Footer.jsx` (línea 47)
**Archivo:** `src/components/Contact.jsx` (línea 35)

### 3. Cambiar Imágenes del Hero
**Archivo:** `src/components/Hero.jsx`
```jsx
// Líneas 8-33: Array de slides
const slides = [
  {
    title: 'Tu Título',
    subtitle: 'Tu Subtítulo',
    description: 'Tu Descripción',
    image: 'URL_DE_TU_IMAGEN'
  }
]
```

### 4. Modificar Servicios
**Archivo:** `src/components/Services.jsx`
```jsx
// Líneas 6-28: Array de servicios
const services = [...]
```

### 5. Actualizar Google Maps
**Archivo:** `src/components/Contact.jsx`
```jsx
// Línea 54: Cambiar URL del iframe
src="TU_URL_DE_GOOGLE_MAPS_EMBED"
```

## 🎯 Secciones del Sitio

1. **Header** - Navegación fija en la parte superior
2. **Hero** - Slider de imágenes principal
3. **Welcome** - Sección "Acerca de"
4. **Services** - Servicios principales (3 cards)
5. **Features** - Características destacadas (4 items)
6. **Contact** - Información de contacto + mapa
7. **Footer** - Pie de página con enlaces y contacto

## 🔧 Archivos Importantes

| Archivo | Descripción |
|---------|-------------|
| `src/index.css` | Variables CSS globales (colores, espacios) |
| `src/App.jsx` | Estructura principal de la app |
| `index.html` | Meta tags, título, fuentes |
| `src/components/` | Todos los componentes |

## 📱 Responsive

El sitio es responsive por defecto. Los breakpoints son:

- **Mobile**: 0px - 639px
- **Tablet**: 640px - 1023px
- **Desktop**: 1024px+

## 🚢 Desplegar a Producción

```bash
# 1. Crear build de producción
npm run build

# 2. Los archivos estarán en la carpeta 'dist/'
# 3. Subir carpeta 'dist/' a tu servidor
```

## 💡 Tips Útiles

### Agregar Nuevo Color
1. Ir a `src/index.css`
2. Agregar en `:root { ... }`
3. Usar en cualquier archivo CSS con `var(--tu-color)`

### Agregar Nueva Sección
1. Crear archivo en `src/components/NombreSeccion.jsx`
2. Crear archivo CSS `src/components/NombreSeccion.css`
3. Importar en `src/App.jsx`
4. Agregar componente en el return de App

### Cambiar Fuente
1. Ir a `index.html`
2. Cambiar link de Google Fonts
3. Actualizar `font-family` en `src/index.css`

## 🎨 Efectos Especiales

### Título con Efecto Metálico
```css
.mi-titulo {
  background: linear-gradient(135deg, #FFFFFF 0%, #C0C0C0 50%, #A8A8A8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Sombra Metálica
```css
.mi-elemento {
  box-shadow: 0 4px 12px rgba(192, 192, 192, 0.3), 
              0 2px 6px rgba(192, 192, 192, 0.2);
}
```

## 📞 Contacto

**Ubicación**: Avenida 6, Santo Domingo 11114, República Dominicana  
**Teléfono**: +1 (829) 447-0259  
**Google Maps**: https://maps.app.goo.gl/jV8nB1RSGDy96rbc7

---

**Última actualización**: Diciembre 2025  
**Versión**: 2.0.0

