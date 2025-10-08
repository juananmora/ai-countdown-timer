import { GoogleGenAI } from "@google/genai";

// Vite only exposes env vars prefixed with VITE_. Documented variable name:
// VITE_GEMINI_API_KEY
// Users should create a .env.local with: VITE_GEMINI_API_KEY=your_key_here
// Avoid bundling secrets; Vite inlines them at build time.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

let ai: GoogleGenAI | null = null;
if (API_KEY && typeof API_KEY === 'string' && API_KEY.trim().length > 0) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
    // Message in Spanish to match rest of UI
    console.warn("VITE_GEMINI_API_KEY no está definida. Las llamadas a la API de Gemini estarán deshabilitadas y se usará un título genérico.");
}

export const generateEventTitle = async (date: Date): Promise<string> => {
    if (!ai) {
        return "Mi Evento Increíble";
    }
    
    try {
        const prompt = `Genera un título de evento corto y emocionante para una cuenta regresiva para esta fecha: ${date.toLocaleString()}. Por ejemplo, para el 25 de diciembre, podrías decir 'Cuenta Regresiva para Navidad'. Sé creativo y conciso. Responde solo con el texto del título, nada más.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        // Clean up potential quotes and extra whitespace from the response
        return response.text.trim().replace(/^"|"$/g, '');
    } catch (error) {
        console.error("Error generating event title:", error);
        return "Mi Evento Increíble"; // Fallback title
    }
};
