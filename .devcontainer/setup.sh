#!/bin/bash

# Check for package managers in this order of preference
if command -v pnpm &>/dev/null; then
    echo "🚀 Found pnpm, using it for installation"
    pnpm install
elif command -v yarn &>/dev/null; then
    echo "🧶 Found yarn, using it for installation"
    yarn install
else
    echo "📦 Using npm for installation"
    npm installs
fi

# Install dev dependencies
echo "✅ Installation complete!"
