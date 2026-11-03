import { useEffect, useState } from "react";
import {
  Search, ShoppingBag, Wallet, ShieldCheck, Truck, BadgeCheck, Zap, Store,
  Smartphone, Gamepad2, Gift, ChevronDown, Menu, X, ArrowRight, Download,
  Tag, Percent, Coins, ArrowUp, Bell, Package, CheckCircle2, Sparkles,
  UserPlus, CreditCard,
} from "lucide-react";
import { useParallax } from "./useParallax.js";
import "./styles.css";

// EDIT THIS: the URL of your main XMARKET app
const APP_URL = "https://xmarket-app.onrender.com";

// EDIT THESE with your real numbers
const stats = [
  { n: 1, suffix: "", label: "Wallet for everything" },
  { n: 24, suffix: "/7", label: "Web app always open" },
  { n: 100, suffix: "%", label: "Verified sellers" },
];

const marquee = [
  "Instant top-ups", "Game credits", "Verified sellers", "Secure Xwallet",
  "Seasonal promos", "Fast delivery", "Install free",
];

const hot = [
  { icon: Zap, tag: "Instant", title: "Top-ups & send money", text: "Recharge in seconds with Xwallet." },
  { icon: Gamepad2, tag: "Hot", title: "Game credits", text: "Digital goods delivered right away." },
  { icon: Percent, tag: "Promo", title: "Seasonal promos", text: "Vouchers and bundle discounts." },
  { icon: Tag, tag: "New", title: "Fresh arrivals", text: "New products from verified sellers." },
];

const trust = [
  { icon: ShieldCheck, title: "Buyer protection", text: "Refund support if something goes wrong." },
  { icon: Wallet, title: "Secure Xwallet", text: "Pay and top up in one safe wallet." },
  { icon: BadgeCheck, title: "Verified sellers", text: "Every store is checked before it sells." },
  { icon: Truck, title: "Fast delivery", text: "Instant digital and quick shipped orders." },
];

const buy = [
  { icon: UserPlus, title: "Create an account", text: "Sign up free in under a minute." },
  { icon: CreditCard, title: "Top up Xwallet", text: "Add funds and keep checkout one tap." },
  { icon: Package, title: "Shop and receive", text: "Order from verified sellers and track it." },
];


const faqs = [
  ["What is XMARKET?", "XMARKET is an online marketplace where you can shop from verified sellers and pay with Xwallet."],
  ["What is Xwallet?", "Xwallet is the built-in wallet for paying, topping up and receiving earnings on XMARKET."],
  ["Is it safe to buy?", "Sellers are verified and refund support is available if an order has a problem."],
  ["Can I install it on my phone?", "Yes. Use the Install app button to add XMARKET to your home screen."],
];

