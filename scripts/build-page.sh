#!/usr/bin/env bash
# Wraps the game body (the same file published on claude.ai, which has no <head>) into public/index.html.
# Usage: scripts/build-page.sh path/to/game-body.html
set -euo pipefail
src="${1:?path to the game body HTML}"
out="$(dirname "$0")/../public/index.html"
{
  cat <<'HEAD'
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="Wobbly ragdoll fighting in the browser: punch, kick, grab and throw your rivals, solo or online.">
<meta name="theme-color" content="#141824">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
</head>
<body>
HEAD
  cat "$src"
  printf '\n</body>\n</html>\n'
} > "$out"
echo "wrote $out"
