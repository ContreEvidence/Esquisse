$ErrorActionPreference = "Stop"
$pack = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo = Read-Host "Chemin du dossier local du dépôt Esquisse"
if (-not (Test-Path (Join-Path $repo "index.html"))) { throw "index.html introuvable dans ce dossier." }

$backup = Join-Path $repo ("sauvegarde-pack10-" + (Get-Date -Format "yyyyMMdd-HHmmss"))
New-Item -ItemType Directory -Path $backup | Out-Null

$files = @(
  "index.html",
  "videos.html",
  "bibliotheque.html",
  "assets/navigation-v3.js",
  "assets/script.js",
  "assets/brand.css",
  "assets/video.css"
)

foreach ($f in $files) {
  $dest = Join-Path $repo $f
  if (Test-Path $dest) {
    $save = Join-Path $backup $f
    New-Item -ItemType Directory -Force -Path (Split-Path $save) | Out-Null
    Copy-Item $dest $save -Force
  }
  $src = Join-Path $pack $f
  if (Test-Path $src) {
    New-Item -ItemType Directory -Force -Path (Split-Path $dest) | Out-Null
    Copy-Item $src $dest -Force
  }
}

Write-Host "Correction Pack 10 appliquée. Sauvegarde : $backup" -ForegroundColor Green
