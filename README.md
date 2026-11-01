<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb0-6e31a0763ed6" />
</div>

# Cuenta Regresiva

Aplicación React + Vite para crear una cuenta regresiva hacia una fecha y hora futuras. El nombre del evento se introduce manualmente; la generación de títulos con IA ya no forma parte de la aplicación. Los logos de BBVA y Copilot se muestran únicamente con fines visuales.

## Requisitos

- Node.js 18 o superior (se recomienda Node.js 20 para el despliegue automatizado).
- npm, incluido con Node.js.

## Ejecutar en local

```bash
# Instalar dependencias
npm install

# Iniciar Vite en modo desarrollo
npm run dev
```

Abre `http://localhost:3000` (o la URL que muestre la consola) en el navegador.

## Uso

1. Selecciona una fecha y hora futuras.
2. Escribe el nombre del evento.
3. Pulsa **Iniciar Cuenta Regresiva**.
4. Cuando termine el conteo, aparecerá el mensaje **¡LANZADO!**.
5. Pulsa **Crear Nueva Cuenta Regresiva** para reiniciar.

## Desplegar en GitHub Pages

### Opción 1: GitHub Actions (recomendada)

El repositorio incluye un workflow en `.github/workflows/deploy.yml` que construye y publica la aplicación automáticamente al hacer `push` a la rama `main`. También puede iniciarse manualmente desde **Actions** mediante **Run workflow**.

Para habilitarlo:

1. Sube el código a un repositorio público de GitHub.
2. Ve a **Settings** → **Pages**.
3. En **Build and deployment**, selecciona **GitHub Actions** como fuente.
4. Después de una ejecución correcta, la aplicación estará disponible en `https://juananmora.github.io/ai-countdown-timer/` (o en la URL correspondiente a tu usuario y repositorio).

### Opción 2: Despliegue manual

Instala `gh-pages` una sola vez y ejecuta el script incluido:

```bash
npm install --save-dev gh-pages
npm run deploy
```

Si utilizas otro repositorio, actualiza la propiedad `homepage` de `package.json` y el valor `base` de `vite.config.ts` para que coincidan con su URL de GitHub Pages.

## Scripts disponibles

- `npm run dev`: inicia el servidor de desarrollo en el puerto 3000.
- `npm run build`: genera la versión de producción en `dist/`.
- `npm run preview`: sirve localmente la build de producción.
- `npm run deploy`: construye `dist/` y la publica mediante `gh-pages`.

## Configuración

La aplicación no necesita una clave de API ni un archivo `.env.local` para crear cuentas regresivas. Puedes publicar la carpeta `dist/` en cualquier hosting estático compatible, como Netlify, Vercel o Azure Static Web Apps.

---

¡Disfruta creando tus cuentas regresivas! 🎉
