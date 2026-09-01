import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request, context: { params: Promise<{ slug: string }> | { slug: string } }) {
  try {
    const body = await request.json();
    const { surveyTitle, sectionsList, responsesData } = body;

    if (!responsesData || responsesData.length === 0) {
      return NextResponse.json({ summary: "Não há respostas suficientes para gerar um plano de ação global." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'A chave da API (GEMINI_API_KEY) não está configurada no servidor.' }, 
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Preparar os dados para a IA de forma resumida para economizar tokens
    let surveyContext = `Título do Evento/Pesquisa: ${surveyTitle}\nTotal de Respostas: ${responsesData.length}\n\nPerguntas e Resumos Quantitativos:\n`;

    sectionsList.forEach((section: any, sIdx: number) => {
        surveyContext += `\n--- TÓPICO ${sIdx + 1}: ${section.title} ---\n`;
        section.questions.forEach((q: any, qIdx: number) => {
            surveyContext += `\nPergunta ${sIdx + 1}.${qIdx + 1}: ${q.text}\n`;
            
            if (q.type === 'paragraph') {
                // Selecionar até 25 amostras de respostas textuais para não estourar o limite, 
                // e para focar nos padrões gerais
                const textAnswers = responsesData
                    .map((res: any) => res.answers && res.answers[q.id])
                    .filter(Boolean);
                
                surveyContext += `(Respostas Abertas. Amostra de ${Math.min(textAnswers.length, 25)} respostas):\n`;
                textAnswers.slice(0, 25).forEach((ans: string) => {
                    surveyContext += `- "${ans}"\n`;
                });
            } else if (q.type === 'linear' || q.type === 'radio' || q.type === 'checkbox') {
                const counts: Record<string, number> = {};
                responsesData.forEach((res: any) => {
                    const ans = res.answers && res.answers[q.id];
                    if (ans !== undefined) {
                        if (Array.isArray(ans)) {
                            ans.forEach(a => { counts[a] = (counts[a] || 0) + 1 });
                        } else {
                            counts[ans] = (counts[ans] || 0) + 1;
                        }
                    }
                });
                surveyContext += `(Respostas Quantitativas):\n`;
                Object.entries(counts).forEach(([key, val]) => {
                    surveyContext += `- ${key}: ${val} votos\n`;
                });
            }
        });
    });

    const prompt = `Você é um Consultor Estratégico Especialista em Eventos corporativos e associativos.
Abaixo estão os dados agregados da pesquisa de satisfação "${surveyTitle}".

DADOS DA PESQUISA:
${surveyContext}

OBJETIVO:
Gere um "Relatório Executivo e Plano de Ação" para a diretoria, analisando esses resultados. O relatório será exibido no dashboard de análise.

INSTRUÇÕES DE FORMATAÇÃO E CONTEÚDO:
- Use Markdown.
- Comece com uma visão geral (Resumo Executivo) de 1 ou 2 parágrafos.
- Em seguida, crie uma seção de "Pontos Fortes" (o que deu certo).
- Depois, "Pontos de Atenção / Melhorias" (as principais dores ou reclamações).
- Conclua com um "Plano de Ação" com 3 a 5 passos claros e práticos para o próximo evento.
- Seja direto, profissional, claro e objetivo. Evite textos enchedos de linguiça.
- NÃO use títulos H1 (#). Use no máximo H2 (##) ou H3 (###) para as seções.
`;

    let summary = '';
    let lastError = null;

    const modelsToTry = ["gemini-flash-latest"];

    for (const modelName of modelsToTry) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            summary = result.response.text();
            break; 
        } catch (e: any) {
            console.warn(`Falha ao tentar modelo ${modelName}:`, e.message);
            lastError = e;
        }
    }

    if (!summary) {
        throw new Error(lastError?.message || 'Nenhum modelo funcionou na geração global.');
    }

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error('Error generating global summary:', error);
    return NextResponse.json(
      { error: 'Erro Gemini: ' + (error.message || String(error)) }, 
      { status: 500 }
    );
  }
}
