echo "== files that mention YouTube / YT PREMIUM =="; grep -rliE "ytpremium|yt premium|youtube|YT_API|yt-premium" src public package.json render.yaml 2>/dev/null
echo; echo "== routes =="; grep -nE "yt|premium|digital|hub" src/App.js | cut -c1-140
echo; echo "== env names used in code =="; grep -rhoE "(process\.env|import\.meta\.env)\.[A-Za-z_0-9]+" src | sort | uniq -c
echo; echo "== render.yaml (names only) =="; grep -nE "^[[:space:]]*-?[[:space:]]*(key|name|type|buildCommand|startCommand|rootDir|staticPublishPath):" render.yaml | cut -c1-120
echo; echo "== PIN system =="; cut -c1-170 src/lib/pinBus.js | head -70; echo; cut -c1-170 src/components/PinHost.js | head -90
echo; echo "== Digital Hub =="; cut -c1-170 src/pages/xf/DigitalHub.js | head -120
echo; echo "== backend =="; ls ~/xmarket-backend 2>/dev/null; grep -E '"(express|cors|node-fetch|axios|@supabase/supabase-js)"' ~/xmarket-backend/package.json 2>/dev/null
find ~/xmarket-backend -type f \( -name "*.js" -o -name "*.mjs" \) -not -path "*/node_modules/*" 2>/dev/null | head -20
find ~/xmarket-backend -type f \( -name "*.js" -o -name "*.mjs" \) -not -path "*/node_modules/*" 2>/dev/null | xargs grep -nE "youtube|YT_API|app\.(get|post)" 2>/dev/null | cut -c1-140 | head -20
