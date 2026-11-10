echo "== files =="; grep -rlE "market_items|market_buy|market_gift|Market Shop|market_purchases" src
echo; echo "== loyalty / points in the app =="; grep -rnE "loyalty_points|loyalty_ledger|loyalty" src | cut -c1-130 | head -25
echo; echo "== who shows names or avatars =="; grep -rlE "VipBadge|<Avatar|gc-av|gc-name" src
echo; echo "== product card =="; ls src/components | grep -i "card\|product"
echo; echo "== lib/vip.js exports =="; grep -n "^export" src/lib/vip.js
for f in $(grep -rlE "market_items|market_buy|market_gift" src | head -3); do echo; echo "######## $f ########"; cut -c1-170 "$f" | head -n 130; done
