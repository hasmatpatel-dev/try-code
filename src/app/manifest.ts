import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  // Ensure the public directory and local icon assets exist on the local system
  try {
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const icon192Path = path.join(publicDir, 'icon-192.png');
    const icon512Path = path.join(publicDir, 'icon-512.png');

    if (!fs.existsSync(icon192Path)) {
      const res = await fetch('https://github.com/shadcn.png?size=192');
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(icon192Path, Buffer.from(buffer));
      }
    }

    if (!fs.existsSync(icon512Path)) {
      const res = await fetch('https://github.com/shadcn.png?size=512');
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(icon512Path, Buffer.from(buffer));
      }
    }
  } catch (error) {
    console.error('Error downloading manifest icons locally:', error);
  }

  return {
    name: 'TryCode Learning Platform',
    short_name: 'TryCode',
    description: 'Master full-stack software development courses with interactive AI coding bootcamp lessons online.',
    start_url: '/',
    display: 'standalone',
    background_color: '#030712',
    theme_color: '#030712',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
