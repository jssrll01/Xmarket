#!/bin/bash

echo "=== Starting Xmarket Diagnostics ==="
if [ -d "xmarket" ]; then
    cd xmarket
    echo "Xmarket directory found and entered."
else
    echo "Working in current directory."
fi

echo "Running system checks..."
npm run test:diag 2>/dev/null || echo "No npm test:diag script found, continuing..."
git status

echo "=== Updating Game Names ==="
# Find relevant files while explicitly ignoring node_modules, .git, dist, and build to prevent hanging
find . -type f \
    \( -name "*.json" -o -name "*.js" -o -name "*.ts" -o -name "*.py" -o -name "*.php" -o -name "*.sql" -o -name "*.html" -o -name "*.vue" -o -name "*.jsx" -o -name "*.tsx" \) \
    -not -path "*/node_modules/*" \
    -not -path "*/.git/*" \
    -not -path "*/dist/*" \
    -not -path "*/build/*" | while IFS= read -r file; do
    
    if grep -qE -i "spin the wheel|mystery box|coin flip|color game|hi-lo|red or black" "$file"; then
        echo "Updating file: $file"
        sed -i 's/spin the wheel/wheel of fortune ultra/g' "$file"
        sed -i 's/Spin the Wheel/Wheel of Fortune Ultra/g' "$file"
        sed -i 's/mystery box/box of mystery/g' "$file"
        sed -i 's/Mystery Box/Box of Mystery/g' "$file"
        sed -i 's/coin flip/head or tails/g' "$file"
        sed -i 's/Coin Flip/Head or Tails/g' "$file"
        sed -i 's/color game/color game extreme/g' "$file"
        sed -i 's/Color Game/Color Game Extreme/g' "$file"
        sed -i 's/hi-lo/Hilo/g' "$file"
        sed -i 's/Hi-Lo/Hilo/g' "$file"
        sed -i 's/Red or black/red black 88/g' "$file"
        sed -i 's/Red or Black/Red Black 88/g' "$file"
    fi
done

echo "=== Diagnostics and Renaming Complete ==="
