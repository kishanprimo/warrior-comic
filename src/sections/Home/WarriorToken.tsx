"use client";

import React, { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* Content (from warriorcomics.com)                                    */
/* ------------------------------------------------------------------ */
const LOGO = "/Images/Imgs/warrior-token-logo.png";
const HEADING = "ICO presale will start soon";
const BODY =
  "We would like to invite you all to participate in the Warrior Token sale. With your support we will be able to raise fund for this revolutionary platform. We will continue to share the updates of the project here and on our communities. Stay tuned!";
const CTA_LABEL = "Join the presale";
const CTA_HREF = "https://warriortoken.com/";

// Progress bar. Change RAISED_M when the sale goes live.
const RAISED_M = 0;
const SOFTCAP_M = 5;
const HARDCAP_M = 10;

// Loader duration (ms) each time the section scrolls into view
 const LOAD_MS = 600;

// Sparks fly off the mouse when it moves across the section (desktop only).
// Set to false if you don't want any cursor effect.
const CURSOR_SPARKS = true;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const rand = (a: number, b: number) => a + Math.random() * (b - a);

const EASE = "cubic-bezier(0.77,0,0.175,1)";

/* Continuous-animation keyframes (self-contained) */
const CSS = `
@keyframes wtSpin { to { transform: rotate(360deg); } }
@keyframes wtSpinRev { to { transform: rotate(-360deg); } }
@keyframes wtPulse {
  0%, 100% { opacity: .45; transform: scale(1); }
  50%      { opacity: .95; transform: scale(1.1); }
}
@keyframes wtTwinkle {
  0%, 100% { opacity: .2; transform: scale(.7); }
  50%      { opacity: 1;  transform: scale(1.4); }
}
@keyframes wtSweep {
  0%   { transform: translateX(-120%); }
  100% { transform: translateX(520%); }
}
@keyframes wtDrift {
  0%, 100% { transform: translate3d(0, 0, 0); }
  50%      { transform: translate3d(0, -14px, 0); }
}
@keyframes wtFlicker {
  0%, 100% { opacity: .55; }
  8%  { opacity: .8; }
  17% { opacity: .5; }
  31% { opacity: .92; }
  47% { opacity: .6; }
  63% { opacity: .85; }
  78% { opacity: .5; }
  90% { opacity: .75; }
}
.wt-spin     { animation: wtSpin 50s linear infinite; }
.wt-spin-mid { animation: wtSpin 20s linear infinite; }
.wt-spin-rev { animation: wtSpinRev 32s linear infinite; }
.wt-pulse    { animation: wtPulse 5s ease-in-out infinite; }
.wt-twinkle  { animation: wtTwinkle 3.4s ease-in-out infinite; }
.wt-sweep    { animation: wtSweep 2.8s cubic-bezier(.4,0,.2,1) infinite; }
.wt-drift    { animation: wtDrift 7s ease-in-out infinite; }
.wt-flicker  { animation: wtFlicker 3.2s linear infinite; }
@media (prefers-reduced-motion: reduce) {
  .wt-spin, .wt-spin-mid, .wt-spin-rev, .wt-pulse, .wt-twinkle,
  .wt-sweep, .wt-drift, .wt-flicker { animation: none !important; }
}
`;

// floating sparks: [left%, top%, delay s, size px]
const SPARKS: [number, number, number, number][] = [
  [8, 22, 0, 3],
  [16, 74, 1.2, 4],
  [44, 12, 2.1, 3],
  [52, 88, 0.6, 3],
  [66, 30, 1.7, 4],
  [90, 18, 0.3, 3],
  [93, 68, 2.6, 4],
  [36, 52, 1.0, 2],
];

type Phase = "idle" | "loading" | "open";

/* ------------------------------------------------------------------ */
/* Count-up number (0 → to), starts when `run` turns true              */
/* ------------------------------------------------------------------ */
function Count({
  to,
  run,
  delay = 0,
  dur = 1500,
  suffix = "M",
}: {
  to: number;
  run: boolean;
  delay?: number;
  dur?: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!run) {
      el.textContent = `0${suffix}`;
      return;
    }
    let raf = 0;
    const timer = setTimeout(() => {
      const t0 = performance.now();
      const f = (now: number) => {
        const t = clamp((now - t0) / dur);
        el.textContent = `${Math.round(easeOut(t) * to)}${suffix}`;
        if (t < 1) raf = requestAnimationFrame(f);
      };
      raf = requestAnimationFrame(f);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [run, to, delay, dur, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

/* ------------------------------------------------------------------ */
/* Particle types for the fire / spark canvas                          */
/* ------------------------------------------------------------------ */
type Particle = {
  x: number;
  y: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  kind: 0 | 1 | 2; // 0 ember, 1 burst spark, 2 cursor spark
  seed: number;
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export default function WarriorToken() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const logoParRef = useRef<HTMLDivElement>(null);
  const logoBoxRef = useRef<HTMLDivElement>(null);
  const textParRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const phaseRef = useRef<Phase>("idle");
  const open = phase === "open";

  const go = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };

  /* ---- Loader: runs every time the section scrolls into view ---- */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dur = reduce ? 300 : LOAD_MS;
    let raf = 0;
    let hold: ReturnType<typeof setTimeout> | undefined;

    const stop = () => {
      cancelAnimationFrame(raf);
      if (hold) clearTimeout(hold);
    };

    const start = () => {
      stop();
      // First scroll section fully into view
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      // Then start loading after a short delay to allow scroll to complete
      setTimeout(() => {
        go("loading");
        // Lock scroll during loading
        document.body.style.overflow = "hidden";
        const t0 = performance.now();
        const frame = (now: number) => {
          const t = clamp((now - t0) / dur);
          const e = easeInOut(t);
          if (counterRef.current)
            counterRef.current.textContent = String(Math.round(e * 100)).padStart(3, "0");
          if (lineRef.current) lineRef.current.style.transform = `scaleX(${e})`;
          if (t < 1) raf = requestAnimationFrame(frame);
          else {
            hold = setTimeout(() => {
              go("open");
              // Unlock scroll after loading completes
              document.body.style.overflow = "";
            }, 60);
          }
        };
        raf = requestAnimationFrame(frame);
      }, 500); // Wait 500ms for scroll to complete
    };

    const reset = () => {
      stop();
      go("idle");
      // Ensure scroll is unlocked on reset
      document.body.style.overflow = "";
      if (counterRef.current) counterRef.current.textContent = "000";
      if (lineRef.current) lineRef.current.style.transform = "scaleX(0)";
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.3 && phaseRef.current === "idle") start();
        else if (entry.intersectionRatio === 0 && phaseRef.current !== "idle") reset();
      },
      { threshold: [0, 0.3] }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
      // Clean up scroll lock on unmount
      document.body.style.overflow = "";
    };
  }, []);

  /* ---- Scroll parallax ---- */
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let enter = 0;
    let pass = 0;

    const loop = () => {
      const el = sectionRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const vw = window.innerWidth;
        const k = reduce ? 1 : 0.12;

        enter += (clamp(1 - r.top / vh) - enter) * k;
        pass += (clamp((vh - r.top) / (vh + r.height)) - pass) * k;

        // sheet corners flatten as the section rises into place
        const rad = (1 - easeOut(seg(enter, 0, 0.55))) * 56;
        el.style.borderRadius = `${rad}px ${rad}px 0 0`;

        if (ghostRef.current)
          ghostRef.current.style.transform = `translate3d(${-pass * vw * 0.7}px, 0, 0)`;
        if (logoParRef.current)
          logoParRef.current.style.transform = `translate3d(0, ${(0.5 - pass) * 90}px, 0)`;
        if (textParRef.current)
          textParRef.current.style.transform = `translate3d(0, ${(pass - 0.5) * 40}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ---- Fire & sparks: rising embers, forge bursts from the emblem,
          and (optionally) sparks thrown off the cursor ---- */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const ps: Particle[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = performance.now();
    let visible = false;
    let wasActive = false;
    let nextBurst = 0;
    let emberAcc = 0;
    let lx = -1;
    let ly = -1;

    const resize = () => {
      const r = section.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(section);

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
      threshold: 0,
    });
    io.observe(section);

    const add = (p: Partial<Particle> & Pick<Particle, "x" | "y" | "vx" | "vy" | "max" | "size" | "kind">) => {
      if (ps.length > 380) return;
      ps.push({ px: p.x, py: p.y, life: 0, seed: Math.random() * 10, ...p });
    };

    const ember = () =>
      add({
        x: rand(0, w),
        y: h + 8,
        vx: rand(-14, 14),
        vy: -rand(40, 130),
        max: rand(4, 8),
        size: rand(0.8, 2.6),
        kind: 0,
      });

    const burst = (n: number) => {
      const lb = logoBoxRef.current;
      if (!lb) return;
      const r = lb.getBoundingClientRect();
      const sr = section.getBoundingClientRect();
      const ox = r.left + r.width / 2 - sr.left;
      const oy = r.top + r.height * 0.36 - sr.top;
      for (let i = 0; i < n; i++) {
        // mostly upward fan, a few sideways
        const a = -Math.PI / 2 + rand(-1.25, 1.25);
        const s = rand(140, 460);
        add({
          x: ox,
          y: oy,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          max: rand(0.7, 1.7),
          size: rand(1, 2.4),
          kind: 1,
        });
      }
    };

    const onMove = (e: PointerEvent) => {
      if (!CURSOR_SPARKS || !fine || !visible || phaseRef.current !== "open") return;
      const sr = section.getBoundingClientRect();
      const x = e.clientX - sr.left;
      const y = e.clientY - sr.top;
      if (y < 0 || y > sr.height) {
        lx = -1;
        return;
      }
      if (lx >= 0) {
        const dx = x - lx;
        const dy = y - ly;
        const d = Math.hypot(dx, dy);
        const n = Math.min(3, Math.floor(d / 16));
        for (let i = 0; i < n; i++) {
          add({
            x,
            y,
            vx: -dx * rand(1.5, 4) + rand(-50, 50),
            vy: -dy * rand(1.5, 4) - rand(20, 90),
            max: rand(0.45, 1),
            size: rand(0.9, 1.9),
            kind: 2,
          });
        }
      }
      lx = x;
      ly = y;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible && ps.length === 0) return;

      const active = visible && phaseRef.current === "open";
      if (active) {
        if (!wasActive) {
          burst(38); // big first strike when the doors open
          nextBurst = now + rand(1600, 2600);
        }
        emberAcc += dt * (w / 1400) * 26;
        while (emberAcc >= 1) {
          ember();
          emberAcc -= 1;
        }
        if (now >= nextBurst) {
          burst(Math.floor(rand(14, 26)));
          nextBurst = now + rand(1400, 3400);
        }
      }
      wasActive = active;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";

      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.life += dt;
        if (p.life >= p.max || p.y < -20 || p.y > h + 40) {
          ps.splice(i, 1);
          continue;
        }
        const f = 1 - p.life / p.max; // 1 → 0
        p.px = p.x;
        p.py = p.y;

        if (p.kind === 0) {
          p.x += (p.vx + Math.sin(p.life * 2.2 + p.seed) * 22) * dt;
          p.y += p.vy * dt;
          const flick = 0.65 + 0.35 * Math.sin(p.life * 14 + p.seed * 3);
          const a = Math.min(1, f * 1.6) * flick;
          ctx.fillStyle = `rgba(255,${Math.round(90 + 120 * f)},40,${a * 0.16})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3.2, 0, 6.283);
          ctx.fill();
          ctx.fillStyle = `rgba(255,${Math.round(150 + 90 * f)},70,${a})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, 6.283);
          ctx.fill();
        } else {
          p.vy += 520 * dt; // gravity
          p.vx *= 0.985;
          p.vy *= 0.985;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          // white-hot core → orange → deep red as it cools
          const hue = 8 + 42 * f;
          const light = 45 + 30 * f;
          ctx.strokeStyle = `hsla(${hue},100%,${light}%,${Math.min(1, f * 1.4)})`;
          ctx.lineWidth = p.size * (0.5 + f);
          ctx.beginPath();
          ctx.moveTo(p.px, p.py);
          ctx.lineTo(p.x - p.vx * 0.012, p.y - p.vy * 0.012);
          ctx.stroke();
        }
      }
      ctx.globalCompositeOperation = "source-over";
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  /* ---- small style helpers for the staggered reveal ---- */
  const rise = (d: number): React.CSSProperties => ({
    opacity: open ? 1 : 0,
    transform: open ? "translateY(0)" : "translateY(18px)",
    transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
    transitionDelay: open ? `${d}s` : "0s",
  });

  const words = HEADING.toUpperCase().split(" ");
  const raisedPct = (RAISED_M / HARDCAP_M) * 100;
  const softPct = (SOFTCAP_M / HARDCAP_M) * 100;

/* ---------------------------------------------------------------- */
  return (
    <section
      ref={sectionRef}
      id="warrior-token"
      aria-label="Warrior Token presale"
      className="relative isolate min-h-screen overflow-hidden bg-[color-mix(in_oklab,var(--nav-overlay-bg)_30%,#000)] text-nav-right-heading transition-colors duration-500"
    >
      <style>{CSS}</style>

      {/* ============ BACKDROP (dark, blackish) ============ */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_70%_38%,var(--nav-right-from)_0%,transparent_60%)] opacity-25"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,transparent_25%,rgba(0,0,0,0.75)_100%)]"
      />

      {/* forge glow rising from the bottom edge */}
      <div
        aria-hidden
        className="wt-flicker pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-orange-600/30 via-red-700/10 to-transparent"
      />
      <div
        aria-hidden
        className="wt-flicker pointer-events-none absolute inset-x-[10%] bottom-0 h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent"
      />

      {/* giant outlined word that slides sideways as you scroll */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none"
      >
        <div
          ref={ghostRef}
          className="whitespace-nowrap font-serif text-[clamp(10rem,30vw,26rem)] uppercase leading-none text-transparent [-webkit-text-stroke:1px_var(--nav-right-line)] will-change-transform"
        >
          Warrior Token Warrior Token
        </div>
      </div>

      {/* twinkling sparks — positions & sizes come from SPARKS array */}
      {SPARKS.map(([l, t, d, sz], i) => (
        <span
          key={i}
          aria-hidden
          className="wt-twinkle pointer-events-none absolute rounded-full bg-nav-right-heading"
          style={{
            left: `${l}%`,
            top: `${t}%`,
            width: sz,
            height: sz,
            animationDelay: `${d}s`,
          }}
        />
      ))}

      {/* ============ CONTENT (wide) ============ */}
      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-[1600px] items-center gap-12 px-6 py-24 sm:px-10 lg:grid-cols-[1fr_1.3fr] lg:gap-20 lg:px-16 xl:px-24">
        {/* ---------- LEFT: logo ---------- */}
        <div ref={logoParRef} className="relative mx-auto w-full max-w-[600px] will-change-transform">
          <div className="[perspective:900px]">
            <div ref={logoBoxRef} className="relative">
              {/* orbit rings behind the emblem (continuous) */}
              <div
                aria-hidden
                className={`pointer-events-none absolute left-1/2 top-[36%] aspect-square w-[88%] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-[1200ms] ease-out ${
                  open ? "opacity-100 delay-[700ms]" : "opacity-0 delay-0"
                }`}
              >
                <div className="wt-pulse absolute inset-[6%] rounded-full bg-orange-500/20 blur-3xl" />
                <div className="absolute inset-0 rounded-full border border-nav-right-line" />
                <div className="wt-spin-rev absolute -inset-5 rounded-full border border-dashed border-nav-right-line" />
                <div className="wt-spin absolute -inset-12 rounded-full border border-nav-right-line/50">
                  <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_16px_3px_var(--accent)]" />
                </div>
                <div className="wt-spin-mid absolute inset-0">
                  <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_14px_4px_rgba(103,232,249,0.7)]" />
                  <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-red-500 shadow-[0_0_12px_3px_rgba(239,68,68,0.7)]" />
                </div>
              </div>

              {/* emblem: wipes in top-to-bottom, scale + blur settle */}
              <div className="wt-drift relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={LOGO}
                  alt="Warrior Token"
                  draggable={false}
                  className={`relative w-full select-none drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)] transition-[clip-path,transform,filter,opacity] duration-[1400ms,1600ms,1200ms,600ms] ease-[cubic-bezier(0.77,0,0.175,1),cubic-bezier(0.77,0,0.175,1),ease-out,ease-out] ${
                    open
                      ? "scale-100 rotate-0 opacity-100 blur-0 [clip-path:inset(0_0_0%_0)] delay-[250ms]"
                      : "scale-[1.18] -rotate-6 opacity-0 blur-[12px] [clip-path:inset(0_0_100%_0)] delay-0"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ---------- RIGHT: copy ---------- */}
        <div ref={textParRef} className="relative will-change-transform">
          <h2
            aria-label={HEADING}
            className="font-serif text-[clamp(2.4rem,6vw,5.6rem)] uppercase leading-[0.98] tracking-wide"
          >
            {words.map((w, i) => (
              <span
                key={i}
                aria-hidden
                className="inline-block overflow-hidden py-1 pr-[0.28em] align-bottom"
              >
                <span
                  className={`block transition-transform duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)] ${
                    open ? "translate-y-0" : "translate-y-[115%]"
                  }`}
                  style={{ transitionDelay: open ? `${0.35 + i * 0.09}s` : "0s" }}
                >
                  {w}
                </span>
              </span>
            ))}
          </h2>

          {/* progress (numbers count up when the section opens) */}
          <div className="mt-10 max-w-[860px]" style={rise(0.9)}>
            <div className="grid grid-cols-3 font-serif text-xs tracking-[0.12em] text-nav-right-heading sm:text-sm">
              <span className="text-left">
                <Count to={0} run={open} delay={1000} />
              </span>
              <span className="text-center">
                <Count to={SOFTCAP_M} run={open} delay={1100} />
              </span>
              <span className="text-right">
                <Count to={HARDCAP_M} run={open} delay={1200} />
              </span>
            </div>

            <div className="relative mt-2 h-4 w-full overflow-hidden rounded-full bg-nav-right-heading/90">
              {/* raised amount */}
              <span
                className={`absolute inset-y-0 left-0 origin-left rounded-full bg-accent transition-transform duration-[1400ms] ease-[cubic-bezier(0.77,0,0.175,1)] ${
                  open ? "scale-x-100 delay-[1100ms]" : "scale-x-0 delay-0"
                }`}
                style={{ width: `${raisedPct}%` }}
              />
              {/* softcap marker */}
              <span
                className="absolute inset-y-0 w-px bg-black/40"
                style={{ left: `${softPct}%` }}
              />
              {/* scanning light (continuous) */}
              <span className="wt-sweep absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-transparent via-orange-500/80 to-transparent" />
            </div>

            <div className="mt-2 grid grid-cols-3 font-serif text-xs tracking-[0.12em] text-nav-right-text sm:text-sm">
              <span className="text-left">Raised</span>
              <span className="text-center">Softcap</span>
              <span className="text-right">Hardcap</span>
            </div>
          </div>

          <p
            className="mt-8 max-w-[760px] text-base leading-relaxed text-nav-right-text sm:text-lg"
            style={rise(1.05)}
          >
            {BODY}
          </p>

          <div style={rise(1.2)} className="mt-9">
            <a
              href={CTA_HREF}
              target="_blank"
              rel="noreferrer"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-accent px-8 py-3.5 font-serif text-xs uppercase tracking-[0.2em] text-accent-fg transition-transform duration-300 hover:scale-[1.04] active:scale-95"
            >
              <span className="relative z-10">{CTA_LABEL}</span>
              <span className="relative z-10 inline-block transition-transform duration-300 group-hover:translate-x-1">
                ✳
              </span>
              <span
                aria-hidden
                className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/40 transition-transform duration-700 group-hover:translate-x-[420%]"
              />
            </a>
          </div>
        </div>
      </div>

      {/* ============ FIRE / SPARK CANVAS ============ */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[15] h-full w-full"
      />

      {/* ============ LOADER: two doors that split open ============ */}
      <div
        aria-hidden={open}
        className={`absolute inset-0 z-30 text-background ${open ? "pointer-events-none" : ""}`}
      >
        <div
          className={`absolute inset-x-0 top-0 h-1/2 bg-foreground transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] ${
            open ? "-translate-y-[101%]" : "translate-y-0"
          }`}
        />
        <div
          className={`absolute inset-x-0 bottom-0 h-1/2 bg-foreground transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] ${
            open ? "translate-y-[101%]" : "translate-y-0"
          }`}
        />

        <div
          className={`absolute inset-0 grid place-items-center transition-opacity duration-[250ms] ease-out ${
            open ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="text-center">
            <p className="font-serif text-[clamp(1.8rem,4.5vw,3.4rem)] font-semibold uppercase tracking-[0.18em]">
              <span className="text-red-500">Warrior</span> Token
            </p>

            {/* thick progress bar */}
            <span className="relative mx-auto mt-7 block h-2 w-[min(70vw,420px)] overflow-hidden rounded-full bg-background/25">
              <span
                ref={lineRef}
                className="absolute inset-0 origin-left scale-x-0 rounded-full bg-accent"
              />
            </span>

            <p className="mt-4 font-serif text-sm font-semibold tracking-[0.3em]">
              <span ref={counterRef}>000</span>%
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}