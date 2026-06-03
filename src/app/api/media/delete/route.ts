import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { bucket, paths } = await req.json();

    if (!bucket || !paths || !Array.isArray(paths)) {
      return NextResponse.json({ error: 'Bucket and paths are required' }, { status: 400 });
    }

    const results = [];

    for (const filePathName of paths) {
      const filename = path.basename(filePathName);
      const fileUrl = `/uploads/${bucket}/${filename}`;

      // Search DB
      const record = await prisma.media.findFirst({
        where: { fileUrl, bucket },
      });

      if (record) {
        // Remove from public directory
        const diskPath = path.join(process.cwd(), 'public', 'uploads', bucket, filename);
        try {
          await fs.unlink(diskPath);
        } catch (err) {
          console.warn(`File could not be deleted from disk at ${diskPath}`);
        }

        // Remove from DB
        await prisma.media.delete({
          where: { id: record.id },
        });

        results.push({ path: filePathName, deleted: true });
      } else {
        results.push({ path: filePathName, deleted: false, reason: 'Media record not found' });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error('Delete media API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete' }, { status: 500 });
  }
}
