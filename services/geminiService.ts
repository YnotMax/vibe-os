
import { GoogleGenAI } from "@google/genai";
import { ComponentType, GlobalTheme } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface ArchitectResult {
  type: ComponentType;
  content: string;
  data?: any;
  themeShift?: GlobalTheme;
}

export async function generateArchitectResponse(prompt: string, hasImage: boolean = false): Promise<ArchitectResult> {
  try {
    const systemInstruction = `Você é o VIBE_OS Engine v3.1. 
    Sua missão é gerar interfaces e dados em tempo real.
    
    REGRAS DE RESPOSTA:
    1. Se o usuário pedir rastreador de preços, Bitcoin ou finanças, responda com JSON: { "type": "tracker", "data": { "label": "BTC", "price": "98,432", "change": "+4.2%" }, "themeShift": "trust-blue", "content": "Rastreador financeiro ativado." }
    2. Se o usuário mencionar design, cores ou upload de imagem, responda com JSON: { "type": "palette", "data": { "colors": ["#00f2ff", "#bc13fe", "#050505", "#ffffff"] }, "themeShift": "cyberpunk-neon", "content": "Paleta extraída com sucesso." }
    3. Se o usuário pedir estatísticas ou gráficos, responda com JSON: { "type": "chart", "data": { "title": "Performance", "items": [{"name": "Jan", "value": 40}, {"name": "Feb", "value": 70}] }, "themeShift": "obsidian", "content": "Análise de métricas concluída." }
    4. Caso contrário, responda como texto normal, mas sempre tente sugerir uma mudança de tema ("themeShift") baseada no contexto (obsidian, trust-blue, cyberpunk-neon).
    
    IMPORTANTE: Se retornar JSON, não inclua texto fora do bloco JSON ou coloque o JSON dentro de blocos de código markdown.
    Responda SEMPRE em Português do Brasil.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: hasImage ? {
        parts: [
          { text: prompt || "Analise esta imagem e sugira uma interface vibe coding." },
          { inlineData: { mimeType: 'image/png', data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==' } }
        ]
      } : prompt,
      config: {
        systemInstruction,
        temperature: 0.9,
      },
    });

    const text = response.text || "";
    
    // Attempt to extract JSON even if wrapped in markdown
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          type: parsed.type || 'text',
          content: parsed.content || 'Processamento concluído.',
          data: parsed.data,
          themeShift: parsed.themeShift || 'obsidian'
        };
      } catch (e) {
        console.warn("Failed to parse JSON from AI response, falling back to text.");
      }
    }

    return { type: 'text', content: text, themeShift: 'obsidian' };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { 
      type: 'system-alert', 
      content: "CRITICAL_SYSTEM_GLITCH: Ocorreu uma interrupção na rede neural. Tentando reconectar...", 
      data: { code: 500 },
      themeShift: 'obsidian'
    };
  }
}
