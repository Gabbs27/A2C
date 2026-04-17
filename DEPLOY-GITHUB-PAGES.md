# 🚀 GUÍA DE DESPLIEGUE A GITHUB PAGES

Esta guía te ayudará a desplegar tu sitio A2C INTERNATIONAL en GitHub Pages para que tu cliente pueda verlo.

---

## 📋 PRE-REQUISITOS

✅ Tener una cuenta de GitHub (si no tienes, créala en https://github.com)  
✅ Git instalado en tu computadora  
✅ Los archivos del proyecto ya configurados (hecho ✓)

---

## 🛠️ PASO 1: Instalar gh-pages

En tu terminal, ejecuta:

```bash
npm install
```

Este comando instalará la dependencia `gh-pages` que necesitamos.

---

## 📁 PASO 2: Crear Repositorio en GitHub

### Opción A: Desde la Web de GitHub

1. Ve a https://github.com/new
2. Nombre del repositorio: **`A2C`** (debe coincidir con la carpeta)
3. Descripción: "Sitio web A2C INTERNATIONAL - Sale and Services"
4. Selecciona **Público** (para que GitHub Pages funcione gratis)
5. **NO marques** "Add a README file"
6. Click en **"Create repository"**

### Opción B: Desde la Terminal (si tienes GitHub CLI)

```bash
gh repo create A2C --public --source=. --remote=origin
```

---

## 🔗 PASO 3: Conectar tu Proyecto Local con GitHub

En tu terminal, ejecuta estos comandos **UNO POR UNO**:

```bash
# 1. Inicializar Git (si no está inicializado)
git init

# 2. Agregar todos los archivos
git add .

# 3. Hacer el primer commit
git commit -m "Initial commit: A2C INTERNATIONAL website"

# 4. Conectar con GitHub (reemplaza TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/A2C.git

# 5. Cambiar a la rama main
git branch -M main

# 6. Subir el código a GitHub
git push -u origin main
```

**IMPORTANTE**: En el paso 4, reemplaza `TU_USUARIO` con tu nombre de usuario real de GitHub.

Por ejemplo, si tu usuario es `gabrieldev`, sería:
```bash
git remote add origin https://github.com/gabrieldev/A2C.git
```

---

## 🚀 PASO 4: Desplegar a GitHub Pages

Una vez que hayas subido el código a GitHub, ejecuta:

```bash
npm run deploy
```

Este comando:
1. Construye el proyecto (crea la carpeta `dist/`)
2. Sube los archivos a la rama `gh-pages`
3. GitHub Pages detecta automáticamente los cambios

**Espera 2-3 minutos** para que GitHub Pages procese el sitio.

---

## 🌐 PASO 5: Ver tu Sitio Publicado

Tu sitio estará disponible en:

```
https://TU_USUARIO.github.io/A2C/
```

Por ejemplo:
- Si tu usuario es `gabrieldev`: https://gabrieldev.github.io/A2C/
- Si tu usuario es `a2crd`: https://a2crd.github.io/A2C/

---

## ⚙️ PASO 6: Configurar GitHub Pages (Solo si no funciona automáticamente)

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (⚙️)
3. En el menú lateral, click en **Pages**
4. En **Source**, selecciona **"gh-pages"** como rama
5. Folder: **"/ (root)"**
6. Click en **Save**

---

## 🔄 ACTUALIZAR EL SITIO (Cambios Futuros)

Cada vez que hagas cambios y quieras actualizarlos:

```bash
# 1. Agregar cambios
git add .

# 2. Commit con descripción
git commit -m "Descripción de los cambios"

# 3. Subir a GitHub
git push

# 4. Desplegar nueva versión
npm run deploy
```

---

## ✅ VERIFICACIÓN

Después de desplegar, verifica que todo funcione:

- [ ] El sitio carga correctamente
- [ ] Los colores plateados se ven bien
- [ ] Los botones funcionan
- [ ] El mapa de Google se muestra
- [ ] Los links de teléfono y email funcionan
- [ ] Es responsive en móvil

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Problema: "Error: Permission denied"
**Solución**: 
```bash
git remote set-url origin https://github.com/TU_USUARIO/A2C.git
git push -u origin main
```

### Problema: El sitio no carga estilos
**Solución**: Ya está configurado el `base: '/A2C/'` en `vite.config.js`

### Problema: "gh-pages not found"
**Solución**: 
```bash
npm install gh-pages --save-dev
```

### Problema: 404 en GitHub Pages
**Solución**: 
1. Espera 5 minutos (GitHub tarda en procesar)
2. Verifica en Settings > Pages que la rama sea `gh-pages`
3. Intenta acceder a: `https://TU_USUARIO.github.io/A2C/` (con barra al final)

---

## 📱 COMPARTIR CON EL CLIENTE

Una vez desplegado, comparte el link:

```
🌐 Sitio web: https://TU_USUARIO.github.io/A2C/

📍 A2C INTERNATIONAL
   Avenida 6, Santo Domingo 11114
   República Dominicana
   
📞 Ventas: +1 (829) 447-0259
📧 Email: info@a2cinternational.com
```

---

## 🎉 ¡LISTO!

Tu sitio ahora está en línea y tu cliente puede verlo desde cualquier dispositivo. 

El sitio es:
- ✅ Responsivo (funciona en móvil, tablet y desktop)
- ✅ Rápido (optimizado con Vite)
- ✅ Profesional (diseño plateado metálico)
- ✅ Funcional (todos los links operativos)

---

## 📝 NOTAS IMPORTANTES

1. **El repositorio debe ser público** para usar GitHub Pages gratis
2. **El nombre del repositorio debe ser `A2C`** (como está configurado)
3. **Actualiza el sitio con `npm run deploy`** cada vez que hagas cambios
4. **GitHub Pages es gratis** pero tiene límite de 100GB ancho de banda/mes

---

## 🔐 DOMINIO PERSONALIZADO (Opcional)

Si quieres usar un dominio como `www.a2cinternational.com`:

1. Compra un dominio
2. En Settings > Pages, agrega tu dominio
3. Configura los DNS de tu dominio:
   - Tipo: **CNAME**
   - Host: **www**
   - Valor: **TU_USUARIO.github.io**

---

**¿Necesitas ayuda?** Revisa la documentación oficial:
https://docs.github.com/pages

¡Éxito con tu despliegue! 🚀

