echo "== TREE =="
find src -type f -not -path "*/node_modules/*" | sort
echo
echo "== DEPENDENCIES =="
grep -A20 '"dependencies"' package.json
echo
echo "== KEYWORD HITS =="
grep -rnIiE "skeleton|shipping|neumorph|xwallet|wallet_balance|badge|bubble|vip" src | cut -c1-150 | head -200
