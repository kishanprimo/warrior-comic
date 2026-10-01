"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Faq from "./Faq";

/* ------------------------------------------------------------------ */
/*  Keyframes + scroll/mouse driven CSS variables                      */
/*  --p  : how far the section has travelled through the viewport 0→1  */
/*  --mx / --my : mouse position -1 → 1                                */
/* ------------------------------------------------------------------ */
const CSS = `
#faq-universe{--p:0;--mx:0;--my:0;--nav-h:56px}
@keyframes ctSpin{to{transform:rotate(360deg)}}
@keyframes ctSpinRev{to{transform:rotate(-360deg)}}
@keyframes ctPulse{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:.9;transform:scale(1.12)}}
@keyframes ctRise{0%{transform:translate3d(0,0,0);opacity:0}10%{opacity:1}100%{transform:translate3d(var(--dx),-90vh,0);opacity:0}}
@keyframes ctTwinkle{0%,100%{opacity:.2;transform:scale(.7)}50%{opacity:1;transform:scale(1.4)}}
@keyframes ctGrid{from{background-position:0 0}to{background-position:0 60px}}
@keyframes ctOrb{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(4vw,-3vh,0) scale(1.15)}}
@keyframes ctShock{0%{transform:scale(.3);opacity:.9}100%{transform:scale(5.5);opacity:0}}
@keyframes ctFlash{0%{opacity:.5}100%{opacity:0}}
@keyframes ctDraw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes ctShine{from{transform:translateX(-120%) skewX(-20deg)}to{transform:translateX(320%) skewX(-20deg)}}
@keyframes ctScan{from{transform:translateX(-120%)}to{transform:translateX(320%)}}
@keyframes ctBob{0%,100%{transform:translateY(0)}50%{transform:translateY(5px)}}

.ct-spin{animation:ctSpin 60s linear infinite}
.ct-spin-fast{animation:ctSpin 24s linear infinite}
.ct-spin-rev{animation:ctSpinRev 34s linear infinite}
.ct-pulse{animation:ctPulse 5s ease-in-out infinite}
.ct-twinkle{animation:ctTwinkle 3.4s ease-in-out infinite}
.ct-rise{animation:ctRise linear infinite}
.ct-grid{animation:ctGrid 2.4s linear infinite}
.ct-orb{animation:ctOrb 18s ease-in-out infinite}
.ct-shock{animation:ctShock 1.5s cubic-bezier(.16,.84,.44,1) both}
.ct-flash{animation:ctFlash .8s ease-out both}
.ct-draw{stroke-dasharray:1;animation:ctDraw 1.6s ease-out both}
.ct-shine{animation:ctShine 3s ease-in-out infinite}
.ct-scan{animation:ctScan 4s linear infinite}
.ct-bob{animation:ctBob 1.8s ease-in-out infinite}

@media (prefers-reduced-motion:reduce){
  .ct-spin,.ct-spin-fast,.ct-spin-rev,.ct-pulse,.ct-twinkle,.ct-rise,.ct-grid,
  .ct-orb,.ct-shock,.ct-flash,.ct-draw,.ct-shine,.ct-scan,.ct-bob{animation:none!important}
}
`;

const EMBERS: [number, number, number, number, number][] = [
  [6, 11, 0, 3, 30], [18, 14, 3, 2, -20], [33, 12, 6, 3, 24], [49, 15, 2, 2, -30],
  [65, 13, 8, 3, 18], [82, 16, 4, 2, -26], [93, 12, 1, 4, 34], [12, 17, 9, 2, 16],
];
const STARS: [number, number, number, number][] = [
  [8, 18, 0, 3], [25, 75, 1.2, 2], [45, 12, 2.1, 3], [68, 85, 0.6, 2],
  [84, 22, 1.7, 3], [92, 60, 0.9, 2], [15, 50, 2.5, 2],
];

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

const maskStyle = (v: string): React.CSSProperties => ({ maskImage: v, WebkitMaskImage: v });

