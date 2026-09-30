"use client";

import React, { useEffect, useRef, useState } from "react";
import { BG_IMAGES, CHAPTERS, START, TOTAL, type Block, type Chapter } from "./Characterdata";

/* ------------------------------------------------------------------ */
/* Palette                                                             */
/* ------------------------------------------------------------------ */
const DARK = "color-mix(in oklab, var(--nav-overlay-bg) 35%, #000)";
const PAPER = "color-mix(in oklab, var(--nav-right-heading) 60%, var(--nav-right-from))";
const INK_LIGHT = "var(--nav-right-heading)";

const AUTO_PX_PER_SEC = 110;

/* timeline is compressed so there are no long empty gaps */
const SC = 0.62;
const LAST = CHAPTERS.length - 1;
const isInfo = (i: number) => i === 0 || i === LAST;

// info chapters (first & last) get a shorter scroll slot — they have less
// content, so the "empty tail" after they finish was showing as a blank
// black stage. Give the content chapters full length.
const LN = CHAPTERS.map((c, i) => c.len * SC * (isInfo(i) ? 0.62 : 1));

// recompute START + TOTAL from the new lengths so dots/jump/progress-bar
// all stay aligned with the actual scroll positions.
const ST: number[] = LN.reduce<number[]>((acc, _len, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + LN[i - 1]);
  return acc;
}, []);
const TOT = LN.reduce((a, b) => a + b, 0);

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const smooth = (a: number, b: number, v: number) => {
  const t = seg(v, a, b);
  return t * t * (3 - 2 * t);
};
const rand = (a: number, b: number) => a + Math.random() * (b - a);

const blocksFor = (c: Chapter): Block[] => [
  ...c.blocks,
  ...c.extras.filter((e) => e.text).map((e) => ({ h: e.title, t: e.text! })),
];

/* ------------------------------------------------------------------ */
/* Typing (content blocks only)                                        */
/* ------------------------------------------------------------------ */
function Typed({
  text,
  reg,
  className,
}: {
  text: string;
  reg: (el: HTMLSpanElement | null) => void;
  className?: string;
}) {
  return (
    <span ref={reg} data-text={text} data-n="-1" className={className}>
      <span />
      <span aria-hidden className="relative inline-block w-0 align-baseline" style={{ opacity: 0 }}>
        <span className="wc-caret absolute -top-[0.05em] left-[0.04em] block h-[1em] w-[2px] bg-accent shadow-[0_0_8px_var(--accent)]" />
      </span>
      <span className="opacity-0">{text}</span>
    </span>
  );
}

const typeTo = (root: HTMLElement | null, frac: number) => {
  if (!root) return;
  const text = root.dataset.text || "";
  const n = Math.round(text.length * clamp(frac));
  if (root.dataset.n === String(n)) return;
  root.dataset.n = String(n);
  const kids = root.children as unknown as HTMLElement[];
  kids[0].textContent = text.slice(0, n);
  kids[2].textContent = text.slice(n);
  kids[1].style.opacity = n > 0 && n < text.length ? "1" : "0";
};

/* ------------------------------------------------------------------ */
/* SVG artwork                                                         */
/* ------------------------------------------------------------------ */
const CLOUD =
  "M0.2 0.9 C0.06 0.9 0.01 0.72 0.1 0.62 C0.01 0.46 0.1 0.28 0.26 0.32 C0.28 0.1 0.5 0.03 0.62 0.16 C0.74 0.03 0.94 0.14 0.9 0.32 C1 0.4 0.99 0.6 0.92 0.68 C0.99 0.84 0.86 0.98 0.72 0.9 C0.6 0.99 0.42 0.99 0.32 0.91 C0.28 0.93 0.24 0.92 0.2 0.9 Z";

function Emblem({ className }: { className?: string }) {
  return (
    <svg viewBox="-320 -320 640 640" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <circle r="300" />
      <circle r="236" strokeDasharray="4 10" />
      {Array.from({ length: 24 }).map((_, i) => (
        <line key={i} x1="0" y1="-252" x2="0" y2="-300" transform={`rotate(${i * 15})`} />
      ))}
      {[-38, 38].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <path d="M0 -276 L12 -224 L12 40 L-12 40 L-12 -224 Z" />
          <path d="M-64 40 H64 V58 H-64 Z" />
          <path d="M-7 58 V140 H7 V58" />
          <circle cy="153" r="13" />
        </g>
      ))}
    </svg>
  );
}

const ribbon = (seed: number, x0: number, w: number) => {
  let s = seed * 977 + 13;
  const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const N = 9;
  const L: string[] = [];
  const Rr: string[] = [];
  for (let i = 0; i <= N; i++) {
    const y = (i * 1000) / N;
    const cx = x0 + Math.sin(i * 0.85 + seed) * 90 + (r() - 0.5) * 70;
    const hw = (w * (0.45 + r() * 0.9)) / 2;
    L.push(`${(cx - hw).toFixed(1)} ${y.toFixed(1)}`);
    Rr.unshift(`${(cx + hw).toFixed(1)} ${y.toFixed(1)}`);
  }
  return `M${L.join(" L")} L${Rr.join(" L")} Z`;
};
const smokeFor = (ci: number, layer: 0 | 1) =>
  layer === 0
    ? [ribbon(3 + ci * 5, 170, 130), ribbon(7 + ci * 5, 520, 170), ribbon(13 + ci * 5, 850, 120)]
    : [ribbon(21 + ci * 7, 300, 90), ribbon(29 + ci * 7, 700, 110)];

