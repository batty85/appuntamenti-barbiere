import { GoogleGenAI } from "@google/genai";
import { Appointment } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const suggestNextDate = async (
  lastAppointment: Appointment | null,
  frequency: number
): Promise<string> => {
  if (!lastAppointment) {
    return "Non hai appuntamenti passati. Prenota il tuo primo taglio quando vuoi!";
  }

  const prompt = `
    Agisci come un esperto barbiere italiano amichevole.
    L'ultimo taglio del cliente è stato il: ${new Date(lastAppointment.date).toLocaleDateString('it-IT')}.
    La frequenza desiderata è di ${frequency} giorni.
    
    1. Calcola la data ideale per il prossimo taglio.
    2. Dammi una risposta breve (massimo 2 frasi) suggerendo la data e motivando il cliente a mantenere lo stile fresco.
    3. Usa un tono professionale ma simpatico.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Impossibile generare suggerimento.";
  } catch (error) {
    console.error("Gemini suggestion error:", error);
    return "Impossibile calcolare il suggerimento al momento.";
  }
};

export const analyzeCalendarConflict = async (
  proposedDate: Date,
  mockCalendarEvents: string[]
): Promise<string> => {
    const prompt = `
      Sto cercando di prenotare un barbiere per il: ${proposedDate.toLocaleString()}.
      Ecco i miei impegni esistenti: ${mockCalendarEvents.join(", ")}.
      
      C'è un conflitto o una sovrapposizione probabile (considera 1 ora per il taglio)?
      Rispondi solo con un JSON: { "conflict": boolean, "reason": "string" }
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        return response.text || JSON.stringify({ conflict: false, reason: "No response" });
    } catch (error) {
        return JSON.stringify({ conflict: false, reason: "AI Check Failed" });
    }
};