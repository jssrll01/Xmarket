for f in src/yt/YtGate.js src/yt/YtRoot.js src/yt/app/lib/ytSearch.js src/yt/app/components/Navbar.jsx src/yt/app/App.jsx; do echo "=== $f"; cut -c1-170 $f | head -80; done
echo "=== PinHost rest"; cut -c1-170 src/components/PinHost.js | sed -n '90,170p'
echo "=== pin rpc names"; grep -rhoE "xwallet_pin_[a-z_]+" src *.sql ~/xmarket-backend/*.sql 2>/dev/null | sort | uniq -c
echo "=== backend env names"; grep -rhoE "process\.env\.[A-Za-z_0-9]+" ~/xmarket-backend/server | sort | uniq -c
echo "=== back/return in yt"; grep -rnE "navigate\(|history\.|ArrowLeft|Back|to=\"/\"" src/yt | cut -c1-150 | head -20
