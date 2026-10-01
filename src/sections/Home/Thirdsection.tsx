"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/* Content (from warriorcomics.com)                                    */
/* ------------------------------------------------------------------ */
const BASE = "/images/Imgs";
const COMIC_IMG = "/images/Imgs/comicNoteBook.jpg";
const ARTIST_IMG = `/images/Imgs/warriorartist.jpg`;
const WC_LOGO = `${BASE}/Logo.png`;
const MOTION_VIDEO = "/images/Imgs/warrior-comic-motion-logo.mp4";

const INTRO = "We love to share creative and entertaining stories";
const GAP = 6; // px between tiles once assembled

// true  → tiles rest as solid theme shades and the photo blooms in from the
//         cursor on hover.
// false → the photos are visible all the time (like the original screenshot).
const IMAGES_ON_HOVER = true;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

 

type Rect = { x: number; y: number; w: number; h: number };
// tile order: 0 video, 1 comic, 2 artist, 3 text (the hero card)
const FROM = ["top", "right", "left", "center"] as const;
// [start, end] of each tile's flight on the 0..1 scroll timeline
const FLIGHT: [number, number][] = [
  [0.22, 0.6],
  [0.3, 0.68],
  [0.38, 0.76],
  [0.1, 0.55],
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export default function ThirdSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const introRef = useRef<HTMLParagraphElement>(null);
  const [canHover, setCanHover] = useState(true);
  const [videoOk, setVideoOk] = useState(true);

  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover)").matches);
  }, []);

  /* ---- Scroll-linked assembly (smoothed with lerp) ---- */
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let cur = 0;
    let target = 0;
    let last = -1;
    let vw = window.innerWidth;
    let vh = window.innerHeight;
    let rects: Rect[] = [];

    const layout = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      const mobile = vw < 768;
      if (mobile) {
        const h = (vh - GAP * 3) / 4;
        rects = [0, 1, 2, 3].map((i) => ({ x: 0, y: i * (h + GAP), w: vw, h }));
      } else {
        const w = (vw - GAP) / 2;
        const h = (vh - GAP) / 2;
        rects = [
          { x: 0, y: 0, w, h },
          { x: w + GAP, y: 0, w, h },
          { x: 0, y: h + GAP, w, h },
          { x: w + GAP, y: h + GAP, w, h },
        ];
      }
      tileRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = rects[i];
        el.style.left = `${r.x}px`;
        el.style.top = `${r.y}px`;
        el.style.width = `${r.w}px`;
        el.style.height = `${r.h}px`;
      });
      last = -1;
    };

    const readScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - vh;
      target = total > 0 ? clamp(-r.top / total) : 0;
    };

    const apply = (p: number) => {
      const mobile = vw < 768;

      tileRefs.current.forEach((el, i) => {
        if (!el || !rects[i]) return;
        const r = rects[i];
        const [a, b] = FLIGHT[i];
        const e = easeInOut(seg(p, a, b));
        const inv = 1 - e;

        let dx = 0;
        let dy = 0;
        let sc = 1;
        let rot = 0;

        switch (FROM[i]) {
          case "top":
            dy = -(r.y + r.h + 40);
            dx = -r.w * 0.15;
            rot = -5;
            break;
          case "right":
            dx = vw - r.x + 40;
            dy = -r.h * 0.2;
            rot = 4;
            break;
          case "left":
            dx = -(r.x + r.w + 40);
            dy = r.h * 0.15;
            rot = -4;
            break;
          default: {
            // hero card starts small, dead-centre of the screen
            dx = vw / 2 - (r.x + r.w / 2);
            dy = vh / 2 - (r.y + r.h / 2);
            sc = mobile ? 0.8 : 0.5;
          }
        }

        const scale = sc + (1 - sc) * e;
        el.style.transform = `translate3d(${dx * inv}px, ${dy * inv}px, 0) rotate(${rot * inv}deg) scale(${scale})`;
        el.style.pointerEvents = p > 0.8 ? "auto" : "none";
        if (p < 0.6 && el.dataset.seen) delete el.dataset.seen;
      });

      if (introRef.current) {
        const f = 1 - easeInOut(seg(p, 0.02, 0.24));
        introRef.current.style.opacity = String(f);
        introRef.current.style.transform = `translate3d(0, ${(1 - f) * -30}px, 0)`;
      }
    };

    const onResize = () => {
      layout();
      readScroll();
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

    layout();
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

  /* on enter: remember where the cursor came in, and lock the photo open */
  const enter = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--hx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--hy", `${((e.clientY - r.top) / r.height) * 100}%`);
    el.dataset.seen = "1"; // stays revealed after the mouse leaves
  };

  const reveal = IMAGES_ON_HOVER && canHover;
  const bloom = `absolute inset-0 transition-[clip-path] duration-[220ms] ease-out ${
    reveal
      ? "[clip-path:circle(0%_at_var(--hx,50%)_var(--hy,50%))] group-data-[seen=1]:[clip-path:circle(150%_at_var(--hx,50%)_var(--hy,50%))]"
      : ""
  }`;
  const tile =
    "group absolute overflow-hidden will-change-transform [transform:translate3d(200vw,0,0)]";
  const label =
    "absolute left-5 top-4 z-10 font-serif text-[11px] uppercase tracking-[0.2em] transition-colors duration-500 sm:text-xs";

  /* ---------------------------------------------------------------- */
  return (
    <section
      ref={sectionRef}
      id="artists"
      aria-label="Enthusiastic artists"
       className="relative h-[200vh] bg-nav-left text-nav-left-fg transition-colors duration-500"
    >
      <div className="sticky top-16 sm:top-19 h-screen w-full overflow-hidden">
        {/* lighter glow in the middle */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_50%,var(--nav-left-band)_0%,transparent_100%)] opacity-80"
        />

        {/* grid the tiles fly over */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-40 [background-image:linear-gradient(var(--nav-left-line)_1px,transparent_1px),linear-gradient(90deg,var(--nav-left-line)_1px,transparent_1px)] [background-size:84px_84px]"
        />

        {/* intro line, leaves as the tiles arrive */}
        <p
          ref={introRef}
          className="absolute left-[6vw] top-[16vh] max-w-[16em] font-serif text-[clamp(1.2rem,2.6vw,2.2rem)] leading-tight text-accent"
        >
          {INTRO}
        </p>

        {/* ---------- 0 · motion logo (video) ---------- */}
        <div
          ref={(el) => {
            tileRefs.current[0] = el;
          }}
          className={`${tile} z-[1] bg-nav-overlay text-nav-right-heading`}
          style={{ left: 0, top: 0, width: "50%", height: "50%" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={WC_LOGO}
            alt="Warrior Comics"
            className="absolute left-1/2 top-1/2 w-[34%] max-w-[260px] -translate-x-1/2 -translate-y-1/2 object-contain opacity-80"
            draggable={false}
          />
          {videoOk && (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={MOTION_VIDEO}
              autoPlay
              muted
              loop
              playsInline
              onError={() => setVideoOk(false)}
            />
          )}
          <span className={`${label} text-nav-right-heading`}>Motion</span>
        </div>

        {/* ---------- 1 · comic notebook (image blooms on hover) ---------- */}
        <div
          ref={(el) => {
            tileRefs.current[1] = el;
          }}
          onPointerEnter={enter}
          className={`${tile} z-[1] bg-accent text-accent-fg`}
          style={{ left: "50%", top: 0, width: "50%", height: "50%" }}
        >
          <div className="absolute inset-0 flex items-end p-6 sm:p-10">
            <p className="font-serif text-[clamp(1.6rem,4vw,3.6rem)] font-semibold uppercase leading-[0.95]">
              Publishing
              <br />
              this week
            </p>
          </div>
          <div className={bloom}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={COMIC_IMG}
              alt="Publishing this week — Comic Note Book"
              draggable={false}
              className="h-full w-full object-cover transition-transform duration-500 group-data-[seen=1]:scale-105"
            />
          </div>
          <span className={`${label} ${reveal ? "group-data-[seen=1]:text-white" : "text-white"}`}>
            Comics
          </span>
        </div>

        {/* ---------- 2 · artist at work (image blooms on hover) ---------- */}
        <div
          ref={(el) => {
            tileRefs.current[2] = el;
          }}
          onPointerEnter={enter}
          className={`${tile} z-[1] bg-nav-left text-nav-left-fg`}
          style={{ left: 0, top: "50%", width: "50%", height: "50%" }}
        >
          <div className="absolute inset-0 flex items-end p-6 sm:p-10">
            <p className="font-serif text-[clamp(1.6rem,4vw,3.6rem)] font-semibold uppercase leading-[0.95]">
              Artists
              <br />
              at work
            </p>
          </div>
          <div className={bloom}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ARTIST_IMG}
              alt="An artist drawing at his desk"
              draggable={false}
              className="h-full w-full object-cover transition-transform duration-500 group-data-[seen=1]:scale-105"
            />
          </div>
          <span className={`${label} ${reveal ? "group-data-[seen=1]:text-white" : "text-white"}`}>
            Artists
          </span>
        </div>

        {/* ---------- 3 · hero card: Enthusiastic Artists ---------- */}
        <div
          ref={(el) => {
            tileRefs.current[3] = el;
          }}
          className={`${tile} z-[3] bg-foreground text-background`}
          style={{ left: "50%", top: "50%", width: "50%", height: "50%" }}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[58%] select-none font-serif text-[clamp(9rem,20vw,19rem)] leading-none text-background/10"
          >
            A
          </span>
          <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
            <h2 className="font-serif uppercase leading-[1.05] tracking-wide">
              <span className="block text-[clamp(1.4rem,3.6vw,3.4rem)] font-semibold">
                Enthusiastic
              </span>
              <span className="block text-[clamp(1.1rem,2.6vw,2.4rem)] font-semibold">
                Artists
              </span>
            </h2>
            <Link
              href="/videos"
              className="group/btn relative mt-8 inline-flex overflow-hidden rounded-full bg-accent px-7 py-3 font-serif text-xs uppercase tracking-[0.2em] text-accent-fg transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              <span className="relative z-10">Watch out</span>
              <span
                aria-hidden
                className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/40 transition-transform duration-700 group-hover/btn:translate-x-[420%]"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}