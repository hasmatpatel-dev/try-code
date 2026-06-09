import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';
import { promises as fs } from 'fs';
import path from 'path';
import { getSessionCookie } from '@/lib/auth/session';
import { methodGuard, requireAuthRole, handleServerError } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
  const methodError = methodGuard(req, ['POST']);
  if (methodError) return methodError;

  try {
    const session = await getSessionCookie();
    const authError = requireAuthRole(session, ['Admin', 'Editor', 'Author']);
    if (authError) return authError;

    const { bucket: rawBucket, paths } = await req.json();

    if (!rawBucket || !paths || !Array.isArray(paths)) {
      return NextResponse.json({ error: 'Bucket and paths are required' }, { status: 400 });
    }

    // Sanitize bucket
    const bucket = rawBucket.replace(/[^a-zA-Z0-9_-]/g, '');
    if (!bucket) {
      return NextResponse.json({ error: 'Invalid bucket name' }, { status: 400 });
    }

    const results = [];
    const expectedDir = path.resolve(path.join(process.cwd(), 'public', 'uploads', bucket));

    for (const filePathName of paths) {
      if (typeof filePathName !== 'string') {
        results.push({ path: String(filePathName), deleted: false, reason: 'Invalid path format' });
        continue;
      }

      const filename = path.basename(filePathName);
      const fileUrl = `/uploads/${bucket}/${filename}`;

      // Search DB
      const record = await prisma.media.findFirst({
        where: { fileUrl, bucket },
      });

      if (record) {
        const diskPath = path.join(expectedDir, filename);
        const resolvedDiskPath = path.resolve(diskPath);

        // Security check: must reside inside expected upload folder for this bucket
        if (!resolvedDiskPath.startsWith(expectedDir)) {
          results.push({ path: filePathName, deleted: false, reason: 'Access denied to file path' });
          continue;
        }

        // Remove from public directory
        try {
          await fs.unlink(resolvedDiskPath);
        } catch (err) {
          console.warn(`File could not be deleted from disk at ${resolvedDiskPath}`);
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
    return handleServerError(error, 'Failed to delete media files');
  }
}
