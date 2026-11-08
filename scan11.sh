echo "== xwallet.js =="; cat src/lib/xwallet.js | cut -c1-170
echo; echo "== Xwallet.js (head) =="; head -n 70 src/pages/Xwallet.js | cut -c1-170
echo; echo "== XwSend.js (success part) =="; grep -nE "transfer|success|done|setDone|receipt" src/pages/xw/XwSend.js | head -n 14 | cut -c1-150
echo; echo "== review write code =="; grep -rnE "from\('reviews'\)|rpc\('.*review" src | cut -c1-150 | head -n 10
