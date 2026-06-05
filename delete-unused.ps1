# PowerShell script to remove unused shadcn-space block components and verify build

$unusedFolders = @(
    "src/components/shadcn-space/blocks/contact-01",
    "src/components/shadcn-space/blocks/cta-02",
    "src/components/shadcn-space/blocks/feature-02",
    "src/components/shadcn-space/blocks/footer-01",
    "src/components/shadcn-space/blocks/gallery-01",
    "src/components/shadcn-space/blocks/hero-02",
    "src/components/shadcn-space/blocks/hero-03",
    "src/components/shadcn-space/blocks/logo-cloud-01",
    "src/components/shadcn-space/blocks/navbar-01",
    "src/components/shadcn-space/blocks/newsletter-01",
    "src/components/shadcn-space/blocks/portfolio-01",
    "src/components/shadcn-space/blocks/pricing-01",
    "src/components/shadcn-space/blocks/services-02",
    "src/components/shadcn-space/blocks/team-01",
    "src/components/shadcn-space/blocks/team-02",
    "src/components/shadcn-space/blocks/testimonial-01"
)

Write-Host "Starting removal of unused component directories..." -ForegroundColor Cyan

foreach ($folder in $unusedFolders) {
    if (Test-Path $folder) {
        Write-Host "Removing: $folder" -ForegroundColor Yellow
        Remove-Item -Recurse -Force $folder
    } else {
        Write-Host "Already removed or does not exist: $folder" -ForegroundColor DarkGray
    }
}

Write-Host "`nAll specified unused directories have been removed." -ForegroundColor Green
Write-Host "Running build verification (npm run build)..." -ForegroundColor Cyan

npm run build

Write-Host "`nVerification complete. You can now delete this script file." -ForegroundColor Green
