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
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error('Error generating summary:', error);
    return NextResponse.json(
      { error: 'Erro Gemini: ' + (error.message || String(error)) }, 
      { status: 500 }
    );
  }
}