function Header() {
  const [open, setOpen] = useState(false);
  const go = () => setOpen(false);
  return (
    <header className="header">
      <div className="wrap header-in">
        <a className="logo" href="#top">
          <span className="logo-mark"><ShoppingBag size={20} /></span>
          <b>XMARKET</b>
        </a>
        <form className="search neu-in" action={APP_URL} method="get">
          <Search size={18} />
          <input name="q" placeholder="Search products, stores, top-ups" aria-label="Search" />
        </form>
        <nav className={"nav" + (open ? " open" : "")}>
          <a href="#features" onClick={go}>Features</a>
          <a href="#wallet" onClick={go}>Xwallet</a>
          <a href="#faq" onClick={go}>Help</a>
          <a className="btn btn-primary btn-sm" href={APP_URL} onClick={go}>Log in</a>
        </nav>
        <button className="menu neu-btn" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <div id="progress" className="progress" />
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="blob b1" data-speed="-0.3" data-origin="top" />
      <div className="blob b2" data-speed="-0.2" data-origin="top" />
      <div className="float neu f1" style={{ "--d": 60 }} data-speed="-0.16" data-origin="top" data-rotate="-0.03"><Wallet size={28} /></div>
      <div className="float neu f2" style={{ "--d": -50 }} data-speed="0.12" data-origin="top"><ShoppingBag size={24} /></div>
      <div className="float neu f3" style={{ "--d": 40 }} data-speed="-0.24" data-origin="top"><Coins size={26} /></div>
      <div className="float neu f4" style={{ "--d": -70 }} data-speed="0.18" data-origin="top" data-rotate="0.04"><Gift size={22} /></div>

      <div className="wrap hero-grid">
        <div className="hero-text" data-speed="-0.08" data-origin="top">
          <span className="pill neu-in"><Zap size={14} /> Shop smart. Pay with Xwallet.</span>
          <h1>Your world of <span className="accent">great deals</span></h1>
          <p className="lead">
            Shop from verified sellers, pay with Xwallet and get instant delivery.
          </p>
          <div className="cta">
            <a className="btn btn-primary" href={APP_URL}>Shop now <ArrowRight size={18} /></a>
          </div>
          <div className="mini-trust">
            <span><ShieldCheck size={16} /> Buyer protection</span>
            <span><BadgeCheck size={16} /> Verified sellers</span>
          </div>
        </div>

        <div className="phone-wrap" data-speed="0.06" data-origin="top">
          <div className="glow" data-speed="-0.1" data-origin="top" />
          <div className="phone neu" data-tilt>
            <div className="notch" />
            <div className="screen">
              <div className="s-top"><ShoppingBag size={15} /><b>XMARKET</b><Bell size={15} /></div>
              <div className="s-search neu-in"><Search size={13} /> Search deals</div>
              <div className="s-card">
                <span>Xwallet</span>
                <b>₱ ••••••</b>
                <div className="s-chips"><i>Top up</i><i>Pay</i></div>
              </div>
              <div className="s-grid">
                <div className="neu-in"><Zap size={18} /><small>Send money</small></div>
                <div className="neu-in"><Gamepad2 size={18} /><small>Games</small></div>
                <div className="neu-in"><Tag size={18} /><small>Promos</small></div>
              </div>
            </div>
          </div>
          <div className="notif n1 neu" data-speed="-0.14" data-origin="top">
            <CheckCircle2 size={20} /><div><b>Top-up successful</b><small>Added to Xwallet</small></div>
          </div>
          <div className="notif n2 neu" data-speed="0.1" data-origin="top">
            <Truck size={20} /><div><b>Order on the way</b><small>Track in the app</small></div>
          </div>
          <div className="notif n3 neu" data-speed="-0.2" data-origin="top">
            <Percent size={20} /><div><b>Promo unlocked</b><small>Voucher ready</small></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="track">
        {[...marquee, ...marquee].map((t, i) => (
          <span key={i}><Sparkles size={16} />{t}</span>
        ))}
      </div>
    </div>
  );
}

function Trust() {
  return (
    <section className="wrap trust">
      {trust.map((t, i) => (
        <div className="neu card trust-card" key={t.title} data-reveal style={{ "--i": i }}>
          <span className="ico neu-in"><t.icon size={22} /></span>
          <div><h3>{t.title}</h3><p>{t.text}</p></div>
        </div>
      ))}
    </section>
  );
}