/* battleground silhouette for the intro */
const SPEARS = [70, 140, 215, 330, 400, 520, 640, 770, 850, 940, 1040, 1120];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&display=swap');
@keyframes wcCaret { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
@keyframes wcSlam {
  0% { opacity: 0; transform: scale(1.7); filter: blur(10px); }
  60% { opacity: 1; transform: scale(0.97); filter: blur(0); }
  100% { opacity: 1; transform: scale(1); filter: blur(0); }
}
.wc-caret { animation: wcCaret 0.9s steps(1) infinite; }
.wc-slam { animation: wcSlam 1s cubic-bezier(.2,.8,.2,1) both; }
.wc-hand { font-family: "Caveat", "Segoe Print", "Bradley Hand", "Comic Sans MS", cursive; font-weight: 700; }
@media (pointer: fine) { .wc-stage, .wc-stage * { cursor: none !important; } }
@media (prefers-reduced-motion: reduce) { .wc-caret, .wc-ch-anim, .wc-slam { animation: none !important; } }
`;

type Refs = {
  wrap: HTMLDivElement | null;
  bgImg: HTMLDivElement | null;
  emblem: HTMLDivElement | null;
  smokeA: HTMLDivElement | null;
  smokeB: HTMLDivElement | null;
  head: HTMLDivElement | null;
  panel: HTMLDivElement | null;
  body: HTMLDivElement | null;
  img: HTMLImageElement | null;
  slash: SVGSVGElement | null;
  aura: HTMLDivElement | null;
  sweep: SVGPathElement | null;
  blocks: (HTMLDivElement | null)[];
  typed: (HTMLSpanElement | null)[];
  extras: (HTMLDivElement | null)[];
};

type Drop = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number };
type Spark = { x: number; y: number; px: number; py: number; vx: number; vy: number; life: number; max: number; size: number; g: number };
type Ball = { sx: number; sy: number; tx: number; ty: number; t: number; dur: number; size: number; trail: { x: number; y: number }[] };
type Ring = { x: number; y: number; life: number; max: number; r: number };

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export default function Character() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const inkRef = useRef<HTMLCanvasElement>(null);
  const fxRef = useRef<HTMLCanvasElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const R = useRef<Refs[]>(
    CHAPTERS.map(() => ({
      wrap: null,
      bgImg: null,
      emblem: null,
      smokeA: null,
      smokeB: null,
      head: null,
      panel: null,
      body: null,
      img: null,
      slash: null,
      aura: null,
      sweep: null,
      blocks: [],
      typed: [],
      extras: [],
    }))
  );

  const [active, setActive] = useState(0);
  const [mobile, setMobile] = useState(false);
  const [auto, setAuto] = useState(false);
  const [full, setFull] = useState(false);
  const activeRef = useRef(0);
  const mobileRef = useRef(false);

  const jump = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const top = window.scrollY + el.getBoundingClientRect().top;
    const y = top + (ST[i] + LN[i] * 0.12) * window.innerHeight;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  useEffect(() => {
    if (!auto) return;
    let raf = 0;
    let last = performance.now();
    let pos = window.scrollY;
    const stop = () => setAuto(false);
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      pos += AUTO_PX_PER_SEC * dt;
      window.scrollTo(0, pos);
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        setAuto(false);
        return;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("keydown", stop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
    };
  }, [auto]);

  useEffect(() => {
    const onFs = () => setFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const toggleFull = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.();
  };

  /* ---- the scroll-linked timeline (one rAF loop) ---- */
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const stage = stageRef.current;
    let raf = 0;
    let cur = 0;
    let target = 0;
    let lastT = performance.now();
    let vw = window.innerWidth;
    let vh = window.innerHeight;
    let wide = vw >= 768;

    // mouse / cursor
    let mxT = 0;
    let myT = 0;
    let mxs = 0;
    let mys = 0;
    let tx = vw / 2;
    let ty = vh / 2;
    let rx = tx;
    let ry = ty;
    let rs = 1;
    let hov = false;
    let over = false; // pointer is over a character
    let down = false;
    let seen = false;
    let lastMove = 0;
    let mvSpeed = 0;
    let lxs = 0;
    let lys = 0;
    const trail: { x: number; y: number }[] = [];
    const drops: Drop[] = [];

    // fx: fireballs, sparks, rings
    const balls: Ball[] = [];
    const parts: Spark[] = [];
    const rings: Ring[] = [];
    const waves: { x: number; y: number; life: number; max: number; r: number }[] = [];
let nextWave = 0;
    let nextBall = performance.now() + 500;
    let emberAcc = 0;
    let fireI = 1;
    let shake = 0;
    let velS = 0;
    let panelRect: DOMRect | null = null;
    const hovA = CHAPTERS.map(() => 0);

    const layout = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      wide = vw >= 768;
      if (mobileRef.current === wide) {
        mobileRef.current = !wide;
        setMobile(!wide);
      }
      const ph = wide ? Math.min(vh * 0.78, vw * 0.4) : Math.min(vh * 0.36, vw * 0.8);
      const pw = ph * 0.95;
      CHAPTERS.forEach((c, ci) => {
        const r = R.current[ci];
        if (r.panel) {
          r.panel.style.width = `${pw}px`;
          r.panel.style.height = `${ph}px`;
        }
        const bw = isInfo(ci)
          ? Math.min(vw * (wide ? 0.4 : 0.86), 520)
          : c.img && wide
          ? Math.min(vw * 0.32, 440)
          : Math.min(vw * 0.86, 680);
        r.blocks.forEach((b) => b && (b.style.width = `${bw}px`));
        r.extras.forEach((x) => x && (x.style.width = `${Math.min(vw * 0.22, 300)}px`));
      });
      [inkRef.current, fxRef.current].forEach((cv) => {
        if (cv) {
          cv.width = vw;
          cv.height = vh;
        }
      });
    };

    const readScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      target = clamp(-rect.top / vh, 0, TOT);
    };

    const addSpark = (x: number, y: number, vx: number, vy: number, max: number, size: number, g = 520) => {
      if (parts.length < 520) parts.push({ x, y, px: x, py: y, vx, vy, life: 0, max, size, g });
    };
    const explode = (x: number, y: number, power: number) => {
      const n = Math.floor(18 + power * 18);
      for (let i = 0; i < n; i++) {
        const a = -Math.PI / 2 + rand(-1.5, 1.5);
        const s = rand(120, 520) * power;
        addSpark(x, y, Math.cos(a) * s, Math.sin(a) * s, rand(0.5, 1.4), rand(1, 2.8));
      }
      rings.push({ x, y, life: 0, max: 0.75, r: 70 * power });
      shake = 1;
    };

    /* ---- one chapter ---- */
    const applyChapter = (ci: number, g: number): number => {
      const r = R.current[ci];
      const c = CHAPTERS[ci];
      if (!r.wrap) return 0;
      const info = isInfo(ci);
      const u = (g - ST[ci]) / LN[ci];
      const on = u > -0.2 && u < 1.25;
      const vis = on ? "visible" : "hidden";
      if (r.wrap.style.visibility !== vis) r.wrap.style.visibility = vis;

      const w = ci === 0 ? 1 : smooth(-0.16, 0.08, u);
      if (!on) return w;

      // Info chapters (first & last) have very little content; once their
      // blocks have swept off-screen, fade the whole scene out so we don't
      // leave an empty stage behind. Content chapters are handled by `w`.
      // fade info scenes out *before* their scroll slot runs out, so the
      // tail of the slot isn't an empty stage. Chapter 0 fades a bit
      // earlier than the last chapter so the transition into chapter 1
      // is snappy.
      const infoOut = ci === 0 ? seg(u, wide ? 0.42 : 0.7, wide ? 0.68 : 0.95) : 0;
      const sceneAlpha = (ci === 0 ? 1 : w) * (1 - infoOut);

      r.wrap.style.opacity = String(sceneAlpha);
      r.wrap.style.transform = `translate3d(0, ${(1 - sceneAlpha) * vh * 0.05}px, 0)`;
      // hide fully once faded so we stop painting it
      r.wrap.style.visibility = sceneAlpha < 0.005 ? "hidden" : "visible";

      const side = c.side;
      const hasPanel = !!c.img;

      // title card: plain (no typing), fades/slams in, then drifts up
      const tin = ci === 0 ? 1 : seg(u, -0.04, 0.06);
      const out = seg(u, info ? 0.16 : 0.14, info ? 0.3 : 0.28);

      if (r.head) {
        const sx = ci === 0 ? (Math.random() - 0.5) * 10 * shake : 0;
        const sy = ci === 0 ? (Math.random() - 0.5) * 10 * shake : 0;
        r.head.style.opacity = String(tin * (1 - out));
        r.head.style.transform = `translate3d(${mxs * -10 + sx}px, ${-out * vh * 0.25 + mys * -6 + sy}px, 0) scale(${1 + (1 - tin) * 0.12})`;
      }

      // background art
      if (r.bgImg)
        r.bgImg.style.transform = `translate3d(${(0.5 - u) * vw * 0.05 + mxs * -12}px, ${(0.5 - u) * vh * 0.08 + mys * -8}px, 0) scale(1.15)`;
      if (r.emblem) r.emblem.style.transform = `translate(-50%,-50%) rotate(${u * 50 - 10}deg)`;

      // smoke (info chapters drift sideways more)
      const sxk = info ? 3 : 1;
      if (r.smokeA)
        r.smokeA.style.transform = `translate(-50%,-50%) translate3d(${mxs * -16 + (0.5 - u) * vw * 0.12 * sxk + Math.sin(u * 4) * vw * 0.02}px, ${(0.5 - u) * vh * 0.3}px, 0)`;
      if (r.smokeB)
        r.smokeB.style.transform = `translate(-50%,-50%) translate3d(${mxs * 28 + (0.5 - u) * vw * 0.3 * sxk + Math.cos(u * 3) * vw * 0.03}px, ${(0.5 - u) * vh * 0.85}px, 0)`;

      // left → right ink arrow (info chapters)
      if (r.sweep) r.sweep.style.strokeDashoffset = String(1 - seg(u, 0.1, 0.9));

      // ---- character: scroll pass + fight motion + cursor reaction ----
      if (r.panel && r.body) {
        const pu = seg(u, 0.02, 0.98);
       const enter = 1 - smooth(0.12, 0.28, u);
const y = wide
  ? (0.5 - pu) * vh * 1.8 + mys * 10
  : -vh * 0.18 + enter * vh * 0.75 - seg(u, 0.95, 1.1) * vh * 0.7;
const x = wide ? side * vw * 0.22 + Math.sin(pu * 5) * vw * 0.01 + mxs * 16 : 0;
        r.panel.style.transform = `translate(-50%,-50%) translate3d(${x}px,${y}px,0) rotate(${Math.sin(pu * 4) * 1.2}deg)`;
        r.panel.style.opacity = "1";

        // cursor over this character?
        let tgt = 0;
        if (ci === activeRef.current) {
          const b = r.panel.getBoundingClientRect();
          panelRect = b;
          if (seen && tx > b.left && tx < b.right && ty > b.top && ty < b.bottom) {
            tgt = 1;
            over = true;
            if (!reduce && performance.now() > nextWave) {
  waves.push({ x: b.left + b.width / 2, y: b.top + b.height / 2, life: 0, max: 1.1, r: b.width * 0.5 });
  nextWave = performance.now() + 380;
}
            lxs += ((tx - b.left) / b.width - 0.5 - lxs) * 0.15;
            lys += ((ty - b.top) / b.height - 0.5 - lys) * 0.15;
            if (!reduce && mvSpeed > 5) {
              const n = Math.min(4, Math.floor(mvSpeed / 6));
              for (let i = 0; i < n; i++) {
                const a = rand(0, 6.283);
                const s = rand(120, 420);
                addSpark(tx, ty, Math.cos(a) * s, Math.sin(a) * s - 80, rand(0.3, 0.8), rand(1, 2.4));
              }
            }
          }
        }
        hovA[ci] += (tgt - hovA[ci]) * 0.12;
        const h = hovA[ci];

        // fight cycle: wind-up → lunge → slash → recoil (3 per pass)
        const cyc = (pu * 3) % 1;
        const wnd = seg(cyc, 0, 0.22) * (1 - seg(cyc, 0.22, 0.32));
        const att = seg(cyc, 0.22, 0.32) * (1 - seg(cyc, 0.32, 0.62));
        const dirn = -side || 1;
        const fx = (-wnd * 24 + att * 52) * dirn;
        const rr = (-wnd * 5 + att * 10) * dirn;
    const sc = 1 + att * 0.07;
     r.body.style.transform = `translate3d(${fx}px,${-att * 8}px,0) rotate(${rr}deg) scale(${sc})`;
        if (r.img)
          r.img.style.filter = `drop-shadow(0 14px 22px rgba(0,0,0,0.45)) drop-shadow(0 0 ${(h * 28).toFixed(1)}px rgba(255,140,40,${(h * 0.85).toFixed(2)})) brightness(${(1 + h * 0.18).toFixed(2)})`;
    
        if (r.aura) {
          r.aura.style.opacity = String(clamp(0.25 + velS * 2.2 + h * 0.5));
          r.aura.style.transform = `rotate(${u * 160}deg) scale(${1 + velS * 0.6 + h * 0.1})`;
        }
      }

  

      // text blocks
      const n = r.blocks.filter(Boolean).length || 1;
     if (!wide) {
  const gate = seg(u, 0.2, 0.3);
  const pb = ci === 0 ? 0.64 : info ? 0.85 : 0.92;
  const prog = seg(u, 0.3, pb) * (n - 1);
  const yOff = hasPanel ? vh * 0.24 : 0;
  r.blocks.forEach((el, k) => {
    if (!el) return;
    const x = (k - prog) * vw * 0.92;
    const fade = (1 - smooth(0.4 * vw, 0.8 * vw, Math.abs(x))) * gate;
    el.style.transform = `translate(-50%,-50%) translate3d(${x}px,${yOff}px,0)`;
    el.style.opacity = String(fade);
    el.style.pointerEvents = fade > 0.8 ? "auto" : "none";
    typeTo(r.typed[k], seg(1 - Math.abs(k - prog), 0.35, 0.8));
  });
} else if (info) {
  // left → right sweep
        const step = Math.min(0.12, 0.5 / Math.max(1, n - 1));
        const span = 0.36;
        r.blocks.forEach((el, k) => {
          if (!el) return;
          const a = 0.1 + k * step;
          const p = k === n - 1 && ci === LAST ? Math.min((u - a) / span, 0.5) : (u - a) / span;
          const x = (-0.62 + p * 1.24) * vw + mxs * 10;
          const y = (k % 2 ? 0.17 : -0.17) * vh + Math.sin(p * 4 + k) * vh * 0.02;
          const fade = 1 - smooth(0.36 * vw, 0.58 * vw, Math.abs(x));
          el.style.transform = `translate(-50%,-50%) translate3d(${x}px,${y}px,0) rotate(${k % 2 ? 2 : -2}deg)`;
          el.style.opacity = String(fade);
          el.style.pointerEvents = fade > 0.8 ? "auto" : "none";
          typeTo(r.typed[k], seg(p, 0.2, 0.5));
        });
      } else {
        const step = Math.min(0.16, 0.6 / Math.max(1, n - 1));
        const span = step * 2.2;
        const bx = hasPanel && wide ? -side * vw * 0.24 : 0;
        r.blocks.forEach((el, k) => {
          if (!el) return;
          const a = 0.1 + k * step;
          const p = k === n - 1 && ci === LAST ? Math.min((u - a) / span, 0.5) : (u - a) / span;
          const speed = 1 + (k % 3) * 0.1;
          const y = vh * 0.62 - p * vh * 1.24 * speed;
          const stagger = hasPanel && wide ? 0 : (k % 2 ? 1 : -1) * vw * 0.05;
          const x = bx + stagger + Math.sin(p * 3 + k) * vw * 0.012 + mxs * 8;
          const fade = 1 - smooth(0.26 * vh, 0.5 * vh, Math.abs(y));
          el.style.transform = `translate(-50%,-50%) translate3d(${x}px,${y}px,0)`;
          el.style.opacity = String(fade);
          el.style.pointerEvents = fade > 0.8 ? "auto" : "none";
          typeTo(r.typed[k], seg(p, 0.04, 0.55));
        });
      }
      return w;
    };

    /* ---- fx canvas: fireballs, embers, sparks, shockwaves ---- */
    const drawFx = (dt: number, now: number) => {
      const cv = fxRef.current;
      if (!cv) return;
      const ctx = cv.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, cv.width, cv.height);
      if (reduce) return;
      shake *= 0.9;

      // spawn fireballs on the battleground (intro only)
      if (fireI > 0.05 && now > nextBall) {
        const tx2 = rand(0.08, 0.92) * vw;
        balls.push({
          sx: tx2 + (Math.random() < 0.5 ? -1 : 1) * rand(0.25, 0.5) * vw,
          sy: -40,
          tx: tx2,
          ty: vh * rand(0.8, 0.93),
          t: 0,
          dur: rand(0.9, 1.6),
          size: rand(7, 15),
          trail: [],
        });
        nextBall = now + rand(350, 900) / fireI;
      }
      // embers rising from the ground
      if (fireI > 0.05) {
        emberAcc += dt * (vw / 1400) * 14 * fireI;
        while (emberAcc >= 1) {
          addSpark(rand(0, vw), vh * rand(0.86, 0.96), rand(-20, 20), -rand(40, 130), rand(1.5, 3.5), rand(0.8, 2), -20);
          emberAcc -= 1;
        }
      }

      const light = CHAPTERS[activeRef.current].tone === 1;
      ctx.globalCompositeOperation = light ? "source-over" : "lighter";
      ctx.lineCap = "round";

      // fireballs
      for (let i = balls.length - 1; i >= 0; i--) {
        const b = balls[i];
        b.t += dt / b.dur;
        const x = b.sx + (b.tx - b.sx) * b.t;
        const y = b.sy + (b.ty - b.sy) * Math.pow(b.t, 1.4);
        b.trail.push({ x, y });
        if (b.trail.length > 24) b.trail.shift();
        if (b.t >= 1) {
          explode(b.tx, b.ty, b.size / 10);
          balls.splice(i, 1);
          continue;
        }
        for (let k = 0; k < b.trail.length; k++) {
          const a = k / b.trail.length;
          ctx.fillStyle = `rgba(255,${Math.round(90 + 110 * a)},30,${a * 0.35 * fireI})`;
          ctx.beginPath();
          ctx.arc(b.trail[k].x, b.trail[k].y, b.size * a * 0.9, 0, 6.283);
          ctx.fill();
        }
        const gr = ctx.createRadialGradient(x, y, 0, x, y, b.size * 2.6);
        gr.addColorStop(0, "rgba(255,250,210,1)");
        gr.addColorStop(0.3, "rgba(255,170,50,0.95)");
        gr.addColorStop(1, "rgba(255,70,10,0)");
        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.arc(x, y, b.size * 2.6, 0, 6.283);
        ctx.fill();
      }

      // sparks / embers
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life += dt;
        if (p.life >= p.max || p.y > vh + 60 || p.y < -60) {
          parts.splice(i, 1);
          continue;
        }
        const k = 1 - p.life / p.max;
        p.px = p.x;
        p.py = p.y;
        p.vy += p.g * dt;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        ctx.strokeStyle = `hsla(${8 + 42 * k},100%,${45 + 30 * k}%,${Math.min(1, k * 1.4)})`;
        ctx.lineWidth = p.size * (0.5 + k);
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x - p.vx * 0.012, p.y - p.vy * 0.012);
        ctx.stroke();
      }

      // shockwaves + ground flash
      for (let i = rings.length - 1; i >= 0; i--) {
        const o = rings[i];
        o.life += dt;
        if (o.life >= o.max) {
          rings.splice(i, 1);
          continue;
        }
        const k = o.life / o.max;
        const rad = o.r * (0.3 + k * 2.4);
        const gr = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, rad);
        gr.addColorStop(0, `rgba(255,190,80,${(1 - k) * 0.5})`);
        gr.addColorStop(1, "rgba(255,80,10,0)");
        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.arc(o.x, o.y, rad, 0, 6.283);
        ctx.fill();
        ctx.strokeStyle = `rgba(255,170,60,${(1 - k) * 0.8})`;
        ctx.lineWidth = 3 * (1 - k) + 0.5;
        ctx.beginPath();
        ctx.ellipse(o.x, o.y, rad, rad * 0.32, 0, 0, 6.283);
        ctx.stroke();
      }
      // radiation rings + rays coming off the character
for (let i = waves.length - 1; i >= 0; i--) {
  const o = waves[i];
  o.life += dt;
  if (o.life >= o.max) {
    waves.splice(i, 1);
    continue;
  }
  const k = o.life / o.max;
  const rad = o.r * (0.6 + k * 0.9);
  ctx.strokeStyle = `rgba(255,160,60,${(1 - k) * 0.55})`;
  ctx.lineWidth = 1.5 + (1 - k) * 3;
  ctx.beginPath();
  ctx.arc(o.x, o.y, rad, 0, 6.283);
  ctx.stroke();
  ctx.lineWidth = 1.5;
  for (let j = 0; j < 16; j++) {
    const a = (j / 16) * 6.283 + o.life * 0.6;
    ctx.beginPath();
    ctx.moveTo(o.x + Math.cos(a) * rad * 1.02, o.y + Math.sin(a) * rad * 1.02);
    ctx.lineTo(o.x + Math.cos(a) * rad * (1.02 + 0.14 * (1 - k)), o.y + Math.sin(a) * rad * (1.02 + 0.14 * (1 - k)));
    ctx.stroke();
  }
}
      ctx.globalCompositeOperation = "source-over";
    };

    /* ---- cursor: dot + ring, ink trail ---- */
    const drawCursor = (dt: number, now: number) => {
      const dot = dotRef.current;
      const ring = ringRef.current;
      const cv = inkRef.current;
      if (!fine) return;

      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      const rsT = over ? 2.3 : hov ? 1.9 : down ? 0.8 : 1;
      rs += (rsT - rs) * 0.15;
      if (dot) {
        dot.style.opacity = seen ? "1" : "0";
        dot.style.transform = `translate3d(${tx}px,${ty}px,0) scale(${down ? 0.6 : hov || over ? 0.5 : 1})`;
      }
      if (ring) {
        ring.style.opacity = seen ? "1" : "0";
        ring.style.transform = `translate3d(${rx}px,${ry}px,0) scale(${rs})`;
      }
      if (!cv || reduce) return;

      const speed = Math.hypot(tx - rx, ty - ry);
      trail.push({ x: rx, y: ry });
      if (trail.length > 26 || !seen) trail.shift();
      if (now - lastMove > 150 && trail.length) trail.shift();
      if (seen && speed > 18 && Math.random() < 0.5)
        drops.push({ x: rx, y: ry, vx: rand(-40, 40), vy: rand(-20, 60), life: 0, max: rand(0.5, 1.1), size: rand(1, 3) });

      const ctx = cv.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.strokeStyle = "#fff";
      ctx.fillStyle = "#fff";
      ctx.lineCap = "round";
      for (let i = 1; i < trail.length; i++) {
        const a = i / trail.length;
        ctx.globalAlpha = a * 0.55;
        ctx.lineWidth = 1 + a * 5;
        ctx.beginPath();
        ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
        ctx.lineTo(trail[i].x, trail[i].y);
        ctx.stroke();
      }
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.life += dt;
        if (d.life >= d.max) {
          drops.splice(i, 1);
          continue;
        }
        d.vy += 320 * dt;
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        const k = 1 - d.life / d.max;
        ctx.globalAlpha = k * 0.7;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size * (0.4 + k), 0, 6.283);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const apply = (g: number, dt: number, now: number) => {
      over = false;
      panelRect = null;
      fireI = 1 - seg(g, LN[0] * 0.55, LN[0] * 1.0);

      let top = 0;
      CHAPTERS.forEach((_, i) => {
        if (applyChapter(i, g) > 0.5) top = i;
      });

      // energy sparks flying off the character while scrolling
      const pr = panelRect as DOMRect | null;
      if (pr && !reduce && velS > 0.012) {
        const cx = pr.left + pr.width / 2;
        const cy = pr.top + pr.height / 2;
        const n = Math.min(5, Math.ceil(velS * 30));
        for (let i = 0; i < n; i++) {
          const a = rand(0, 6.283);
          addSpark(
            cx + Math.cos(a) * pr.width * 0.42,
            cy + Math.sin(a) * pr.height * 0.42,
            Math.cos(a) * rand(40, 160),
            Math.sin(a) * rand(40, 160) - 60,
            rand(0.5, 1.1),
            rand(1, 2.2),
            -40
          );
        }
      }

      drawFx(dt, now);
      drawCursor(dt, now);

      if (barRef.current) barRef.current.style.transform = `scaleX(${g / TOT})`;
      if (hintRef.current) hintRef.current.style.opacity = String(1 - seg(g, 0, 0.35));
      if (top !== activeRef.current) {
        activeRef.current = top;
        setActive(top);
      }
    };

    const onResize = () => {
      layout();
      readScroll();
    };
    const onMove = (e: MouseEvent) => {
      mvSpeed = Math.max(mvSpeed, Math.hypot(e.clientX - tx, e.clientY - ty));
      tx = e.clientX;
      ty = e.clientY;
      mxT = (tx / vw - 0.5) * 2;
      myT = (ty / vh - 0.5) * 2;
      hov = !!(e.target as HTMLElement).closest?.("a,button");
      if (!seen) {
        seen = true;
        rx = tx;
        ry = ty;
      }
      lastMove = performance.now();
    };
    const onLeave = () => {
      seen = false;
      mxT = 0;
      myT = 0;
    };
    const onDown = () => (down = true);
    const onUp = () => (down = false);

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;
      cur += (target - cur) * (reduce ? 1 : 0.1);
      velS += (Math.abs(target - cur) - velS) * 0.2;
      if (Math.abs(target - cur) < 0.0005) cur = target;
      mvSpeed *= 0.8;
      const m = reduce ? 0 : 0.06;
      mxs += (mxT - mxs) * m;
      mys += (myT - mys) * m;
      apply(cur, dt, now);
      raf = requestAnimationFrame(tick);
    };

    layout();
    readScroll();
    cur = target;
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", onResize);
    if (fine && stage) {
      stage.addEventListener("mousemove", onMove);
      stage.addEventListener("mouseleave", onLeave);
      stage.addEventListener("mousedown", onDown);
      window.addEventListener("mouseup", onUp);
    }
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", onResize);
      if (fine && stage) {
        stage.removeEventListener("mousemove", onMove);
        stage.removeEventListener("mouseleave", onLeave);
        stage.removeEventListener("mousedown", onDown);
        window.removeEventListener("mouseup", onUp);
      }
    };
  }, []);

  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, [mobile]);

  /* ---------------------------------------------------------------- */
  const shadow = { textShadow: "0 0 26px var(--wc-bg), 0 0 8px var(--wc-bg)" };
  const activeTone = CHAPTERS[active].tone;

  return (
    <section
      ref={sectionRef}
      id="character"
      aria-label="Characters"
      className="relative"
      style={{ height: `${Math.round((TOT + 1) * 100)}vh` }}
    >
      <style>{CSS}</style>

      <svg aria-hidden width="0" height="0" className="pointer-events-none absolute h-0 w-0">
        <defs>
          <filter id="wcWater" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="3" seed="4" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="70" />
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>
      </svg>

      <div
        className="wc-stage sticky top-0 h-screen w-full overflow-hidden transition-colors duration-500"
        ref={stageRef}
        style={{
          color: activeTone ? DARK : INK_LIGHT,
          ["--wc-ink" as string]: activeTone ? DARK : INK_LIGHT,
          background: DARK,
        }}
      >
        {/* ============ CHAPTERS ============ */}
        {CHAPTERS.map((c, ci) => {
          const blocks = blocksFor(c);
          const longTitle = c.title.length > 22;
          const light = c.tone === 1;
          const side = c.side;
          const info = isInfo(ci);
          return (
            <div
              key={c.id}
              ref={(el) => {
                R.current[ci].wrap = el;
              }}
              className="pointer-events-none absolute inset-0 overflow-hidden text-[color:var(--wc-ink)]"
              style={{
                visibility: "hidden",
                opacity: ci === 0 ? 1 : 0,
                zIndex: ci + 1,
                ["--wc-bg" as string]: light ? PAPER : DARK,
                ["--wc-ink" as string]: light ? DARK : INK_LIGHT,
                backgroundColor: light ? PAPER : DARK,
              }}
            >
              {/* background art */}
              <div
                ref={(el) => {
                  R.current[ci].bgImg = el;
                }}
                aria-hidden
                className="absolute inset-0 bg-cover bg-center will-change-transform"
                style={{
                  backgroundImage: `url("${BG_IMAGES[ci % BG_IMAGES.length]}")`,
                  mixBlendMode: light ? "multiply" : "luminosity",
                  opacity: light ? 0.4 : 0.5,
                }}
              />

              {/* emblem */}
              <div
                ref={(el) => {
                  R.current[ci].emblem = el;
                }}
                aria-hidden
                className="absolute left-1/2 top-1/2 w-[min(130vh,130vw)] will-change-transform"
                style={{ opacity: light ? 0.12 : 0.1 }}
              >
                <Emblem className="block h-full w-full" />
              </div>

              {/* smoke back */}
              <div
                ref={(el) => {
                  R.current[ci].smokeA = el;
                }}
                aria-hidden
                className="absolute left-1/2 top-1/2 h-[150vh] w-[140vw] will-change-transform"
              >
                <svg
                  viewBox="0 0 1000 1000"
                  preserveAspectRatio="none"
                  className="block h-full w-full"
                  fill="currentColor"
                  style={{ filter: "url(#wcWater)", opacity: light ? 0.1 : 0.07 }}
                >
                  {smokeFor(ci, 0).map((d, i) => (
                    <path key={i} d={d} />
                  ))}
                </svg>
              </div>

              {/* smoke front */}
              <div
                ref={(el) => {
                  R.current[ci].smokeB = el;
                }}
                aria-hidden
                className="absolute left-1/2 top-1/2 h-[170vh] w-[140vw] will-change-transform"
              >
                <svg
                  viewBox="0 0 1000 1000"
                  preserveAspectRatio="none"
                  className="block h-full w-full"
                  fill="currentColor"
                  style={{ filter: "url(#wcWater)", opacity: light ? 0.16 : 0.1 }}
                >
                  {smokeFor(ci, 1).map((d, i) => (
                    <path key={i} d={d} />
                  ))}
                </svg>
              </div>

              {/* battleground (intro only) */}
              {ci === 0 && (
                <>
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(80% 45% at 50% 100%, rgba(255,120,30,0.35), transparent 70%)",
                    }}
                  />
                  <svg
                    aria-hidden
                    viewBox="0 0 1200 200"
                    preserveAspectRatio="none"
                    className="absolute inset-x-0 bottom-0 h-[24vh] w-full"
                    fill="#000"
                    opacity="0.65"
                  >
                    <path d="M0 200 L0 130 C150 105 260 140 420 120 S700 100 860 125 S1100 105 1200 120 L1200 200 Z" />
                    {SPEARS.map((x, i) => {
                      const h = 55 + ((i * 37) % 40);
                      const y0 = 125 - (i % 3) * 6;
                      return (
                        <g key={x}>
                          <line x1={x} y1={y0} x2={x} y2={y0 - h} stroke="#000" strokeWidth="3" />
                          <path d={`M${x} ${y0 - h} L${x + 26} ${y0 - h + 8} L${x} ${y0 - h + 18} Z`} />
                        </g>
                      );
                    })}
                  </svg>
                </>
              )}

           

              {/* character */}
              {c.img && (
                <div
                  ref={(el) => {
                    R.current[ci].panel = el;
                  }}
                  className="absolute left-1/2 top-1/2 will-change-transform"
                  style={{ transform: "translate(-50%,-50%) translateY(120vh)" }}
                >
                  {/* aura: pulses with scroll speed */}
                  <div
                    ref={(el) => {
                      R.current[ci].aura = el;
                    }}
                    aria-hidden
                    className="pointer-events-none absolute -inset-[16%] rounded-full"
                    style={{
                      background:
                        "radial-gradient(closest-side, rgba(255,150,50,0.35), rgba(255,90,30,0.12) 60%, transparent 100%)",
                      opacity: 0.25,
                    }}
                  >
                    <svg viewBox="-100 -100 200 200" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="0.6">
                      <circle r="92" strokeDasharray="2 5" />
                      <circle r="78" strokeDasharray="10 8" />
                      {Array.from({ length: 16 }).map((_, i) => (
                        <line key={i} x1="0" y1="-98" x2="0" y2="-88" transform={`rotate(${i * 22.5})`} />
                      ))}
                    </svg>
                  </div>

                  <div
                    ref={(el) => {
                      R.current[ci].body = el;
                    }}
                    className="absolute inset-0 will-change-transform"
                  >
                    {/* thought cloud backdrop */}
                    <svg
                      viewBox="0 0 1 1"
                      preserveAspectRatio="none"
                      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                      aria-hidden
                    >
                      <path
                        d={CLOUD}
                        fill="color-mix(in oklab, var(--wc-ink) 10%, var(--wc-bg))"
                        stroke="currentColor"
                        strokeWidth="6"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>

                    {[
                      { s: 18, o: -6, b: 6 },
                      { s: 12, o: -14, b: -2 },
                      { s: 8, o: -20, b: -9 },
                    ].map((d, i) => (
                      <span
                        key={i}
                        aria-hidden
                        className="absolute block rounded-full border-[3px] border-current bg-[color:var(--wc-bg)]"
                        style={{
                          width: d.s,
                          height: d.s,
                          bottom: `${d.b + 8}%`,
                          [side > 0 ? "left" : "right"]: `${d.o * 2.4}%`,
                        }}
                      />
                    ))}

                    {/* character pops out of the cloud, bigger */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      ref={(el) => {
                        R.current[ci].img = el;
                      }}
                      src={c.img}
                      alt={c.title}
                      draggable={false}
                      className="absolute -bottom-[6%] left-[-8%] h-[116%] w-[116%] select-none object-contain object-bottom"
                    />

               
                  </div>

                  <p className="wc-hand absolute inset-x-0 top-full mt-2 text-center text-xl leading-none">
                    {c.title}
                  </p>
                </div>
              )}

           
              {/* text blocks — box / plain / bubble */}
              {blocks.map((b, k) => {
                const kind = mobile ? 0 : info ? (k % 2 === 0 ? 0 : 2) : k % 3;
                return (
                  <div
                    key={k}
                    ref={(el) => {
                      R.current[ci].blocks[k] = el;
                    }}
                    className="absolute left-1/2 top-1/2 will-change-transform"
                    style={{ opacity: 0 }}
                  >
                    {kind === 0 && (
                      <div
                        className="bg-[color:var(--wc-ink)] px-8 py-9 text-left text-[color:var(--wc-bg)] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.7)]"
                        style={{ clipPath: "polygon(0.5% 3%, 100% 0, 99.5% 97%, 0 100%)" }}
                      >
                        {b.h && (
                          <p className="mb-3 font-serif text-xs font-semibold uppercase tracking-[0.3em]">{b.h}</p>
                        )}
                        <p className="font-serif text-[length:clamp(0.95rem,1.1vw+0.4rem,1.2rem)] leading-relaxed">
                          <Typed
                            text={b.t}
                            reg={(el) => {
                              R.current[ci].typed[k] = el;
                            }}
                          />
                        </p>
                      </div>
                    )}

                    {kind === 1 && (
                      <div className="text-center" style={shadow}>
                        {b.h && (
                          <p className="mb-3 font-serif text-xs font-semibold uppercase tracking-[0.3em]">{b.h}</p>
                        )}
                        <p className="font-serif text-[length:clamp(0.95rem,1.1vw+0.4rem,1.2rem)] leading-relaxed">
                          <Typed
                            text={b.t}
                            reg={(el) => {
                              R.current[ci].typed[k] = el;
                            }}
                          />
                        </p>
                      </div>
                    )}

                    {kind === 2 && (
                      <div className="relative rounded-[46%/58%] border-[3px] border-current bg-[color:var(--wc-bg)] px-12 py-9 text-center shadow-[0_24px_50px_-28px_rgba(0,0,0,0.6)]">
                        {b.h && (
                          <p className="mb-2 font-serif text-[10px] font-semibold uppercase tracking-[0.3em]">{b.h}</p>
                        )}
                        <p className="wc-hand text-[length:clamp(1.2rem,1.6vw+0.5rem,1.9rem)] leading-snug">
                          <Typed
                            text={b.t}
                            reg={(el) => {
                              R.current[ci].typed[k] = el;
                            }}
                          />
                        </p>
                        <svg
                          viewBox="0 -4 60 74"
                          className="pointer-events-none absolute -bottom-[2.3rem] left-[55%] h-14 w-12 overflow-visible"
                          fill="var(--wc-bg)"
                          stroke="currentColor"
                          strokeWidth="3.5"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          <path d="M6 -4 C20 34 38 52 56 66 C30 54 22 30 30 -4" />
                        </svg>
                      </div>
                    )}

                    {b.cta && (
                      <div className="mt-6 text-center">
                        <a
                          href={b.cta.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block rounded-full bg-accent px-6 py-2.5 font-serif text-[11px] uppercase tracking-[0.2em] text-accent-fg transition hover:opacity-80"
                        >
                          {b.cta.label}
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* title card — plain text, no typing */}
              <div
                ref={(el) => {
                  R.current[ci].head = el;
                }}
                className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center"
                style={shadow}
              >
                {c.kicker && (
                  <p className="mb-4 font-serif text-[11px] uppercase tracking-[0.5em]">{c.kicker}</p>
                )}
                <h2
                  className={`${ci === 0 ? "wc-slam " : ""}mx-auto max-w-5xl font-serif font-semibold uppercase leading-[0.98] tracking-wide ${
                    longTitle
                      ? "text-[length:clamp(1.9rem,5.2vw,4.4rem)]"
                      : "text-[length:clamp(2.8rem,10vw,8.5rem)]"
                  }`}
                >
                  {c.title}
                </h2>
                {c.sub && (
                  <p className="mx-auto mt-5 max-w-[42ch] font-serif text-[length:clamp(0.9rem,1.2vw+0.3rem,1.15rem)] italic">
                    {c.sub}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {/* ============ FX: fireballs, sparks, hover + scroll energy ============ */}
        <canvas
          ref={fxRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[41] h-full w-full"
        />

        {/* ============ CURSOR EFFECTS ============ */}
        <canvas
          ref={inkRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[47] h-full w-full mix-blend-difference"
        />
        <div
          ref={ringRef}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-[48] -ml-[18px] -mt-[18px] h-9 w-9 rounded-full border-[1.5px] border-white opacity-0 mix-blend-difference"
        />
        <div
          ref={dotRef}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-[49] -ml-1 -mt-1 h-2 w-2 rounded-full bg-white opacity-0 mix-blend-difference"
        />

   

        <nav
          aria-label="Chapters"
          className="absolute right-3 top-1/2 z-[46] flex -translate-y-1/2 flex-col gap-3 sm:right-5"
        >
          {CHAPTERS.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => jump(i)}
              aria-label={c.title}
              aria-current={i === active}
              className="group relative grid h-4 w-4 place-items-center"
            >
              <span
                className={`block rounded-full border border-current transition-all duration-300 ${
                  i === active ? "h-3 w-3 bg-current" : "h-2 w-2"
                }`}
              />
              <span className="pointer-events-none absolute right-6 hidden whitespace-nowrap font-serif text-[10px] uppercase tracking-[0.2em] opacity-0 transition group-hover:opacity-100 sm:block">
                {c.title.length > 18 ? c.id : c.title}
              </span>
            </button>
          ))}
        </nav>

     

        <div aria-hidden className="absolute inset-x-0 bottom-0 z-[46] h-[3px] bg-current/15">
          <span
            ref={barRef}
            className="block h-full origin-left bg-accent"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
}