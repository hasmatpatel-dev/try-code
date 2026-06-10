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
  productionBrowserSourceMaps: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
