import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { getSessionCookie } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionCookie();
    if (!session || (session.user.role !== 'Admin' && session.user.role !== 'Editor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const comments = await prisma.comment.findMany({
      include: {
        post: {
          select: { id: true, title: true, slug: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(comments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch comments' }, { status: 500 });
  }
}

// Guest comments creation
export async function POST(req: NextRequest) {
  try {
    const { postId, content, authorName, authorEmail } = await req.json();

    if (!postId || !content || !authorName || !authorEmail) {
      return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        content,
        authorName,
        authorEmail,
        authorAvatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(authorName)}`,
        status: 'Pending', // Requires moderation approval
      },
    });

    return NextResponse.json(comment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit comment' }, { status: 500 });
  }
}
