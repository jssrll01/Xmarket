echo "== pages =="; ls src/pages src/pages/xw | grep -iE "review|search|order|xw|load|send|withdraw|vip|product|cart|checkout"
echo; echo "== review code =="; grep -rln "review" src | head -n 12
echo; echo "== search page (head) =="; f=$(ls src/pages | grep -i "^search" | head -n 1); echo "$f"; head -n 70 "src/pages/$f" | cut -c1-170
echo; echo "== xw ui.js =="; head -n 60 src/pages/xw/ui.js | cut -c1-170
echo; echo "== XwWithdraw/BuyLoad rpc calls =="; grep -rnE "rpc\('(xwallet|xw_|buy_load|withdraw)" src | cut -c1-150 | head -n 15
echo; echo "== cloudinary =="; grep -rn "cloudinary" src | cut -c1-140 | head -n 8
