
import { GoogleGenAI } from "@google/genai";

// Always initialize with the named parameter and direct process.env.API_KEY reference.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateArchitectResponse(prompt: string) {
  try {
    // Using gemini-3-pro-preview for complex architectural and logic-heavy tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: `Você é o VIBE_OS Architect. Suas respostas devem ser precisas, futuristas e em Português do Brasil. 
        Se o usuário pedir estatísticas, vendas ou dados analíticos, responda obrigatoriamente em formato JSON para que eu possa renderizar um gráfico Recharts. 
        Formato JSON esperado: { "type": "chart", "title": "Título", "data": [{ "name": "A", "value": 10 }] }. 
        Caso contrário, responda como um assistente de IA avançado de 2026.`,
        temperature: 0.7,
      },
    });

    // Access the extracted string directly via the .text property (not a method).
    const text = response.text || "";
    
    // Try to parse JSON if the model sent a block
    if (text.includes('{') && text.includes('}')) {
      try {
        const jsonMatch = text.match(/\{.*\}/s);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          // Return a structure that satisfies the ArchitectMode component's Message interface expectations.
          if (parsed && parsed.type === 'chart') {
            return {
              type: 'chart',
              content: 'Sintetizando visualização de dados do Architect...',
              data: parsed
            };
          }
        }
      } catch (e) {
        // Fallback to text content if parsing fails.
        return { type: 'text', content: text };
      }
    }

    return { type: 'text', content: text };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { type: 'text', content: "Erro ao processar sua requisição. Verifique sua conexão com a Vibe." };
  }
}
