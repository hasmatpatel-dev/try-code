import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

// Copy favicon on startup
try {
  const srcFavicon = path.join(process.cwd(), "src", "assets", "favicon.png");
  const destFaviconApp = path.join(process.cwd(), "src", "app", "icon.png");
  const destFaviconPublic = path.join(process.cwd(), "public", "favicon.png");
  const destFaviconIco = path.join(process.cwd(), "public", "favicon.ico");

  if (fs.existsSync(srcFavicon)) {
    fs.mkdirSync(path.dirname(destFaviconApp), { recursive: true });
    fs.mkdirSync(path.dirname(destFaviconPublic), { recursive: true });

    fs.copyFileSync(srcFavicon, destFaviconApp);
    fs.copyFileSync(srcFavicon, destFaviconPublic);
    fs.copyFileSync(srcFavicon, destFaviconIco);

    // Delete old icon.svg if exists
    const oldIconSvg = path.join(process.cwd(), "src", "app", "icon.svg");
    if (fs.existsSync(oldIconSvg)) {
      fs.unlinkSync(oldIconSvg);
    }
  }
} catch (error) {
  console.error("Failed to copy favicon.png:", error);
}

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.shadcnspace.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
