#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

TAG="${IMAGE_TAG:-$(git rev-parse --short HEAD 2>/dev/null || date +%Y%m%d%H%M)}"
OUT="${IMAGE_ARCHIVE:-kuaidai-images-${TAG}-linux-amd64.tar.gz}"
BUILDER="${BUILDER:-orbstack}"
BUILD_ARGS=(--builder "$BUILDER" --platform linux/amd64 --provenance=false --sbom=false --load)

echo "Building linux/amd64 images with tag ${TAG}"
docker buildx build "${BUILD_ARGS[@]}" -t "kuaidai-midway:${TAG}" -f Dockerfile .
docker buildx build "${BUILD_ARGS[@]}" -t "kuaidai-h5:${TAG}" -f web/h5/Dockerfile web/h5
docker buildx build "${BUILD_ARGS[@]}" -t "kuaidai-admin:${TAG}" -f web/admin/Dockerfile web/admin

echo "Exporting ${OUT}"
docker save "kuaidai-midway:${TAG}" "kuaidai-h5:${TAG}" "kuaidai-admin:${TAG}" \
  | gzip -9 > "$OUT"

echo "Created: $ROOT_DIR/$OUT"
du -h "$OUT"
