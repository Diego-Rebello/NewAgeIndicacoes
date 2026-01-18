
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult, MacroCategory } from "../types";

const apiKey = process.env.API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
}

export const analyzeProviderService = async (
  name: string,
  description: string
): Promise<AIAnalysisResult> => {
  if (!aiClient) {
    console.warn("Gemini API Key not found. Using fallback categorization.");
    return {
      category: MacroCategory.OTHER,
      suggestedTags: ['novo', 'serviço']
    };
  }

  const prompt = `
    Analise as informações do prestador de serviço para categorizá-lo em uma das Macro Categorias do Condomínio New Age e gerar tags relevantes.
    
    Nome: ${name}
    Descrição: ${description}

    Macro Categorias e Exemplos:
    - ${MacroCategory.HOME_REPAIRS}: Eletricista, Encanador, Pintor, Pedreiro, Marceneiro, Ar Condicionado, Vidraceiro, Gesseiro, Marido de Aluguel.
    - ${MacroCategory.CLEANING}: Diarista, Limpeza de Sofá, Limpeza de Vidros, Higienização, Lavanderia.
    - ${MacroCategory.VEHICLES}: Mecânica, Auto Elétrica, Lava Car, Guincho, Borracharia.
    - ${MacroCategory.BEAUTY_HEALTH}: Cabeleireiro, Manicure, Massagem, Personal Trainer, Psicólogo, Médico, Dentista.
    - ${MacroCategory.FOOD}: Marmitas, Bolos, Buffet, Kit Festa, Doces, Delivery.
    - ${MacroCategory.PROFESSIONALS}: Contador, Advogado, Veterinário, Designer, Aulas Particulares, TI.
    - ${MacroCategory.OTHER}: Outros casos.

    Regras:
    1. Selecione exatamente uma categoria da lista acima.
    2. Gere 3 a 5 tags curtas em português (minúsculas) que descrevam o serviço.
    3. Retorne no formato JSON.
  `;

  try {
    const response = await aiClient.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              enum: Object.values(MacroCategory),
              description: "A melhor macro categoria para o serviço"
            },
            suggestedTags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Lista de tags sugeridas"
            }
          },
          required: ["category", "suggestedTags"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("AI response empty");
    return JSON.parse(resultText) as AIAnalysisResult;

  } catch (error) {
    console.error("Gemini analysis error:", error);
    return {
      category: MacroCategory.OTHER,
      suggestedTags: ['serviço', 'geral']
    };
  }
};
