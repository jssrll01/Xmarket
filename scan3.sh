for f in src/lib/shipping.js src/lib/xwallet.js src/components/OrderTotals.jsx src/context/AuthContext.js; do
echo; echo "######## $f ########"; cat "$f"
done
echo; echo "######## Checkout.js 120-140 ########"; sed -n 120,140p src/pages/Checkout.js
echo; echo "######## Checkout.js 285-315 ########"; sed -n 285,315p src/pages/Checkout.js
echo; echo "######## Checkout.js 385-405 ########"; sed -n 385,405p src/pages/Checkout.js
echo; echo "######## name displays ########"
grep -rnE "first_name|last_name|full_name|username" src/pages/Profile.js src/pages/Account.js src/components/UserMenu.js | head -40
