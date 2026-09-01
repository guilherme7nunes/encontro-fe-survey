import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request, context: { params: Promise<{ slug: string }> | { slug: string } }) {
  try {
    const body = await request.json();
    const { questionTitle, answers } = body;

    if (!answers || answers.length === 0) {
      return NextResponse.json({ summary: "Não há respostas suficientes para analisar." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'A chave da API (GEMINI_API_KEY) não está configurada no servidor.' }, 
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    const prompt = `Você é um analista de pesquisa especializado em resumir feedbacks.
Aqui estão as respostas abertas para a seguinte pergunta de uma pesquisa de satisfação de um evento:

Pergunta: "${questionTitle}"

Respostas:
${answers.map((a: any) => `- ${a.text}`).join('\n')}

Por favor, faça um resumo claro, conciso e profissional destas respostas. Destaque:
1. Os principais padrões, elogios ou sentimentos positivos.
2. Os principais pontos de melhoria ou críticas (se houver).
3. Uma conclusão breve.

Responda em formato Markdown (usando **negrito** e listas, sem usar cabeçalhos gigantes).`;

    let summary = '';
    let lastError = null;
    
    // Fallback list of models to try
    const modelsToTry = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-pro",
        "gemini-pro",
        "gemini-1.0-pro"
    ];

    for (const modelName of modelsToTry) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            summary = result.response.text();
            break; // If successful, break out of the loop
        } catch (e: any) {
            console.warn(`Falha ao usar o modelo ${modelName}:`, e.message);
            lastError = e;
        }
    }

    if (!summary) {
        // If we exhausted all models and still have no summary
        throw new Error(
            `Nenhum modelo do Gemini está liberado para esta chave no seu projeto. ` +
            `Erro final: ${lastError?.message}. ` +
            `Verifique se o seu projeto Google tem a "Generative Language API" ativada e se não há restrições de região.`
        );
    }

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error('Error generating summary:', error);
    return NextResponse.json(
      { error: error.message || String(error) }, 
      { status: 500 }
    );
  }
}
