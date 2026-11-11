import { useEffect } from "react";

export function useParallax() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const cleanups = [];

    // reveal on scroll
    const rev = Array.from(document.querySelectorAll("[data-reveal]"));
    if (reduce || !("IntersectionObserver" in window)) {
      rev.forEach((e) => e.classList.add("in"));
    } else {
      const io = new IntersectionObserver(
        (list) => {
          list.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add("in");
              io.unobserve(en.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      rev.forEach((e) => io.observe(e));
      cleanups.push(() => io.disconnect());
    }

    // count-up numbers
    const counters = Array.from(document.querySelectorAll("[data-count]"));
    if (!reduce && "IntersectionObserver" in window) {
      const co = new IntersectionObserver(
        (list) => {
          list.forEach((en) => {
            if (!en.isIntersecting) return;
            const el = en.target;
            co.unobserve(el);
            const end = parseFloat(el.dataset.count);
            const suf = el.dataset.suffix || "";
            const t0 = performance.now();
            const tick = (t) => {
              const k = Math.min(1, (t - t0) / 1400);
              const e = 1 - Math.pow(1 - k, 3);
              el.textContent = Math.round(end * e) + suf;
              if (k < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          });
        },
        { threshold: 0.6 }
      );
      counters.forEach((c) => co.observe(c));
      cleanups.push(() => co.disconnect());
    }

    // scroll parallax + progress bar + back-to-top
    const px = Array.from(document.querySelectorAll("[data-speed]"));
    const bar = document.getElementById("progress");
    const totop = document.getElementById("totop");
    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      const y = window.scrollY;
      if (!reduce) {
        px.forEach((el) => {
          const p = el.parentElement.getBoundingClientRect();
          if (p.bottom < -300 || p.top > vh + 300) return;
          const d = el.dataset.origin === "top" ? p.top : p.top + p.height / 2 - vh / 2;
          let t = "translate3d(0," + (d * parseFloat(el.dataset.speed)).toFixed(1) + "px,0)";
          if (el.dataset.rotate) t += " rotate(" + (d * parseFloat(el.dataset.rotate)).toFixed(2) + "deg)";
          el.style.transform = t;
        });
      }
      if (bar) {
        const h = document.documentElement.scrollHeight - vh;
        bar.style.transform = "scaleX(" + (h > 0 ? y / h : 0).toFixed(4) + ")";
      }
      if (totop) totop.classList.toggle("show", y > 700);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    cleanups.push(() => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    });

    // mouse parallax in hero (desktop only)
    const hero = document.querySelector(".hero");
    if (hero && fine && !reduce) {
      const mv = (e) => {
        const r = hero.getBoundingClientRect();
        hero.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
        hero.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
      };
      const lv = () => {
        hero.style.setProperty("--mx", 0);
        hero.style.setProperty("--my", 0);
      };
      hero.addEventListener("pointermove", mv);
      hero.addEventListener("pointerleave", lv);
      cleanups.push(() => {
        hero.removeEventListener("pointermove", mv);
        hero.removeEventListener("pointerleave", lv);
      });
    }

    // 3D tilt on cards (desktop only)
    if (fine && !reduce) {
      document.querySelectorAll("[data-tilt]").forEach((el) => {
        const mv = (e) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          el.style.setProperty("--ry", (x * 14).toFixed(2) + "deg");
          el.style.setProperty("--rx", (-y * 14).toFixed(2) + "deg");
        };
        const lv = () => {
          el.style.setProperty("--rx", "0deg");
          el.style.setProperty("--ry", "0deg");
        };
        el.addEventListener("pointermove", mv);
        el.addEventListener("pointerleave", lv);
        cleanups.push(() => {
          el.removeEventListener("pointermove", mv);
          el.removeEventListener("pointerleave", lv);
        });
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);
}
