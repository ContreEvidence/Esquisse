$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Correction du menu Contre-évidence" -ForegroundColor Cyan
Write-Host "Dossier : $root"

$htmlFiles = Get-ChildItem -Path $root -Filter *.html -Recurse -File | Where-Object { $_.Name -ne 'PREVIEW-MENU.html' }
$version = '20260806-final'
$count = 0

foreach ($file in $htmlFiles) {
    $content = Get-Content -LiteralPath $file.FullName -Raw -Encoding UTF8
    $original = $content

    # Retire l'ancienne feuille réservée aux onglets, devenue inutile.
    $content = [regex]::Replace($content, '<link[^>]+href=["''][^"'']*navigation-tabs\.css[^"'']*["''][^>]*>\s*', '', 'IgnoreCase')

    # Force le rechargement des deux scripts corrigés sans modifier leurs chemins relatifs.
    $content = [regex]::Replace($content, '(src=["''][^"'']*assets/script\.js)(?:\?[^"'']*)?(["''])', "`$1?v=$version`$2", 'IgnoreCase')
    $content = [regex]::Replace($content, '(src=["''][^"'']*assets/navigation-v3\.js)(?:\?[^"'']*)?(["''])', "`$1?v=$version`$2", 'IgnoreCase')

    if ($content -ne $original) {
        Copy-Item -LiteralPath $file.FullName -Destination ($file.FullName + '.bak-menu') -Force
        Set-Content -LiteralPath $file.FullName -Value $content -Encoding UTF8
        $count++
    }
}

Write-Host "$count page(s) HTML corrigée(s)." -ForegroundColor Green
Write-Host "Les anciennes versions ont été sauvegardées avec l'extension .bak-menu."
Write-Host "Tu peux maintenant téléverser le contenu du dossier sur GitHub."
Read-Host "Appuie sur Entrée pour fermer"