/* ------------------------------------------------------------------ */
export default function AuthUI() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);
  const [entered, setEntered] = useState(false);
  const [burst, setBurst] = useState(0);

  const enter = () => {
    setEntered(true);
    setBurst((b) => b + 1);
  };

  /* reveal the intro the first time the section scrolls into view */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Esc closes the FAQ panel */
  useEffect(() => {
    if (!entered) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setEntered(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [entered]);

  /* scroll + mouse parallax → CSS variables */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const s = { p: 0, mx: 0, my: 0 };
    let tx = 0, ty = 0, raf = 0;

    const onMove = (e: PointerEvent) => {
      if (!fine || reduce) return;
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const loop = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const tp = clamp((vh - r.top) / (vh + r.height));
      const k = reduce ? 1 : 0.1;
      const np = s.p + (tp - s.p) * k;
      const nmx = s.mx + (tx - s.mx) * k;
      const nmy = s.my + (ty - s.my) * k;
      if (Math.abs(np - s.p) + Math.abs(nmx - s.mx) + Math.abs(nmy - s.my) > 0.0004) {
        s.p = np; s.mx = nmx; s.my = nmy;
        el.style.setProperty("--p", np.toFixed(4));
        el.style.setProperty("--mx", nmx.toFixed(4));
        el.style.setProperty("--my", nmy.toFixed(4));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="faq-universe"
      className="relative isolate min-h-screen overflow-hidden bg-[color-mix(in_oklab,var(--nav-overlay-bg)_30%,#000)] font-sans text-nav-right-heading"
    >
      <style>{CSS}</style>

      {/* ============================================================
          BACKDROP — manga speed-lines, neon grid floor, orbs, embers
      ============================================================ */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* colour wash */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_15%,rgba(255,110,0,0.14),transparent_55%),radial-gradient(ellipse_at_85%_85%,rgba(34,211,238,0.12),transparent_55%)]" />

        {/* mouse spotlight */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(520px circle at calc(50% + var(--mx) * 38%) calc(50% + var(--my) * 38%), rgba(255,170,90,0.12), transparent 65%)",
          }}
        />

        {/* manga speed lines — rotate with scroll + constantly */}
        <div
          className={`absolute left-1/2 top-1/2 h-[150vmax] w-[150vmax] transition-opacity duration-1000 will-change-transform ${
            entered ? "opacity-0" : "opacity-55"
          }`}
          style={{ transform: "translate(-50%,-50%) rotate(calc(var(--p) * 90deg))" }}
        >
          <div
            className="ct-spin h-full w-full"
            style={{
              background:
                "repeating-conic-gradient(from 0deg, rgba(255,255,255,0.08) 0deg 0.9deg, transparent 0.9deg 6deg)",
              ...maskStyle("radial-gradient(closest-side, transparent 6%, #000 30%, transparent 100%)"),
            }}
          />
        </div>

        {/* orbs */}
        <div
          className="absolute -left-[8%] top-[8%] will-change-transform"
          style={{ transform: "translate3d(calc(var(--mx) * -30px), calc((0.5 - var(--p)) * 180px), 0)" }}
        >
          <div className="ct-orb h-[38vmin] w-[38vmin] rounded-full bg-accent/20 blur-3xl" />
        </div>
        <div
          className="absolute -right-[8%] bottom-[10%] will-change-transform"
          style={{ transform: "translate3d(calc(var(--mx) * 30px), calc((0.5 - var(--p)) * -180px), 0)" }}
        >
          <div className="ct-orb h-[42vmin] w-[42vmin] rounded-full bg-cyan-400/15 blur-3xl [animation-delay:-8s]" />
        </div>

        {/* neon perspective grid floor */}
        <div
          className="absolute inset-x-0 bottom-0 h-[48%] overflow-hidden"
          style={maskStyle("linear-gradient(to top, #000 15%, transparent 95%)")}
        >
          <div
            className="ct-grid absolute -inset-x-[60%] bottom-0 h-[220%] origin-bottom transition-transform duration-1000"
            style={{
              transform: entered ? "none" : "perspective(520px) rotateX(63deg)",
              backgroundImage:
                "linear-gradient(rgba(255,140,60,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(255,140,60,0.45) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* comic halftone dots + vignette */}
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(var(--nav-right-line)_1px,transparent_1.6px)] [background-size:18px_18px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_20%,rgba(0,0,0,0.85)_100%)]" />

        {/* embers + stars */}
        {EMBERS.map(([l, dur, del, sz, dx], i) => (
          <span
            key={`e${i}`}
            className="ct-rise absolute bottom-0 rounded-full bg-orange-400 shadow-[0_0_8px_2px_rgba(251,146,60,0.7)]"
            style={{ left: `${l}%`, width: sz, height: sz, animationDuration: `${dur}s`, animationDelay: `${del}s`, ["--dx" as string]: `${dx}px` }}
          />
        ))}
        {STARS.map(([l, t, d, sz], i) => (
          <span
            key={`s${i}`}
            className="ct-twinkle absolute rounded-full bg-nav-right-heading"
            style={{ left: `${l}%`, top: `${t}%`, width: sz, height: sz, animationDelay: `${d}s` }}
          />
        ))}

        {/* flash when entering */}
        {burst > 0 && <span key={`flash${burst}`} className="ct-flash absolute inset-0 bg-orange-200" />}
      </div>

      {/* ============================================================
          CONTENT — left: "Enter the Universe"   right: FAQ
      ============================================================ */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 pb-10 pt-[calc(var(--nav-h,56px)_+_2.5rem)] sm:px-6 lg:flex-row lg:px-10">
        {/* ---------- LEFT ---------- */}
        <div className="relative flex w-full min-w-0 flex-1 flex-col items-center justify-center text-center">
          <div
            className={`flex w-full max-w-xl flex-col items-center transition-all duration-1000 ease-out ${
              seen ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
            }`}
          >
            <Emblem entered={entered} burst={burst} />

            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.45em] text-orange-200/90 sm:text-xs">
              ✦ Warrior Comics • Help Center ✦
            </p>

            <h2
              className={`mt-3 font-serif font-black uppercase leading-none text-white drop-shadow-[0_6px_30px_rgba(255,120,40,0.5)] transition-all duration-1000 ease-out ${
                entered
                  ? "text-[clamp(1.9rem,3.6vw,3.2rem)] tracking-[0.14em]"
                  : "text-[clamp(2.4rem,9vw,7rem)] tracking-[0.18em]"
              }`}
            >
              Warrior
              <span
                className={`block font-light text-orange-100/90 transition-all duration-1000 ease-out ${
                  entered ? "mt-1 text-[0.5em] tracking-[0.4em]" : "mt-2 text-[0.42em] tracking-[0.55em]"
                }`}
              >
                Universe
              </span>
            </h2>

            {/* BEFORE: tagline + CTA */}
            <Collapse open={!entered}>
              <p className="mx-auto mt-6 max-w-md text-xs font-semibold uppercase tracking-[0.3em] text-white/70 sm:text-sm">
                Every question has an answer. Step inside.
              </p>
              <button
                type="button"
                onClick={enter}
                className="group relative mt-9 cursor-pointer inline-flex items-center gap-3 overflow-hidden rounded-full border border-accent/70 bg-accent/10 px-9 py-4 font-serif text-xs font-extrabold uppercase tracking-[0.3em] text-white backdrop-blur-sm transition-all duration-300 hover:bg-accent hover:text-accent-fg hover:shadow-[0_0_40px_var(--accent)] active:scale-95"
              >
                <span aria-hidden className="ct-shine absolute inset-y-0 left-0 w-1/4 bg-white/25" />
                <span className="relative z-10">Check for Support</span>
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              
            </Collapse>

            {/* AFTER: description + support card */}
            <Collapse open={entered} delay={500}>
              <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-nav-right-text/85">
                Browse answers by topic or search for exactly what you need. Everything about your account,
                comics and payments lives here.
              </p>

              <div className="relative mx-auto mt-7 w-full max-w-sm overflow-hidden rounded-2xl border border-nav-right-line/80 bg-black/45 p-5 text-left backdrop-blur-xl">
                <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden">
                  <span className="ct-scan block h-full w-1/3 bg-gradient-to-r from-transparent via-accent to-transparent" />
                </span>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent">Still have questions?</p>
                <p className="mt-1.5 text-xs leading-relaxed text-nav-right-text/80">
                  Can&apos;t find what you need? Our team is happy to help.
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/#contact")}
                  className="group mt-4 cursor-pointer inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-serif text-[11px] font-extrabold uppercase tracking-[0.2em] text-accent-fg transition-all duration-300 hover:shadow-[0_0_24px_rgba(255,100,0,0.5)] active:scale-95"
                >
                  Contact Support
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setEntered(false)}
                className="mt-6 text-[11px] font-bold uppercase tracking-[0.25em] text-nav-right-text/60 transition-colors hover:text-accent hover:underline cursor-pointer"
              >
                Back
              </button>
            </Collapse>
          </div>
        </div>

        {/* ---------- RIGHT : FAQ opens here ---------- */}
        <div
          className={`relative w-full overflow-hidden transition-all duration-1000 ease-[cubic-bezier(.22,1,.36,1)] lg:max-h-none lg:flex-none ${
            entered
              ? "mt-10 max-h-[3200px] opacity-100 lg:mt-0 lg:w-[calc(min(54vw,720px)+2rem)] lg:pl-8"
              : "max-h-0 opacity-0 lg:w-0"
          }`}
          aria-hidden={!entered}
        >
          <div
            className={`w-full transition-all delay-200 duration-1000 ease-out lg:w-[min(54vw,720px)] ${
              entered ? "translate-x-0" : "lg:translate-x-24"
            }`}
          >
          <div className="relative h-[min(calc(100vh_-_var(--nav-h,56px)_-_5rem),760px)] overflow-hidden rounded-3xl border border-nav-right-line/80 bg-black/55 p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-8">
              <span aria-hidden className="pointer-events-none absolute left-3 top-3 h-4 w-4 border-l-2 border-t-2 border-accent" />
              <span aria-hidden className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r-2 border-t-2 border-accent" />
              <span aria-hidden className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-accent" />
              <span aria-hidden className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-accent" />
              <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden">
                <span className="ct-scan block h-full w-1/3 bg-gradient-to-r from-transparent via-accent to-transparent" />
              </span>
              <Faq active={entered} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Collapsible block (height + fade) used for before/after content    */
/* ------------------------------------------------------------------ */
function Collapse({
  open,
  delay = 0,
  children,
}: {
  open: boolean;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <div
      aria-hidden={!open}
      className={`grid w-full transition-[grid-template-rows,opacity] duration-700 ease-out ${
        open ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"
      }`}
      style={{ transitionDelay: open ? `${delay}ms` : "0ms" }}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Emblem: glowing rings + shield & crossed swords (pure SVG/CSS)     */
/* ------------------------------------------------------------------ */
function Emblem({ entered, burst }: { entered: boolean; burst: number }) {
  const draw = burst > 0 ? "ct-draw" : "";
  return (
    <div
      className={`relative aspect-square transition-all duration-1000 ease-out ${
        entered ? "w-[clamp(84px,9vw,118px)]" : "w-[clamp(140px,22vw,210px)]"
      }`}
    >
      {/* shockwaves on enter */}
      {burst > 0 &&
        [0, 1, 2].map((i) => (
          <span
            key={`${burst}-${i}`}
            aria-hidden
            className="ct-shock pointer-events-none absolute inset-0 rounded-full border-2 border-accent"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}

      <div className="ct-pulse absolute inset-[10%] rounded-full bg-accent/30 blur-2xl" />

      {/* outer ring — scroll + constant rotation */}
      <div className="absolute inset-0" style={{ transform: "rotate(calc(var(--p) * -220deg))" }}>
        <div className="ct-spin-rev absolute inset-0 rounded-full border border-dashed border-nav-right-line/80">
          <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_14px_3px_var(--accent)]" />
        </div>
      </div>
      <div className="absolute -inset-[8%]" style={{ transform: "rotate(calc(var(--p) * 280deg))" }}>
        <div className="ct-spin absolute inset-0 rounded-full border border-nav-right-line/40">
          <span className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_12px_3px_rgba(103,232,249,0.6)]" />
        </div>
      </div>

      {/* core */}
      <div className="absolute inset-[12%] flex items-center justify-center rounded-full border border-accent/50 bg-black/60 shadow-[inset_0_0_30px_rgba(255,110,0,0.25)] backdrop-blur-md">
        <svg
          key={burst}
          viewBox="0 0 200 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-[78%] w-[78%] text-accent"
        >
          {/* shield */}
          <path
            pathLength={1}
            className={draw}
            transform="translate(35 28) scale(1.3)"
            d="M50 5 L90 20 V50 C90 75 70 90 50 97 C30 90 10 75 10 50 V20 Z"
            fill="rgba(255,110,0,0.08)"
          />
          {/* crossed swords */}
          {[-38, 38].map((rot) => (
            <g key={rot} transform={`rotate(${rot} 100 100)`}>
              <path pathLength={1} className={draw} d="M100 34 L107 62 V118 H93 V62 Z" />
              <path pathLength={1} className={draw} d="M80 118 H120" />
              <path pathLength={1} className={draw} d="M100 118 V144" />
              <circle cx="100" cy="149" r="4" className={draw} pathLength={1} />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}