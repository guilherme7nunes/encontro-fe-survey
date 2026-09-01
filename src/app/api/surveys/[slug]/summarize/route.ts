import { NextResponse } from 'next/server';

export async function POST(request: Request, context: { params: Promise<{ slug: string }> | { slug: string } }) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'A chave da API (GEMINI_API_KEY) não está configurada no servidor.' }, 
        { status: 500 }
      );
    }

    // Call ModelService.ListModels directly using fetch
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + apiKey);
    const data = await response.json();

    if (!response.ok) {
        return NextResponse.json({
            error: `Erro HTTP ${response.status} ao listar modelos: ${JSON.stringify(data)}`
        }, { status: 500 });
    }

    const modelNames = data.models ? data.models.map((m: any) => m.name).join(', ') : 'Nenhum modelo encontrado no JSON.';
    
    return NextResponse.json({
        error: `DIAGNÓSTICO: A chave é válida. Modelos disponíveis na sua conta: ${modelNames}`
    }, { status: 500 });

  } catch (error: any) {
    console.error('Error debugging models:', error);
    return NextResponse.json(
      { error: 'Erro fatal no diagnóstico: ' + (error.message || String(error)) }, 
      { status: 500 }
    );
  }
}
