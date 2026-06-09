import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getSessionCookie } from '@/lib/auth/session';
import slugify from 'slugify';
import { methodGuard, requireAuthRole, handleServerError, validateBody } from '@/lib/api-utils';
import { recipeInputSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  const methodError = methodGuard(req, ['GET']);
  if (methodError) return methodError;

  try {
    const { searchParams } = new URL(req.url);
    const published = searchParams.get('published');

    const where: any = {};
    if (published === 'true') where.published = true;
    else if (published === 'false') where.published = false;

    const recipes = await prisma.recipe.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(recipes);
  } catch (error: any) {
    return handleServerError(error, 'Failed to fetch recipes');
  }
}

export async function POST(req: NextRequest) {
  const methodError = methodGuard(req, ['POST']);
  if (methodError) return methodError;

  try {
    const session = await getSessionCookie();
    const authError = requireAuthRole(session, ['Admin', 'Editor']);
    if (authError) return authError;

    const validation = await validateBody(req, recipeInputSchema);
    if (!validation.success) return validation.response;

    const { title, description, language, code, dependencies, aiPrompt, bestPractices, category, published } = validation.data;

    let slug = slugify(title, { lower: true, strict: true });
    const existing = await prisma.recipe.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const recipe = await prisma.recipe.create({
      data: { title, slug, description, language: language || 'typescript', code, dependencies, aiPrompt, bestPractices, category, published: published || false },
    });

    return NextResponse.json(recipe);
  } catch (error: any) {
    return handleServerError(error, 'Failed to create recipe');
  }
}
