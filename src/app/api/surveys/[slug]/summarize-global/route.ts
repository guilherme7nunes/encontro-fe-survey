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
    
    let surveyContext = `Título do Evento/Pesquisa: ${surveyTitle}\nTotal de Respostas: ${responsesData.length}\n\nPerguntas e Resumos Quantitativos:\n`;

    sectionsList.forEach((section: any, sIdx: number) => {
        surveyContext += `\n--- TÓPICO ${sIdx + 1}: ${section.title} ---\n`;
        section.questions.forEach((q: any, qIdx: number) => {
            surveyContext += `\nPergunta ${sIdx + 1}.${qIdx + 1}: ${q.text}\n`;
            
            if (q.type === 'paragraph') {
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

    const prompt = `Você é um Consultor Estratégico Sênior Especialista em Eventos corporativos e associativos.
Abaixo estão os dados agregados da pesquisa de satisfação "${surveyTitle}".

DADOS DA PESQUISA:
${surveyContext}

OBJETIVO:
Gere um "Relatório Executivo e Plano de Ação" altamente detalhado e estruturado para a diretoria, com base exclusivamente nos dados fornecidos.

INSTRUÇÕES DE FORMATAÇÃO (USE MARKDOWN RIGOROSAMENTE):
O relatório DEVE conter EXATAMENTE as seguintes seções, usando os mesmos títulos (com ## para títulos principais e ### para subtítulos):

## 1. Resumo executivo
(Escreva 2 ou 3 parágrafos profissionais resumindo os pontos mais importantes, a nota geral emocional e os principais sucessos e gargalos).

## 2. Decisões recomendadas
(Crie uma tabela Markdown com até 5 decisões cruciais para o próximo evento. Colunas obrigatórias EXATAS: | # | Decisão | Problema que resolve |)

## 3. Análise das respostas abertas
(Agrupe as respostas em até 6 eixos temáticos relevantes, baseados nas seções da pesquisa. Para cada eixo, crie um subtítulo ### Nome do Eixo e use duas listas de bullet points exatas:
**O que funcionou e deve ser mantido:**
- Ponto 1
- Ponto 2

**O que precisa mudar:**
- Ponto 1
- Ponto 2)

## 4. Plano de ação para a próxima edição
(Crie uma tabela Markdown detalhada com as ações práticas baseadas nas melhorias. Colunas obrigatórias EXATAS: | Prioridade (Alta/Média/Baixa) | Ação | O que fazer |)

## 5. Conclusão
(Um parágrafo de fechamento inspirador, focado na transição operacional e consolidação do sucesso).

Tom de voz: Corporativo, analítico, focado em soluções (orientado a dados).
NÃO invente dados. Se não houver dados para um eixo específico, não o mencione.
USE APENAS MARKDOWN VÁLIDO.
`;

    let summary = '';
    let lastError = null;

    const modelsToTry = [
        "gemini-flash-latest",
        "gemini-pro-latest",
        "gemini-flash-lite-latest",
        "gemini-2.5-pro",
        "gemini-2.5-flash-lite"
    ];

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
