import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';
import { getSessionCookie } from '@/lib/auth/session';
import { methodGuard, requireAuthRole } from '@/lib/api-utils';

const execPromise = util.promisify(exec);

export async function GET(req: NextRequest) {
  const methodError = methodGuard(req, ['GET']);
  if (methodError) return methodError;

  try {
    const session = await getSessionCookie();
    const authError = requireAuthRole(session, ['Admin']);
    if (authError) return authError;

    // Run npx prisma db push to sync the schema to Supabase
    const { stdout, stderr } = await execPromise('npx prisma db push');
    return NextResponse.json({
      success: true,
      stdout,
      stderr
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stdout: error.stdout,
      stderr: error.stderr
    }, { status: 500 });
  }
}
