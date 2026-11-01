<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Cuenta Regresiva

Aplicación React + Vite para crear una cuenta regresiva hacia una fecha/hora futura. El título del evento lo escribes tú manualmente (se eliminó la generación con IA). Se muestran logos de BBVA y Copilot únicamente con fines visuales.

## Revisión — 1 de noviembre de 2026

### Flujo y orquestación de la aplicación

1. `index.html` proporciona el elemento `root`; `index.tsx` monta `App` dentro de React Strict Mode.
2. `App.tsx` muestra el formulario inicial. El usuario elige una fecha futura y escribe el nombre del evento. La aplicación valida ambos datos antes de iniciar; si falta alguno o la fecha ya pasó, muestra un error y no empieza la cuenta atrás.
3. Al iniciar, `App` guarda la fecha objetivo y activa el modo de cuenta atrás. El hook `hooks/useCountdown.ts` calcula el tiempo restante y lo actualiza cada segundo; al cambiar o desactivar la fecha, limpia el intervalo anterior.
4. `App` presenta días, horas, minutos y segundos mediante `components/TimeUnit.tsx`. Cuando el tiempo llega a cero, muestra «¡LANZADO!». El botón para crear otra cuenta atrás limpia los datos y vuelve al formulario.
5. Vite ejecuta la aplicación en desarrollo (`npm run dev`) o genera los recursos estáticos de producción (`npm run build`, en `dist/`). No hay un servidor propio ni un flujo de orquestación de servicios Relay en esta aplicación.

### Alcance de la factoría Relay

En este repositorio no aparecen una factoría Relay, su orquestador, agentes, colas, configuración ni documentación de sus fases. Por tanto, no es posible describir de forma fiable «todo el proceso» de esa factoría a partir de este código. Lo único relacionado con servicios que existe es `services/geminiService.ts`, pero `App.tsx` no lo importa ni lo utiliza; la generación de títulos por IA no forma parte del flujo activo. Para documentar Relay con sus pasos y responsabilidades reales hace falta el repositorio o la especificación de esa factoría.

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
1. Selecciona una fecha y hora futura.
2. Escribe el nombre de tu evento.
3. Pulsa "Iniciar Cuenta Regresiva".
4. Cuando termine el conteo, verás el mensaje de lanzamiento.
5. Usa "Crear Nueva Cuenta Regresiva" para reiniciar.

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
- Si deseas desplegar, puedes subir la carpeta `dist` a cualquier hosting estático (Netlify, Vercel, GitHub Pages, Azure Static Web Apps, etc.).
 - El logo de BBVA se sirve desde `public/bbva-logo.svg`.

---
¡Disfruta creando tus cuentas regresivas! 🎉
