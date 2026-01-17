
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
    - ${MacroCategory.RENOVATION_REPAIR}: Pedreiro, Encanador, Pintor, Eletricista, Marido de Aluguel, Empreiteiro, Gesseiro.
    - ${MacroCategory.CLEANING_HYGIENE}: Diarista, Limpeza de Sofá, Impermeabilização, Limpeza de Vidros.
    - ${MacroCategory.WOODWORK_FURNITURE}: Marceneiro, Móveis Planejados, Conserto de Sofá (Estofador), Troca de Portas.
    - ${MacroCategory.TECH_ASSISTANCE}: Manutenção de Ar Condicionado, Aquecedor a Gás, Máquina de Lavar, Geladeira.
    - ${MacroCategory.HEALTH_WELLNESS}: Médico, Dermatologista, Psicólogo Infantil, Personal Trainer, Dentista.
    - ${MacroCategory.AUTOMOTIVE}: Mecânica, Auto Elétrica, Lava Car.
    - ${MacroCategory.FOOD_EVENTS}: Marmitas, Kit Festa, Lembrancinhas Personalizadas.
    - ${MacroCategory.PROFESSIONAL_SERVICES}: Contador, Veterinário, Costureira (Bordados).
    - ${MacroCategory.BEAUTY_ESTHETICS}: Cabeleireiro, Manicure, Procedimentos Estéticos (Botox).
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
