export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const survey = await prisma.survey.findUnique({
      where: { id: params.slug },
      include: {
        _count: {
          select: { responses: true }
        }
      }
    });

    if (!survey) {
      return NextResponse.json({ error: 'Pesquisa não encontrada' }, { status: 404 });
    }

    return NextResponse.json({
      id: survey.id,
      title: survey.title,
      status: survey.status,
      config: JSON.parse(survey.config),
      date: survey.createdAt.toLocaleDateString('pt-BR'),
      responses: survey._count.responses
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar pesquisa' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  try {
    const body = await request.json();
    const { title, status, config } = body;
    
    // config expected to be the sections array
    const configString = config ? JSON.stringify(config) : undefined;

    const updatedSurvey = await prisma.survey.update({
      where: { id: params.slug },
      data: {
        ...(title && { title }),
        ...(status && { status }),
        ...(configString && { config: configString }),
      }
    });

    return NextResponse.json(updatedSurvey);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar pesquisa' }, { status: 500 });
  }
}
