import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getSessionCookie } from '@/lib/auth/session';
import { methodGuard, requireAuthRole, handleServerError, validateBody } from '@/lib/api-utils';
import { faqInputSchema } from '@/lib/validations';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const methodError = methodGuard(req, ['GET']);
  if (methodError) return methodError;

  try {
    const { id } = await params;
    const faq = await prisma.fAQ.findUnique({ where: { id } });
    if (!faq) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }
    return NextResponse.json(faq);
  } catch (error: any) {
    return handleServerError(error, 'Failed to fetch FAQ');
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const methodError = methodGuard(req, ['PUT']);
  if (methodError) return methodError;

  try {
    const session = await getSessionCookie();
    const authError = requireAuthRole(session, ['Admin', 'Editor']);
    if (authError) return authError;

    const { id } = await params;
    const existing = await prisma.fAQ.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }

    const validation = await validateBody(req, faqInputSchema);
    if (!validation.success) return validation.response;

    const { question, answer, order, published } = validation.data;

    const faq = await prisma.fAQ.update({
      where: { id },
      data: {
        question: question ?? existing.question,
        answer: answer ?? existing.answer,
        order: order ?? existing.order,
        published: published ?? existing.published,
      },
    });

    return NextResponse.json(faq);
  } catch (error: any) {
    return handleServerError(error, 'Failed to update FAQ');
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const methodError = methodGuard(req, ['DELETE']);
  if (methodError) return methodError;

  try {
    const session = await getSessionCookie();
    const authError = requireAuthRole(session, ['Admin', 'Editor']);
    if (authError) return authError;

    const { id } = await params;
    const existing = await prisma.fAQ.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }

    await prisma.fAQ.delete({ where: { id } });
    return NextResponse.json({ message: 'FAQ deleted successfully' });
  } catch (error: any) {
    return handleServerError(error, 'Failed to delete FAQ');
  }
}
