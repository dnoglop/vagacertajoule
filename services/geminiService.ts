import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult, Suggestion, JobSuggestion } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const suggestionSchema = {
    type: Type.OBJECT,
    properties: {
        area: {
            type: Type.STRING,
            description: "A área do currículo que pode ser melhorada (ex: 'Experiência', 'Habilidades').",
        },
        suggestion: {
            type: Type.STRING,
            description: "A sugestão específica de melhoria.",
        },
    }
}

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    compatibility: {
      type: Type.OBJECT,
      properties: {
        totalScore: {
          type: Type.INTEGER,
          description: "A pontuação geral de 0 a 100 representando a compatibilidade do currículo com a vaga.",
        },
        feedback: {
          type: Type.STRING,
          description: "Um breve feedback sobre a compatibilidade geral.",
        },
        breakdown: {
          type: Type.ARRAY,
          description: "Uma análise detalhada dos fatores que compõem a pontuação de compatibilidade.",
          items: {
            type: Type.OBJECT,
            properties: {
              factor: {
                type: Type.STRING,
                description: "O fator de compatibilidade analisado (ex: 'Experiência Relevante', 'Habilidades Técnicas', 'Educação').",
              },
              score: {
                type: Type.INTEGER,
                description: "A pontuação de 0 a 100 para este fator específico.",
              },
              justification: {
                type: Type.STRING,
                description: "Uma breve justificativa para a pontuação atribuída a este fator."
              }
            }
          }
        },
        focusedImprovementSuggestions: {
            type: Type.ARRAY,
            description: "Sugestões de melhoria focadas especificamente na área de compatibilidade com a menor pontuação.",
            items: suggestionSchema,
        }
      },
    },
    commonSkills: {
      type: Type.ARRAY,
      description: "Uma lista das habilidades em comum entre a vaga e o currículo.",
      items: {
        type: Type.OBJECT,
        properties: {
          skill: {
            type: Type.STRING,
            description: "O nome da habilidade.",
          },
          importance: {
            type: Type.STRING,
            description: "A importância da habilidade para a vaga (ex: 'Alta', 'Média').",
          },
        },
      },
    },
    improvementSuggestions: {
      type: Type.ARRAY,
      description: "Sugestões para melhorar o currículo de forma geral.",
      items: suggestionSchema,
    },
    starMethodGuides: {
      type: Type.ARRAY,
      description: "Guias práticos usando a metodologia STAR para ensinar o usuário a aplicar as sugestões.",
      items: {
        type: Type.OBJECT,
        properties: {
          suggestionTitle: {
            type: Type.STRING,
            description: "O título da sugestão de melhoria à qual este guia se refere.",
          },
          situation: {
            type: Type.STRING,
            description: "Guia para o usuário sobre como descrever a Situação (S) relacionada à sugestão. Deve ser uma instrução, não um exemplo pronto.",
          },
          task: {
            type: Type.STRING,
            description: "Guia para o usuário sobre como descrever a Tarefa (T) relacionada à sugestão. Deve ser uma instrução, não um exemplo pronto.",
          },
          action: {
            type: Type.STRING,
            description: "Guia para o usuário sobre como descrever a Ação (A) relacionada à sugestão. Deve ser uma instrução, não um exemplo pronto.",
          },
          result: {
            type: Type.STRING,
            description: "Guia para o usuário sobre como descrever o Resultado (R) relacionado à sugestão, focando em métricas e impacto. Deve ser uma instrução, não um exemplo pronto.",
          },
        },
      },
    },
  },
};