function Features() {
  return (
    <section className="wrap section" id="features">
      <div className="blob b3" data-speed="0.2" />
      <div className="sec-head center-head" data-reveal>
        <span className="kicker">Features</span>
        <h2>Everything you need, in one app</h2>
        <p>Shop, top up and pay without switching between apps.</p>
      </div>
      <div className="hot-grid">
        {hot.map((h, i) => (
          <a className="neu card hot" href={APP_URL} key={h.title} data-reveal style={{ "--i": i }}>
            <span className="badge">{h.tag}</span>
            <span className="ico neu-in"><h.icon size={24} /></span>
            <h3>{h.title}</h3>
            <p>{h.text}</p>
            <span className="more">Explore <ArrowRight size={14} /></span>
          </a>
        ))}
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="wrap section">
      <div className="neu stats" data-reveal>
        {stats.map((s) => (
          <div className="stat" key={s.label}>
            <b data-count={s.n} data-suffix={s.suffix}>{s.n}{s.suffix}</b>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowBuy() {
  return (
    <section className="wrap section">
      <div className="sec-head center-head" data-reveal>
        <span className="kicker">For buyers</span>
        <h2>Start shopping in 3 easy steps</h2>
      </div>
      <div className="how">
        <div className="how-line" />
        {buy.map((b, i) => (
          <div className="how-step" key={b.title} data-reveal style={{ "--i": i }}>
            <span className="how-ico neu"><b.icon size={26} /></span>
            <h3>{b.title}</h3>
            <p>{b.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function WalletSection() {
  return (
    <section className="wrap section wallet" id="wallet">
      <div className="float neu f5" data-speed="-0.14"><Coins size={26} /></div>
      <div className="wallet-text" data-reveal>
        <span className="kicker">Xwallet</span>
        <h2>One wallet for everything</h2>
        <p>Top up, pay at checkout and claim promos, all in one place.</p>
        <ul className="checks">
          <li><BadgeCheck size={18} /> Fast top-ups</li>
          <li><BadgeCheck size={18} /> One-tap checkout</li>
          <li><BadgeCheck size={18} /> Promos and vouchers</li>
        </ul>
        <a className="btn btn-primary" href={APP_URL}>Open Xwallet <ArrowRight size={18} /></a>
      </div>
      <div className="wallet-visual" data-reveal>
        <div className="neu wallet-card" data-tilt>
          <div className="wc-top"><Wallet size={22} /><b>Xwallet</b></div>
          <div className="wc-bal">Balance</div>
          <div className="wc-amt">₱ ••••••</div>
          <div className="wc-row"><span className="chip">Top up</span><span className="chip">Pay</span><span className="chip">Send</span></div>
        </div>
        <div className="float neu f9" data-speed="0.18" data-rotate="0.05"><Gift size={22} /></div>
      </div>
    </section>
  );
}

function Install() {
  const [evt, setEvt] = useState(null);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const h = (e) => { e.preventDefault(); setEvt(e); };
    const d = () => setDone(true);
    window.addEventListener("beforeinstallprompt", h);
    window.addEventListener("appinstalled", d);
    return () => {
      window.removeEventListener("beforeinstallprompt", h);
      window.removeEventListener("appinstalled", d);
    };
  }, []);
  const install = async () => {
    if (!evt) return;
    evt.prompt();
    await evt.userChoice;
    setEvt(null);
  };
  return (
    <section className="wrap section">
      <div className="neu install" data-reveal>
        <span className="ico neu-in big"><Smartphone size={30} /></span>
        <div className="install-text">
          <h2>Get the XMARKET app</h2>
          <p>{done ? "Installed. Find XMARKET on your home screen." : "Install it free on your phone for faster shopping. No app store needed."}</p>
        </div>
        {evt && !done ? (
          <button className="btn btn-primary" onClick={install}><Download size={18} /> Install app</button>
        ) : (
          <a className="btn btn-neu" href={APP_URL}>Open web app</a>
        )}
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="wrap section narrow" id="faq">
      <h2 className="center" data-reveal>Frequently asked questions</h2>
      {faqs.map(([q, a], i) => (
        <details className="neu faq" key={q} data-reveal style={{ "--i": i }}>
          <summary>{q}<ChevronDown size={18} /></summary>
          <p>{a}</p>
        </details>
      ))}
    </section>
  );
}

function FinalCta() {
  return (
    <section className="wrap section">
      <div className="neu cta-band" data-reveal>
        <div className="float neu f7" data-speed="0.16" data-rotate="0.05"><Gift size={24} /></div>
        <div className="float neu f8" data-speed="-0.14"><Coins size={24} /></div>
        <h2>Ready to find your next great deal?</h2>
        <p className="lead">Join XMARKET today. Shop, top up and send money from one place.</p>
        <div className="cta">
          <a className="btn btn-primary" href={APP_URL}>Get started <ArrowRight size={18} /></a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap foot-in">
        <div>
          <a className="logo" href="#top"><span className="logo-mark"><ShoppingBag size={18} /></span><b>XMARKET</b></a>
          <p className="muted">Your world of great deals.</p>
        </div>
        <div className="foot-links">
          <a href="#features">Features</a>
          <a href="#wallet">Xwallet</a>
          <a href="#faq">Help</a>
          <a href={APP_URL}>Open app</a>
        </div>
      </div>
      <div className="wrap copy">© {new Date().getFullYear()} XMARKET. All rights reserved.</div>
    </footer>
  );
}

export default function App() {
  useParallax();
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Trust />
        <Features />
        <Stats />
        <HowBuy />
        <WalletSection />
        <Install />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <button
        id="totop"
        className="totop neu-btn"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp size={20} />
      </button>
    </>
  );
}
