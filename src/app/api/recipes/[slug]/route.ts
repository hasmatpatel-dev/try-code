import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getSessionCookie } from '@/lib/auth/session';
import slugify from 'slugify';
import { methodGuard, requireAuthRole, handleServerError, validateBody } from '@/lib/api-utils';
import { recipeInputSchema } from '@/lib/validations';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const methodError = methodGuard(req, ['GET']);
  if (methodError) return methodError;

  try {
    const { slug } = await params;
    const recipe = await prisma.recipe.findUnique({ where: { slug } });
    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }
    return NextResponse.json(recipe);
  } catch (error: any) {
    return handleServerError(error, 'Failed to fetch recipe');
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const methodError = methodGuard(req, ['PUT']);
  if (methodError) return methodError;

  try {
    const session = await getSessionCookie();
    const authError = requireAuthRole(session, ['Admin', 'Editor']);
    if (authError) return authError;

    const { slug } = await params;
    const existing = await prisma.recipe.findUnique({ where: { slug } });
    if (!existing) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    const validation = await validateBody(req, recipeInputSchema);
    if (!validation.success) return validation.response;

    const { title, description, language, code, dependencies, aiPrompt, bestPractices, category, published } = validation.data;

    let newSlug = existing.slug;
    if (title && title !== existing.title) {
      newSlug = slugify(title, { lower: true, strict: true });
      const slugExists = await prisma.recipe.findFirst({ where: { slug: newSlug, id: { not: existing.id } } });
      if (slugExists) {
        newSlug = `${newSlug}-${Date.now().toString().slice(-4)}`;
      }
    }

    const recipe = await prisma.recipe.update({
      where: { id: existing.id },
      data: {
        title: title ?? existing.title,
        slug: newSlug,
        description: description ?? existing.description,
        language: language ?? existing.language,
        code: code ?? existing.code,
        dependencies: dependencies ?? existing.dependencies,
        aiPrompt: aiPrompt ?? existing.aiPrompt,
        bestPractices: bestPractices ?? existing.bestPractices,
        category: category ?? existing.category,
        published: published ?? existing.published,
      },
    });

    return NextResponse.json(recipe);
  } catch (error: any) {
    return handleServerError(error, 'Failed to update recipe');
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const methodError = methodGuard(req, ['DELETE']);
  if (methodError) return methodError;

  try {
    const session = await getSessionCookie();
    const authError = requireAuthRole(session, ['Admin', 'Editor']);
    if (authError) return authError;

    const { slug } = await params;
    const existing = await prisma.recipe.findUnique({ where: { slug } });
    if (!existing) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    await prisma.recipe.delete({ where: { id: existing.id } });
    return NextResponse.json({ message: 'Recipe deleted successfully' });
  } catch (error: any) {
    return handleServerError(error, 'Failed to delete recipe');
  }
}
