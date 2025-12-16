# A2C Internacional - Sitio Web de Vehículos de Lujo

Sitio web moderno y elegante para A2C Internacional, inspirado en el diseño premium de concesionarios de vehículos de lujo.

## 🚀 Características

- **Diseño Moderno y Responsivo**: Optimizado para todos los dispositivos
- **Hero Slider Dinámico**: Carrusel automático de imágenes con navegación
- **Secciones Interactivas**: Compra, Venta y Servicio de vehículos
- **Animaciones Suaves**: Transiciones y efectos visuales atractivos
- **Navegación Intuitiva**: Header sticky con menú móvil
- **UI/UX Premium**: Diseño inspirado en marcas de lujo

## 🛠️ Tecnologías

- **React 18.3**: Biblioteca JavaScript para interfaces de usuario
- **Vite 5.2**: Build tool rápido y moderno
- **React Icons**: Iconos modernos y escalables
- **CSS3**: Estilos personalizados con variables CSS y animaciones

## 📦 Instalación

1. **Instalar dependencias**:
```bash
npm install
```

2. **Iniciar servidor de desarrollo**:
```bash
npm run dev
```

3. **Abrir en el navegador**:
El sitio estará disponible en `http://localhost:5173`

## 🏗️ Estructura del Proyecto

```
A2C/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navegación principal
│   │   ├── Header.css
│   │   ├── Hero.jsx            # Slider principal
│   │   ├── Hero.css
│   │   ├── Welcome.jsx         # Sección de bienvenida
│   │   ├── Welcome.css
│   │   ├── Services.jsx        # Servicios (Comprar/Vender/Servicio)
│   │   ├── Services.css
│   │   ├── Features.jsx        # Características destacadas
│   │   ├── Features.css
│   │   ├── Footer.jsx          # Pie de página
│   │   └── Footer.css
│   ├── App.jsx                 # Componente principal
│   ├── App.css
│   ├── main.jsx               # Punto de entrada
│   └── index.css              # Estilos globales
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 Paleta de Colores

- **Primario**: #1a1a1a (Negro)
- **Secundario**: #d4af37 (Dorado)
- **Acento**: #c89f3c (Dorado oscuro)
- **Fondo claro**: #f8f8f8
- **Fondo oscuro**: #0a0a0a

## 📱 Responsive Design

El sitio está optimizado para:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

## 🚀 Build para Producción

Para crear una versión optimizada para producción:

```bash
npm run build
```

Los archivos se generarán en la carpeta `dist/`.

Para previsualizar el build:

```bash
npm run preview
```

## 🎯 Funcionalidades Implementadas

✅ Header con navegación sticky y menú móvil  
✅ Hero slider con cambio automático de imágenes  
✅ Sección de bienvenida con CTAs  
✅ Cards de servicios (Comprar, Vender, Servicio)  
✅ Sección de características destacadas  
✅ Footer completo con información de contacto  
✅ Diseño 100% responsive  
✅ Animaciones y transiciones suaves  
✅ Optimización de rendimiento  

## 📝 Personalización

### Cambiar Imágenes del Slider

Edita el archivo `src/components/Hero.jsx` y modifica el array `slides`:

```javascript
const slides = [
  {
    title: 'Tu título',
    subtitle: 'Tu subtítulo',
    description: 'Tu descripción',
    image: 'URL_DE_TU_IMAGEN'
  },
  // ... más slides
]
```

### Modificar Colores

Edita las variables CSS en `src/index.css`:

```css
:root {
  --primary-color: #1a1a1a;
  --secondary-color: #d4af37;
  /* ... más colores */
}
```

### Actualizar Información de Contacto

Edita `src/components/Footer.jsx` y `src/components/Header.jsx` con tu información.

## 📄 Licencia

Este proyecto es privado y pertenece a A2C Internacional.

## 👨‍💻 Desarrollo

Desarrollado con ❤️ para A2C Internacional

---

**Nota**: Este sitio web está inspirado en diseños premium de concesionarios de vehículos de lujo y ha sido adaptado específicamente para A2C Internacional.



