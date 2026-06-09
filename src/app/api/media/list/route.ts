import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getSessionCookie } from '@/lib/auth/session';
import { methodGuard, requireAuthRole, handleServerError } from '@/lib/api-utils';

export async function GET(req: NextRequest) {
  const methodError = methodGuard(req, ['GET']);
  if (methodError) return methodError;

  try {
    const session = await getSessionCookie();
    const authError = requireAuthRole(session, ['Admin', 'Editor', 'Author']);
    if (authError) return authError;

    const { searchParams } = new URL(req.url);
    const rawBucket = searchParams.get('bucket') || 'blog-images';
    
    // Sanitize bucket name
    const bucket = rawBucket.replace(/[^a-zA-Z0-9_-]/g, '');
    if (!bucket) {
      return NextResponse.json({ error: 'Invalid bucket name' }, { status: 400 });
    }

    const mediaList = await prisma.media.findMany({
      where: { bucket },
      orderBy: { createdAt: 'desc' },
    });

    const formattedList = mediaList.map((item) => ({
      id: item.id,
      name: item.fileName,
      url: item.fileUrl,
      created_at: item.createdAt.toISOString(),
      metadata: {
        size: item.fileSize,
        mimetype: item.fileType,
      },
    }));

    return NextResponse.json(formattedList);
  } catch (error: any) {
    return handleServerError(error, 'Failed to list media files');
  }
}