export const analyzeResume = async (jobDescription: string, resume: string): Promise<AnalysisResult> => {
  const prompt = `
    Você é um especialista em recrutamento e seleção com vasta experiência em análise de currículos e descrições de vagas. Sua tarefa é analisar o currículo e a descrição da vaga fornecidos, e retornar uma análise detalhada em formato JSON.

    O tom da sua análise deve ser profissional, claro, construtivo e motivador. O objetivo é ajudar o usuário a melhorar seu currículo e entender suas chances para a vaga.

    **Descrição da Vaga:**
    ---
    ${jobDescription}
    ---

    **Currículo:**
    ---
    ${resume}
    ---

    Por favor, realize as seguintes análises e estruture sua resposta estritamente de acordo com o schema JSON fornecido:

    1.  **Compatibilidade:**
        a.  **Análise Detalhada (Breakdown):** Analise a compatibilidade com base nos seguintes fatores: 'Experiência Profissional', 'Habilidades Técnicas', 'Habilidades Interpersonais (Soft Skills)', e 'Formação/Certificações'. Para cada fator, forneça uma pontuação de 0 a 100 e uma breve justificativa para a pontuação.
        b.  **Pontuação Geral (totalScore):** Calcule uma pontuação geral de 0 a 100, que deve ser uma média ponderada dos fatores acima, onde 'Experiência Profissional' e 'Habilidades Técnicas' têm peso maior.
        c.  **Feedback Geral:** Forneça um feedback conciso e encorajador sobre a compatibilidade geral, com base na pontuação geral.
        d.  **Sugestões de Melhoria Focadas:** Após a análise, identifique o fator do 'breakdown' com a MENOR pontuação. Crie 2-3 sugestões de melhoria (focusedImprovementSuggestions) que sejam específicas e direcionadas para aumentar a pontuação NESSA ÁREA em particular. A sugestão deve indicar claramente a qual fator ela se refere.
    2.  **Habilidades em Comum:** Identifique e liste as habilidades mais relevantes que estão presentes tanto no currículo quanto na descrição da vaga. Classifique a importância de cada habilidade para a função.
    3.  **Sugestões de Melhoria (Geral):** Forneça sugestões práticas e gerais para aprimorar o currículo. Foque em áreas como destacar resultados, incluir palavras-chave da vaga, e reorganizar experiências para maior impacto.
    4.  **Aplicando Melhorias (Metodologia STAR):** Para cada sugestão da seção 'Sugestões de Melhoria', crie um guia passo a passo que ensine o usuário a aplicar a melhoria em seu próprio currículo usando a metodologia STAR. Não reescreva uma experiência para o usuário. Em vez disso, para cada letra (S, T, A, R), dê instruções e perguntas que o guiem a refletir e escrever sobre suas próprias experiências de forma impactante. Por exemplo, para 'Situação', você poderia sugerir: 'Pense em um projeto ou desafio específico onde você usou [habilidade X]. Qual era o contexto?'. O objetivo é ensinar o usuário a construir suas próprias narrativas de impacto.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    // Gemini may sometimes wrap the JSON in markdown backticks
    const cleanedJsonText = jsonText.replace(/^```json\n?/, '').replace(/```$/, '');
    
    return JSON.parse(cleanedJsonText) as AnalysisResult;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to analyze resume and job description.");
  }
};

export const searchForJobs = async (resume: string, jobDescription: string): Promise<JobSuggestion[]> => {
    const prompt = `
        Você é um headhunter especialista. Baseado no currículo e na descrição de vaga a seguir, sua tarefa é usar a busca para encontrar 5 vagas de emprego que estejam **atualmente abertas** e sejam altamente compatíveis no Brasil.

        **REGRAS IMPORTANTES:**
        1.  **FILTRO DE DATA:** Retorne apenas vagas publicadas nos **últimos 30 dias**. Ignore vagas mais antigas.
        2.  **FOCO DIRECIONADO:** Concentre sua busca **exclusivamente** nas seguintes plataformas: **Gupy, LinkedIn, Infojobs, 99jobs e Vagas.com**.
        3.  **VAGAS ATIVAS:** É crucial que você retorne apenas vagas que ainda estão aceitando candidaturas. Verifique se os links não estão expirados.
        4.  **FORMATAÇÃO ESTRITA:** Para cada vaga encontrada, formate a resposta EXATAMENTE da seguinte maneira, em uma linha separada por vaga:
            [TÍTULO DA VAGA] @ [EMPRESA] | [PLATAFORMA] | [URL]
        5.  **RESPOSTA LIMPA:** Sua resposta deve conter APENAS as linhas com as vagas. Não inclua nenhum texto introdutório, cabeçalhos, resumos ou explicações. Não use formatação markdown como \`\`\`.

        **Descrição da Vaga de Referência:**
        ---
        ${jobDescription}
        ---

        **Currículo do Candidato:**
        ---
        ${resume}
        ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const text = response.text;
        if (!text) {
            return [];
        }

        const jobs: JobSuggestion[] = [];
        const lines = text.trim().split('\n').filter(line => line.includes('|') && line.includes('@'));

        for (const line of lines) {
            try {
                const parts = line.split('|').map(p => p.trim());
                if (parts.length === 3) {
                    const [titleAndCompany, platform, url] = parts;
                    const titleCompanyParts = titleAndCompany.split('@').map(p => p.trim());
                    if (titleCompanyParts.length === 2) {
                        const [title, company] = titleCompanyParts;
                        jobs.push({ title, company, platform, url });
                    }
                }
            } catch (parseError) {
                console.warn(`Could not parse job suggestion line: "${line}"`, parseError);
            }
        }
        
        return jobs;

    } catch (error) {
        console.error("Error calling Gemini API for job search:", error);
        throw new Error("Failed to search for jobs.");
    }
};