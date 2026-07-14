#!/usr/bin/env bash
set -euo pipefail

ZIP_FILE="dg-website-final-netlify-postprocessing-fix.zip"
TMP_DIR=".tmp-site"
OUT_DIR="dist"

rm -rf "$TMP_DIR" "$OUT_DIR"
mkdir -p "$TMP_DIR" "$OUT_DIR"

unzip -q "$ZIP_FILE" -d "$TMP_DIR"

mapfile -t ROOT_ENTRIES < <(find "$TMP_DIR" -mindepth 1 -maxdepth 1 -print)
if [[ ${#ROOT_ENTRIES[@]} -eq 1 && -d "${ROOT_ENTRIES[0]}" ]]; then
  cp -a "${ROOT_ENTRIES[0]}/." "$OUT_DIR/"
else
  cp -a "$TMP_DIR/." "$OUT_DIR/"
fi

rm -rf "$TMP_DIR"

test -f "$OUT_DIR/index.html"
echo "Website restored successfully."
