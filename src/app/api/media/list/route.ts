import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bucket = searchParams.get('bucket') || 'blog-images';

    const mediaList = await prisma.media.findMany({
      where: { bucket },
      orderBy: { createdAt: 'desc' },
    });

    // Format response to look like Supabase Storage list response
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
    console.error('List media API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to list media' }, { status: 500 });
  }
}
