# Descripción del proyecto

## Cuenta Regresiva

Cuenta Regresiva es una aplicación web de una sola página para configurar y mostrar una cuenta atrás hasta un evento. La persona usuaria elige una fecha y hora futuras, escribe el nombre del evento y ve el tiempo restante en días, horas, minutos y segundos. Al llegar a la fecha establecida, la aplicación muestra el mensaje «¡LANZADO!». También permite volver al formulario para crear otra cuenta atrás.

La interfaz está en español y tiene un diseño adaptable con fondo animado, tipografía y elementos visuales de estilo tecnológico. Los logotipos de BBVA y Copilot son elementos visuales; el nombre del evento se introduce manualmente y la cuenta atrás no necesita una clave de API.

## Tecnologías

- React 19 y TypeScript para la interfaz y la lógica.
- Vite para el servidor de desarrollo y la generación de la versión de producción.
- CSS propio, junto con Tailwind CSS y fuentes cargadas desde CDN para la presentación.

## Estructura principal

- `App.tsx`: formulario de configuración, validación de fecha y nombre del evento, y vista de la cuenta atrás.
- `hooks/useCountdown.ts`: hook que actualiza el tiempo restante cada segundo.
- `hooks/countdown.ts`: cálculo del tiempo restante hasta una fecha.
- `components/TimeUnit.tsx`: presentación de cada unidad temporal.
- `types.ts`: tipo de datos del tiempo restante.
- `styles.css` e `index.html`: estilos y recursos visuales de la página.
- `public/` y los archivos gráficos de la raíz: logotipos e imágenes utilizados por la interfaz.

## Ejecutar en local

Requisitos: Node.js 18 o posterior y npm.

```bash
npm install
npm run dev
```

Vite muestra en la terminal la dirección local para abrir la aplicación. Para generar una versión de producción se puede ejecutar `npm run build`; los archivos resultantes se guardan en `dist/`.
