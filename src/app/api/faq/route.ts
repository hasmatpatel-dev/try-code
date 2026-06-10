import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getSessionCookie } from '@/lib/auth/session';
import { methodGuard, requireAuthRole, handleServerError, validateBody } from '@/lib/api-utils';
import { faqInputSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  const methodError = methodGuard(req, ['GET']);
  if (methodError) return methodError;

  try {
    const { searchParams } = new URL(req.url);
    const published = searchParams.get('published');

    const where: any = {};
    if (published === 'true') where.published = true;
    else if (published === 'false') where.published = false;

    const faqs = await prisma.faq.findMany({
      where,
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(faqs);
  } catch (error: any) {
    return handleServerError(error, 'Failed to fetch FAQs');
  }
}

export async function POST(req: NextRequest) {
  const methodError = methodGuard(req, ['POST']);
  if (methodError) return methodError;

  try {
    const session = await getSessionCookie();
    const authError = requireAuthRole(session, ['Admin', 'Editor']);
    if (authError) return authError;

    const validation = await validateBody(req, faqInputSchema);
    if (!validation.success) return validation.response;

    const { question, answer, order, published } = validation.data;

    const faq = await prisma.faq.create({
      data: { question, answer, order: order || 0, published: published || false },
    });

    return NextResponse.json(faq);
  } catch (error: any) {
    return handleServerError(error, 'Failed to create FAQ');
  }
}
