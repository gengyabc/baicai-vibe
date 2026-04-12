#!/usr/bin/env bash

set -euo pipefail

echo "Installing baicai-vibe globally..."
echo ""

GLOBAL_DIR="$HOME/.config"
GLOBAL_LINK="$GLOBAL_DIR/opencode"
SOURCE_DIR="$HOME/programming/baicai-vibe/.opencode"

# Check if source repo exists
if [ ! -d "$SOURCE_DIR" ]; then
  echo "❌ ERROR: baicai-vibe repo not found at: $SOURCE_DIR"
  echo ""
  echo "Please clone baicai-vibe repo to ~/programming/baicai-vibe/"
  echo "Then run this script again."
  exit 1
fi

# Create global directory if needed
mkdir -p "$GLOBAL_DIR"

# Remove existing symlink if exists
if [ -e "$GLOBAL_LINK" ] || [ -L "$GLOBAL_LINK" ]; then
  echo "Removing existing global symlink..."
  rm -rf "$GLOBAL_LINK"
fi

# Create global symlink
ln -s "$SOURCE_DIR" "$GLOBAL_LINK"

echo "✓ Global symlink created: $GLOBAL_LINK -> $SOURCE_DIR"
echo ""

# Verify symlink works
echo "Verifying symlink..."
if [ -d "$GLOBAL_LINK" ]; then
  echo "✓ Symlink resolves correctly"
  echo "✓ Global baicai-vibe is now accessible from all projects"
  echo ""
  echo "Available artifacts:"
  ls -la "$GLOBAL_LINK" | grep -E "^d" | awk '{print "  -", $NF}'
else
  echo "❌ ERROR: Symlink does not resolve correctly"
  exit 1
fi

echo ""
echo "Installation complete!"
echo ""
echo "Usage in projects:"
echo "  ln -s ~/.config/opencode .opencode/_vendor/baicai-vibe"
echo ""
echo "Or use the setup script in baicai-vibe-coding:"
echo "  cd baicai-vibe-coding && ./scripts/setup-vendor-symlink.sh"
