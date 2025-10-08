/// <reference types="vite/client" />

// Declaración del tipo para la variable de entorno utilizada.
interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Fallback para evitar error de tipos si @google/genai no exporta tipos (debería traerlos, pero por si acaso):
// declare module '@google/genai';
