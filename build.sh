#!/usr/bin/env bash
set -euo pipefail

ZIP_FILE="dg-website-final-netlify-postprocessing-fix.zip"
TMP_DIR=".tmp-site"
OUT_DIR="dist"

rm -rf "$TMP_DIR" "$OUT_DIR"
mkdir -p "$TMP_DIR" "$OUT_DIR"

unzip -q "$ZIP_FILE" -d "$TMP_DIR"

# Some uploaded website archives contain one wrapper directory, others contain
# the publish files directly. Handle both structures without assumptions.
mapfile -t ROOT_ENTRIES < <(find "$TMP_DIR" -mindepth 1 -maxdepth 1 -print)
if [[ ${#ROOT_ENTRIES[@]} -eq 1 && -d "${ROOT_ENTRIES[0]}" ]]; then
  cp -a "${ROOT_ENTRIES[0]}/." "$OUT_DIR/"
else
  cp -a "$TMP_DIR/." "$OUT_DIR/"
fi

# Overlay the repositioned homepage and fresh SEO discovery files while
# retaining all existing legal pages, specialist pages and media assets.
cp index.html "$OUT_DIR/index.html"
cp robots.txt "$OUT_DIR/robots.txt"
cp sitemap.xml "$OUT_DIR/sitemap.xml"

rm -rf "$TMP_DIR"

echo "Prepared $(find "$OUT_DIR" -type f | wc -l | tr -d ' ') files in $OUT_DIR"
