import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const bucket = (formData.get('bucket') as string) || 'blog-images';
    const customPath = (formData.get('path') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Safe filename
    const filename = customPath
      ? path.basename(customPath)
      : `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;

    // Target upload folder in public/
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', bucket);
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

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
    console.error('Local upload API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload' }, { status: 500 });
  }
}
