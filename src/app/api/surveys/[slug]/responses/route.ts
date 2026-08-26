export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, context: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await context.params;
  const params = resolvedParams;
  try {
    const responses = await prisma.response.findMany({
      where: { surveyId: params.slug },
      orderBy: { createdAt: 'desc' }
    });

    const parsedResponses = responses.map(r => ({
      id: r.id,
      date: r.createdAt.toISOString(),
      answers: JSON.parse(r.answers)
    }));

    return NextResponse.json(parsedResponses);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar respostas' }, { status: 500 });
  }
}

export async function POST(request: Request, context: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await context.params;
  const params = resolvedParams;
  try {
    const body = await request.json();
    const { answers } = body;

    const newResponse = await prisma.response.create({
      data: {
        surveyId: params.slug,
        answers: JSON.stringify(answers)
      }
    });

    return NextResponse.json({ success: true, id: newResponse.id });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao salvar resposta' }, { status: 500 });
  }
}
