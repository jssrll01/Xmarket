echo "== viewport =="; grep -n "viewport" public/index.html
echo; echo "== Home: flash/save/bundles row =="; grep -n "Save More\|Bundles\|Flash Sale" src/pages/Home.js | cut -c1-140
echo; echo "== xf pages =="; wc -l src/pages/xf/*.js
echo; echo "== routes =="; grep -n "xf\|course\|Course\|feature\|Feature\|digital\|Digital" src/App.js | cut -c1-150
echo; echo "== Skeleton =="; grep -n "^export" src/components/Skeleton.js; grep -n "\.sk\b\|@keyframes" src/index.css | head -6
echo; echo "== xf: loading, search, balance, back button =="; grep -n "loading\|Skeleton\|useState(null)\|fetchWallet\|balance\|Search\|ArrowLeft\|icon-btn" src/pages/xf/*.js | cut -c1-140
