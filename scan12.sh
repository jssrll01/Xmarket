echo "== Checkout.js rpc/insert calls =="; grep -nE "rpc\(|from\('orders'\)|from\('order_items'\)|insert" src/pages/Checkout.js | cut -c1-160 | head -n 20
echo; echo "== OrderDetail.js (head) =="; head -n 40 src/pages/OrderDetail.js | cut -c1-170
echo; echo "== ProductDetails.js: review/seller parts =="; grep -nE "review|seller|store|owner|created_by" src/pages/ProductDetails.js | cut -c1-150 | head -n 20
echo; echo "== Vip.js (head) =="; head -n 60 src/pages/Vip.js | cut -c1-170
