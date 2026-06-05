import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function GET() {
  try {
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
    });
  }
}
