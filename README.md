<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Cuenta Regresiva

Aplicación React + Vite para crear una cuenta regresiva hacia una fecha/hora futura. Puedes describir el evento con lenguaje natural (por ejemplo, `crea una sesion de devops para el miercoles a la 10 am`) o configurarlo manualmente.

## Requisitos

- Node.js (versión 18 o superior recomendada)
- npm (incluido con Node.js)

## Ejecutar en Local

```powershell
# 1. Instalar dependencias
npm install

# 2. Ejecutar en modo desarrollo (levanta Vite)
npm run dev
```

Luego abre el navegador en la URL que muestre la consola (normalmente http://localhost:5173).

## Uso
1. Escribe una instrucción como `crea una sesion de devops para el miercoles a la 10 am` y pulsa **Crear desde texto**, o completa la fecha y el nombre manualmente.
2. Revisa el nombre del evento y la fecha interpretada si usaste texto.
3. Cuando termine el conteo, verás el mensaje de lanzamiento.
4. Usa **Crear Nueva Cuenta Regresiva** para reiniciar.

## Desplegar en GitHub Pages

### Opción 1: Automático con GitHub Actions (Recomendado)
1. Sube tu código a un repositorio público de GitHub.
2. Ve a **Settings** → **Pages** en tu repositorio.
3. En **Source**, selecciona **GitHub Actions**.
4. Cada vez que hagas `git push` a la rama `main`, se desplegará automáticamente.
5. Tu app estará disponible en: `https://tu-usuario.github.io/nombre-repositorio`

### Opción 2: Manual 
```powershell
# Instalar gh-pages (solo primera vez)
npm install --save-dev gh-pages

# Desplegar
npm run deploy
```

**Nota**: Cambia `"homepage"` en `package.json` por tu URL real de GitHub Pages.

## Scripts disponibles

- `npm run dev` – inicia el servidor de desarrollo.
- `npm run build` – genera la versión de producción en `dist/`.
- `npm run preview` – sirve la build para verificación local.
- `npm run deploy` – despliega a GitHub Pages (método manual).

## Construir y previsualizar
```powershell
npm run build
npm run preview
```

## Notas
- Ya no se requiere ninguna clave de API ni archivo `.env.local`.
- El reconocimiento por texto entiende `hoy`, `mañana` y días de la semana con formatos horarios como `10 am` o `18:30`.
- Si deseas desplegar, puedes subir la carpeta `dist` a cualquier hosting estático (Netlify, Vercel, GitHub Pages, Azure Static Web Apps, etc.).
- El logo de BBVA se sirve desde `public/bbva-logo.svg`.

---
¡Disfruta creando tus cuentas regresivas! 🎉
