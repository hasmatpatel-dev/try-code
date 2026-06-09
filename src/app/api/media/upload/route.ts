import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { promises as fs } from 'fs';
import path from 'path';
import { getSessionCookie } from '@/lib/auth/session';
import { methodGuard, requireAuthRole, handleServerError } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  const methodError = methodGuard(req, ['POST']);
  if (methodError) return methodError;

  try {
    const session = await getSessionCookie();
    const authError = requireAuthRole(session, ['Admin', 'Editor', 'Author']);
    if (authError) return authError;

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const rawBucket = (formData.get('bucket') as string) || 'blog-images';
    const customPath = (formData.get('path') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    // Validate type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Allowed: PNG, JPG, GIF, WEBP, SVG, PDF' }, { status: 400 });
    }

    // Sanitize bucket (strictly alphanumeric and hyphens/underscores)
    const bucket = rawBucket.replace(/[^a-zA-Z0-9_-]/g, '');
    if (!bucket) {
      return NextResponse.json({ error: 'Invalid bucket name' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename to prevent directory traversal
    const safeBaseName = path.basename(file.name).replace(/[^a-zA-Z0-9_.-]/g, '_');
    const filename = customPath
      ? path.basename(customPath).replace(/[^a-zA-Z0-9_.-]/g, '_')
      : `${Date.now()}-${safeBaseName}`;

    // Target upload folder in public/
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', bucket);
    
    // Safety check: ensure uploadDir is inside process.cwd() / public / uploads
    const resolvedPath = path.resolve(uploadDir);
    const expectedBase = path.resolve(path.join(process.cwd(), 'public', 'uploads'));
    if (!resolvedPath.startsWith(expectedBase)) {
      return NextResponse.json({ error: 'Invalid upload destination' }, { status: 400 });
    }

    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    
    // Safety check for final file path
    const resolvedFilePath = path.resolve(filePath);
    if (!resolvedFilePath.startsWith(resolvedPath)) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
    }

    await fs.writeFile(resolvedFilePath, buffer);

    const fileUrl = `/uploads/${bucket}/${filename}`;

    // Write to database
    const media = await prisma.media.create({
      data: {
        fileName: file.name,
        fileUrl,
        fileSize: file.size,
        fileType: file.type,
        bucket,
      },
    });

    return NextResponse.json(media);
  } catch (error: any) {
    return handleServerError(error, 'Failed to upload media file');
  }
}
