#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
IOS_DIR="$ROOT_DIR/ios"
BUILD_DIR="$IOS_DIR/build"
OUTPUT_DIR="$ROOT_DIR/dist-ios"
APP_PATH="$BUILD_DIR/Build/Products/Release-iphoneos/App.app"

if ! command -v xcodebuild >/dev/null 2>&1; then
  echo "xcodebuild 未安装，请先安装并启动一次 Xcode。" >&2
  exit 1
fi

PROJECT_ARGS=(-project "$IOS_DIR/App/App.xcodeproj")
if [[ -f "$IOS_DIR/App/App.xcworkspace/contents.xcworkspacedata" ]]; then
  PROJECT_ARGS=(-workspace "$IOS_DIR/App/App.xcworkspace")
fi

xcodebuild "${PROJECT_ARGS[@]}" \
  -scheme App \
  -configuration Release \
  -sdk iphoneos \
  -derivedDataPath "$BUILD_DIR" \
  CODE_SIGNING_ALLOWED=NO \
  CODE_SIGNING_REQUIRED=NO \
  clean build

if [[ ! -d "$APP_PATH" ]]; then
  echo "未找到构建产物：$APP_PATH" >&2
  exit 1
fi

rm -rf "$OUTPUT_DIR/Payload"
mkdir -p "$OUTPUT_DIR/Payload"
cp -R "$APP_PATH" "$OUTPUT_DIR/Payload/"
rm -f "$OUTPUT_DIR/kuaidai-unsigned.ipa"
(cd "$OUTPUT_DIR" && /usr/bin/zip -qry kuaidai-unsigned.ipa Payload)
rm -rf "$OUTPUT_DIR/Payload"

echo "无签名 IPA：$OUTPUT_DIR/kuaidai-unsigned.ipa"
