#!/bin/bash
# Schriften aus den npm-Paketen nach public/fonts kopieren (einmal nach npm install ausführen)
set -e
mkdir -p public/fonts
for w in 400 500 600; do cp node_modules/@fontsource/inter/files/inter-latin-$w-normal.woff2 public/fonts/; done
for s in 500-normal 600-normal 500-italic 600-italic; do cp node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-$s.woff2 public/fonts/; done
for w in 700 800 900; do cp node_modules/@fontsource/inter/files/inter-latin-$w-normal.woff2 public/fonts/ 2>/dev/null || true; done
echo "Schriften kopiert"
