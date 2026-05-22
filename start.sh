#!/usr/bin/env sh
set -e

cd frontend
npm ci
npm run build

# Railway injects PORT into the environment.
# `serve` will listen on that port, falling back to 3000 locally.
exec npx serve -s dist -l "${PORT:-3000}"
