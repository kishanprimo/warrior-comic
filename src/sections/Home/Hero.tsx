"use client";

import React, { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* Content (from warriorcomics.com)                                    */
/* ------------------------------------------------------------------ */
const BASE = "/wc-content/Images";
const AVATAR = "/Images/Avtar/avtarman1.png";

const TITLE = "WC-UNIVERSE";
const SUBTITLE = "Let's create another world";
const PARAGRAPH =
  "Warrior Comics is home to enthusiastic artists and creative, entertaining stories. Step into the WC-Universe and meet Avatarman, Merlyn, Petra, Ange Apollo, Doctor Handel Von Neumann and Sentor.";

const COMICS = [
  { src: "/Images/Imgs/comic-1.jpg", caption: "Warrior Comics" },
  { src: "/Images/Imgs/comic-2.jpg", caption: "Coming soon" },
  { src: "/Images/Imgs/comic-3.jpg", caption: "Coming soon" },
  { src: "/Images/Imgs/comic-4.jpg", caption: "A doctor in his early thirties" },
];

// Vertical "curtain" strips (relative widths) that slide in from the right
const STRIPS = [1.2, 0.8, 1.4, 0.9, 1.1];

// First load waits for the site loader (same 5.6s as the navbar intro).
const INTRO_DELAY_MS = 5600;

/* ------------------------------------------------------------------ */
/* Timeline — strips now glide together in ONE quick sweep, then cards */
/* appear immediately after without a long wait.                       */
/* ------------------------------------------------------------------ */
const T = {
  shiftA: 0.04, // title glides aside
  shiftB: 0.16,
  outA: 0.2, // title/copy leave
  outB: 0.26,

  /* ---- Strips: one smooth sweep, no long stagger ---- */
  stripStart: 0.22, // first strip begins
  stripStagger: 0.012, // tiny stagger between strips (was 0.03)
  stripDur: 0.14, // each strip's travel (fast, smooth)

  /* Last strip ends at 0.22 + 4*0.012 + 0.14 = 0.408 */
  featA: 0.4, // "Featured" heading appears right after strips land
  featB: 0.47,
  cardsShow: 0.4, // cards become visible as soon as strips are done
  cardsIn: 0.41, // the row of cards slides in
  cardsInDur: 0.08,
  cardsA: 0.5, // cards travel one by one
  cardsB: 0.94,
};

/* ------------------------------------------------------------------ */
/* Math helpers                                                        */
/* ------------------------------------------------------------------ */
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const smooth = (a: number, b: number, v: number) => {
  const t = seg(v, a, b);
  return t * t * (3 - 2 * t);
};

const EASE = "cubic-bezier(0.77,0,0.175,1)";

/* ------------------------------------------------------------------ */
/* Continuous-animation keyframes                                      */
/* ------------------------------------------------------------------ */
const HERO_CSS = `
@keyframes wcSpin { to { transform: rotate(360deg); } }
@keyframes wcSpinRev { to { transform: rotate(-360deg); } }
@keyframes wcRipple {
  0%   { transform: scale(.2);  opacity: 0; }
  15%  { opacity: .75; }
  100% { transform: scale(1.1); opacity: 0; }
}
@keyframes wcFloat {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-10px); }
}
@keyframes wcPulse {
  0%, 100% { opacity: .5; transform: scale(1); }
  50%      { opacity: 1;  transform: scale(1.08); }
}
@keyframes wcTwinkle {
  0%, 100% { opacity: .25; transform: scale(.8); }
  50%      { opacity: 1;   transform: scale(1.3); }
}
.wc-spin     { animation: wcSpin 46s linear infinite; }
.wc-spin-mid { animation: wcSpin 22s linear infinite; }
.wc-spin-rev { animation: wcSpinRev 34s linear infinite; }
.wc-spin-fast{ animation: wcSpin 7s linear infinite; }
.wc-ripple   { animation: wcRipple 4.2s cubic-bezier(.2,.6,.3,1) infinite; }
.wc-float    { animation: wcFloat 6s ease-in-out infinite; }
.wc-pulse    { animation: wcPulse 5s ease-in-out infinite; }
.wc-twinkle  { animation: wcTwinkle 3.2s ease-in-out infinite; }
@media (pointer: fine) {
  .wc-cursor-none, .wc-cursor-none * { cursor: none !important; }
}
@media (prefers-reduced-motion: reduce) {
  .wc-spin, .wc-spin-mid, .wc-spin-rev, .wc-spin-fast,
  .wc-ripple, .wc-float, .wc-pulse, .wc-twinkle { animation: none !important; }
}
`;

// small floating sparks around the avatar: [left%, top%, delay s, size px]
const SPARKS: [number, number, number, number][] = [
  [22, 30, 0, 4],
  [78, 26, 0.8, 3],
  [30, 70, 1.6, 3],
  [70, 66, 2.2, 5],
  [50, 14, 1.1, 3],
  [14, 52, 2.7, 3],
  [86, 50, 0.4, 4],
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const paraRef = useRef<HTMLDivElement>(null);
  const stripRefs = useRef<(HTMLDivElement | null)[]>([]);
  const featRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const parRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const [entered, setEntered] = useState(false);

  /* ---- Entrance ---- */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let first = true;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (timer) clearTimeout(timer);
        if (entry.isIntersecting) {
          if (first) {
            first = false;
            timer = setTimeout(() => setEntered(true), INTRO_DELAY_MS);
          } else {
            setEntered(true);
          }
        } else {
          first = false;
          setEntered(false);
        }
      },
      { threshold: [0, 0.02] }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, []);

  /* ---- Scroll-linked timeline ---- */
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let cur = 0;
    let target = 0;
    let last = -1;
    let vw = window.innerWidth;
    let vh = window.innerHeight;

    const readScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - vh;
      target = total > 0 ? clamp(-r.top / total) : 0;
    };

    const onResize = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      last = -1;
      readScroll();
    };

    const apply = (p: number) => {
      const desktop = vw >= 768;

      /* Phase 2 — title glides aside, copy fades in */
      const b = easeInOut(seg(p, T.shiftA, T.shiftB));
      const out = easeInOut(seg(p, T.outA, T.outB));

      if (titleRef.current) {
        const tx = desktop ? -b * vw * 0.23 : 0;
        const ty = desktop ? 0 : -b * vh * 0.2;
        titleRef.current.style.transform = `translate3d(${tx}px, ${
          ty - out * 50
        }px, 0) scale(${1 - 0.22 * b})`;
        titleRef.current.style.opacity = String(1 - out);
      }
      if (paraRef.current) {
        const r = easeOut(seg(p, 0.08, 0.18));
        paraRef.current.style.opacity = String(r * (1 - out));
        paraRef.current.style.transform = `translate3d(0, ${
          (1 - r) * 34 - out * 50
        }px, 0)`;
      }
      if (avatarRef.current) {
        avatarRef.current.style.transform = `translate3d(0, ${
          b * -1.5
        }%, 0) scale(${1 + 0.07 * b})`;
      }

      /* Phase 3 — strips glide in one smooth sweep (small stagger) */
      stripRefs.current.forEach((s, i) => {
        if (!s) return;
        const start = T.stripStart + i * T.stripStagger;
        const e = easeInOut(seg(p, start, start + T.stripDur));
        s.style.transform = `translate3d(${(1 - e) * (vw + 40)}px, 0, 0)`;
      });

      /* Featured heading — appears right after strips land */
      if (featRef.current) {
        const f = easeOut(seg(p, T.featA, T.featB));
        featRef.current.style.opacity = String(f);
        featRef.current.style.transform = `translate3d(0, ${(1 - f) * 30}px, 0)`;
      }

      /* Phase 4 — cards travel horizontally, pausing on each one */
      const q = seg(p, T.cardsA, T.cardsB);
      const n = COMICS.length;
      const ch = Math.min(vh * 0.56, vw * 1.05);
      const cw = ch * 0.8;
      const gap = Math.max(20, vw * 0.04);
      const step = cw + gap;

      const sRaw = q * (n - 1);
      const snapped = Math.min(
        n - 1,
        Math.floor(sRaw) + smooth(0.25, 0.75, sRaw - Math.floor(sRaw))
      );
      const entry = easeInOut(seg(p, T.cardsIn, T.cardsIn + T.cardsInDur));
      const shown = p >= T.cardsShow;

      cardRefs.current.forEach((c, i) => {
        if (!c) return;
        const d = Math.min(1, Math.abs(i - snapped));
        const x =
          (vw - cw) / 2 + (i - snapped) * step + (1 - entry) * (vw + i * 40);
        c.style.width = `${cw}px`;
        c.style.visibility = shown ? "visible" : "hidden";
        c.style.opacity = String(shown ? 1 - 0.5 * d : 0);
        c.style.transform = `translate3d(${x}px, -50%, 0) scale(${1 - 0.12 * d})`;
      });

      const barEl = barRef.current;
      if (barEl) barEl.style.transform = `scaleX(${q})`;
      if (counterRef.current) {
        const idx = clamp(Math.round(snapped), 0, n - 1);
        counterRef.current.textContent =
          entry > 0.6 ? `0${idx + 1} / 0${n}` : "";
      }
    };

    const tick = () => {
      cur += (target - cur) * (reduce ? 1 : 0.1);
      if (Math.abs(target - cur) < 0.0002) cur = target;
      if (cur !== last) {
        apply(cur);
        last = cur;
      }
      raf = requestAnimationFrame(tick);
    };

    readScroll();
    cur = target;
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  /* ---- Cursor effects ---- */
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let nx = 0;
    let ny = 0;
    let px = 0;
    let py = 0;
    let sT = 1;
    let sC = 1;
    let hot = false;
    let down = false;
    let inside = false;
    let raf = 0;

    const setInside = (v: boolean) => {
      if (v === inside) return;
      inside = v;
      const o = v ? "1" : "0";
      if (ringRef.current) ringRef.current.style.opacity = o;
      if (dotRef.current) dotRef.current.style.opacity = o;
      if (spotRef.current) spotRef.current.style.opacity = o;
    };
    const target = () => (down ? 0.6 : hot ? 2 : 1);

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const t = e.target as Element | null;
      setInside(!!t?.closest?.("[data-wc-hero]"));
      hot = !!t?.closest?.("a,button");
      sT = target();
      nx = (mx / window.innerWidth - 0.5) * 2;
      ny = (my / window.innerHeight - 0.5) * 2;
    };
    const onDown = () => {
      down = true;
      sT = target();
    };
    const onUp = () => {
      down = false;
      sT = target();
    };
    const onLeave = () => setInside(false);

    const loop = () => {
      const k = reduce ? 1 : 0.16;
      rx += (mx - rx) * k;
      ry += (my - ry) * k;
      sC += (sT - sC) * 0.15;
      px += (nx - px) * (reduce ? 0 : 0.06);
      py += (ny - py) * (reduce ? 0 : 0.06);

      if (ringRef.current)
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${sC})`;
      if (dotRef.current)
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0) scale(${
          hot ? 0 : 1
        })`;
      if (spotRef.current) {
        spotRef.current.style.setProperty("--mx", `${rx}px`);
        spotRef.current.style.setProperty("--my", `${ry}px`);
      }
      if (parRef.current)
        parRef.current.style.transform = `translate3d(${px * -12}px, ${py * -7}px, 0)`;
      if (orbitRef.current)
        orbitRef.current.style.transform = `translate3d(${px * 18}px, ${py * 11}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /* ---------------------------------------------------------------- */
  return (
    <section
      ref={containerRef}
      aria-label="WC-Universe"
      data-wc-hero
      className="wc-cursor-none relative h-[700vh] bg-background text-foreground transition-colors duration-500"
    >
      <style>{HERO_CSS}</style>

      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* ============ LAYER 1 — hero frame ============ */}
        <div
          className="absolute inset-0 bg-nav-left text-nav-left-fg transition-colors duration-500 motion-reduce:transition-none"
          style={{
            clipPath: entered
              ? "inset(0% 0% 0% 0% round 0px)"
              : "inset(40% 14% 0% 14% round 14px)",
            transition: `clip-path 1.5s ${EASE}, background-color 0.5s ease, color 0.5s ease`,
          }}
        >
          {/* Vignette + bottom fade */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,transparent_28%,color-mix(in_oklab,var(--nav-left-bg)_58%,black)_100%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/40 via-black/10 to-transparent"
          />

          {/* Cursor spotlight */}
          <div
            ref={spotRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[5] opacity-0 mix-blend-screen transition-opacity duration-500"
            style={{
              background:
                "radial-gradient(circle 300px at var(--mx, 50%) var(--my, 50%), rgba(120,210,255,0.26), rgba(201,138,61,0.10) 45%, transparent 72%)",
            }}
          />

          {/* Glow behind hero */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[56%] aspect-square w-[min(80vh,90vw)] -translate-x-1/2 -translate-y-1/2"
          >
            <div className="wc-pulse h-full w-full rounded-full bg-accent/15 blur-2xl transition-colors duration-500" />
          </div>

          {/* Orbit system */}
          <div
            ref={orbitRef}
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[56%] aspect-square w-[min(66vh,76vw)] -translate-x-1/2 -translate-y-1/2 will-change-transform"
            style={{
              opacity: entered ? 1 : 0,
              transition: "opacity 1.2s ease-out",
              transitionDelay: entered ? "0.9s" : "0s",
            }}
          >
            <div className="absolute inset-0 rounded-full border border-nav-left-line transition-colors duration-500" />
            <div className="wc-spin-rev absolute -inset-6 rounded-full border border-dashed border-nav-left-line transition-colors duration-500" />
            <div className="wc-spin absolute -inset-14 rounded-full border border-nav-left-line/50 transition-colors duration-500">
              <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_16px_3px_var(--accent)]" />
            </div>
            <div className="wc-spin-mid absolute inset-0">
              <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_14px_4px_rgba(103,232,249,0.7)]" />
              <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-accent shadow-[0_0_10px_2px_var(--accent)]" />
            </div>
            <div className="wc-spin-fast absolute inset-[9%]">
              <span className="absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-nav-left-fg/80 shadow-[0_0_10px_2px_currentColor]" />
            </div>
            {SPARKS.map(([l, t, d, sz], i) => (
              <span
                key={i}
                className="wc-twinkle absolute rounded-full bg-nav-left-fg"
                style={{
                  left: `${l}%`,
                  top: `${t}%`,
                  width: sz,
                  height: sz,
                  animationDelay: `${d}s`,
                }}
              />
            ))}
          </div>

          {/* Ground portal */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-[5vh] flex h-0 justify-center"
            style={{
              perspective: 800,
              opacity: entered ? 1 : 0,
              transition: "opacity 1.4s ease-out",
              transitionDelay: entered ? "1.1s" : "0s",
            }}
          >
            <div
              className="absolute top-0 aspect-square w-[min(62vw,720px)]"
              style={{ transform: "translateY(-50%) rotateX(74deg)" }}
            >
              <div className="wc-pulse absolute inset-[8%] rounded-full bg-cyan-300/25 blur-3xl" />
              {[0, 1.4, 2.8].map((d) => (
                <span
                  key={d}
                  className="wc-ripple absolute inset-0 rounded-full border-2 border-cyan-200/70"
                  style={{ animationDelay: `${d}s` }}
                />
              ))}
              <span className="absolute inset-[22%] rounded-full border border-accent/70" />
              <div
                className="wc-spin-mid absolute inset-[4%] rounded-full bg-[conic-gradient(from_0deg,transparent_0%,transparent_55%,var(--accent)_100%)] opacity-80"
                style={{
                  WebkitMaskImage:
                    "radial-gradient(circle, transparent 62%, #000 64%, #000 72%, transparent 74%)",
                  maskImage:
                    "radial-gradient(circle, transparent 62%, #000 64%, #000 72%, transparent 74%)",
                }}
              />
              <div className="wc-spin-rev absolute inset-[13%] rounded-full border border-dashed border-cyan-100/60" />
            </div>
          </div>

          {/* Avatarman */}
          <div
            ref={avatarRef}
            className="absolute inset-x-0 bottom-0 top-[12vh] will-change-transform"
          >
            <div ref={parRef} className="h-full w-full will-change-transform">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={AVATAR}
                alt="Avatarman"
                className="h-full w-full select-none object-contain object-bottom drop-shadow-[0_25px_40px_rgba(0,0,0,0.45)]"
                style={{
                  transform: entered ? "scale(1)" : "scale(1.25)",
                  opacity: entered ? 1 : 0,
                  transition: `transform 1.6s ${EASE} 0.15s, opacity 0.9s ease-out 0.15s`,
                }}
                draggable={false}
              />
            </div>
          </div>

          {/* Title group */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div ref={titleRef} className="text-center will-change-transform">
              <h1
                aria-label={TITLE}
                className="flex justify-center font-serif text-[clamp(2.8rem,11.5vw,10.5rem)] uppercase leading-none tracking-wide"
              >
                {TITLE.split("").map((ch, i) => (
                  <span key={i} className="block overflow-hidden py-2" aria-hidden>
                    <span
                      className="block"
                      style={{
                        transform: entered ? "translateY(0)" : "translateY(115%)",
                        transition: `transform 1s ${EASE}`,
                        transitionDelay: entered ? `${0.7 + i * 0.05}s` : "0s",
                      }}
                    >
                      {ch}
                    </span>
                  </span>
                ))}
              </h1>
              <p
                className="mt-3 font-serif text-[11px] uppercase tracking-[0.3em] sm:text-sm"
                style={{
                  opacity: entered ? 1 : 0,
                  transform: entered ? "translateY(0)" : "translateY(14px)",
                  transition: "opacity 0.9s ease-out, transform 0.9s ease-out",
                  transitionDelay: entered ? "1.4s" : "0s",
                }}
              >
                {SUBTITLE}
              </p>
            </div>
          </div>

          {/* Paragraph */}
          <div
            ref={paraRef}
            className="absolute inset-x-6 bottom-[7vh] opacity-0 will-change-transform md:inset-x-auto md:bottom-auto md:right-[7vw] md:top-1/2 md:w-[26vw] md:max-w-sm md:-translate-y-1/2"
          >
            <p className="font-serif text-sm leading-relaxed md:text-base">
              {PARAGRAPH}
            </p>
            <a
              href="https://warriortoken.com/"
              target="_blank"
              rel="noreferrer"
              className="pointer-events-auto mt-5 inline-block rounded-full bg-accent px-5 py-2 font-serif text-[11px] uppercase tracking-[0.2em] text-accent-fg transition-opacity hover:opacity-80"
            >
              Join the presale
            </a>
          </div>
        </div>

        {/* ============ LAYER 2 — strips ============ */}
        <div aria-hidden className="pointer-events-none absolute inset-0 flex">
          {STRIPS.map((w, i) => (
            <div
              key={i}
              ref={(el) => {
                stripRefs.current[i] = el;
              }}
              className="h-full border-l border-nav-left-line bg-nav-band transition-colors duration-500 will-change-transform"
              style={{ flex: w, transform: "translate3d(110vw,0,0)" }}
            />
          ))}
        </div>

        {/* ============ LAYER 3 — Featured heading ============ */}
        <div
          ref={featRef}
          className="pointer-events-none absolute inset-x-0 top-[13vh] flex justify-center text-nav-left-fg opacity-0 transition-colors duration-500 will-change-transform"
        >
          <span
            aria-hidden
            className="absolute -top-[6vh] font-serif text-[clamp(8rem,22vw,17rem)] leading-none opacity-15"
          >
            F
          </span>
          <h2 className="relative font-serif text-[clamp(1.8rem,4.6vw,3.6rem)] uppercase tracking-[0.12em]">
            Featured
          </h2>
        </div>

        {/* ============ LAYER 4 — comic cards ============ */}
        <div className="absolute inset-0 text-nav-left-fg transition-colors duration-500">
          {COMICS.map((c, i) => (
            <div
              key={c.src}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="absolute left-0 top-[58%] will-change-transform"
              style={{
                transform: "translate3d(150vw,-50%,0)",
                visibility: "hidden",
                opacity: 0,
              }}
            >
              <div
                aria-hidden
                className="absolute -left-[18%] top-1/2 aspect-square w-[52%] -translate-y-1/2 rounded-full bg-nav-left-fg/10"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.src}
                alt={c.caption}
                draggable={false}
                className="relative aspect-[4/5] w-full select-none object-cover shadow-[0_20px_50px_-20px_var(--nav-right-glow)]"
              />
              <p className="relative mt-3 font-serif text-[11px] uppercase tracking-[0.2em] sm:text-xs">
                {c.caption}
              </p>
            </div>
          ))}
        </div>

        {/* Cursor follower */}
        <div
          ref={ringRef}
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-[45] -ml-5 -mt-5 h-10 w-10 rounded-full border border-white opacity-0 mix-blend-difference transition-opacity duration-300"
        />
        <div
          ref={dotRef}
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-[45] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-accent opacity-0 transition-opacity duration-300"
        />
      </div>
    </section>
  );
}