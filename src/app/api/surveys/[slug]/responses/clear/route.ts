import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
export async function DELETE(request: Request, context: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await context.params;
  try {
    await prisma.response.deleteMany({ where: { surveyId: resolvedParams.slug } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao zerar' }, { status: 500 });
  }
}
