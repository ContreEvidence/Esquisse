$ErrorActionPreference = "Stop"
$pack = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo = Read-Host "Chemin du dossier local du dépôt Esquisse"
if (-not (Test-Path (Join-Path $repo "index.html"))) { throw "index.html introuvable dans ce dossier." }
$backup = Join-Path $repo ("sauvegarde-pack07-" + (Get-Date -Format "yyyyMMdd-HHmmss"))
New-Item -ItemType Directory -Path $backup | Out-Null
$files = @("index.html","bibliotheque.html","parcours-argent.html","themes/argent.html","sitemap.xml","assets/script.js","assets/navigation-v3.js")
foreach ($f in $files) {
  $dest = Join-Path $repo $f
  if (Test-Path $dest) {
    $b = Join-Path $backup $f
    New-Item -ItemType Directory -Force -Path (Split-Path $b) | Out-Null
    Copy-Item $dest $b
  }
}
Copy-Item (Join-Path $pack "index.html") (Join-Path $repo "index.html") -Force
Copy-Item (Join-Path $pack "bibliotheque.html") (Join-Path $repo "bibliotheque.html") -Force
Copy-Item (Join-Path $pack "parcours-argent.html") (Join-Path $repo "parcours-argent.html") -Force
Copy-Item (Join-Path $pack "moins-de-25-ans.html") (Join-Path $repo "moins-de-25-ans.html") -Force
Copy-Item (Join-Path $pack "sitemap.xml") (Join-Path $repo "sitemap.xml") -Force
New-Item -ItemType Directory -Force -Path (Join-Path $repo "themes") | Out-Null
Copy-Item (Join-Path $pack "themes/argent.html") (Join-Path $repo "themes/argent.html") -Force
New-Item -ItemType Directory -Force -Path (Join-Path $repo "assets") | Out-Null
Copy-Item (Join-Path $pack "assets/script.js") (Join-Path $repo "assets/script.js") -Force
Copy-Item (Join-Path $pack "assets/navigation-v3.js") (Join-Path $repo "assets/navigation-v3.js") -Force
Copy-Item (Join-Path $pack "assets/young.css") (Join-Path $repo "assets/young.css") -Force
Write-Host "Mise à jour terminée. Sauvegarde : $backup" -ForegroundColor Green
