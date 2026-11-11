for f in src/pages/GlobalChat.js src/pages/GlobalChat.css src/pages/Vip.js src/components/BannerImage.js; do
echo; echo "######## $f ########"; cat "$f"
done
echo; echo "######## Xcards.js (back/nav lines) ########"
grep -nE "ArrowLeft|navigate|back|Back|useNavigate|import" src/pages/Xcards.js | head -40
echo; echo "######## App.js (vip/routes) ########"
grep -niE "vip|xcards|BannerImage|path=" src/App.js | head -60
echo; echo "######## Home.js banner ########"
grep -nE "Banner|banner" src/pages/Home.js | head -30
