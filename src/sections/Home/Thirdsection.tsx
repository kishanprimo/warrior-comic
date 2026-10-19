"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAudio } from "@/context/AudioContext";

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */
const BASE = "/images/Imgs";
const COMIC_IMG = "/images/Imgs/comicNoteBook.jpg";
const ARTIST_IMG = `/images/Imgs/warriorartist.jpg`;
const WC_LOGO = `${BASE}/Logo.png`;
const MOTION_VIDEO = "/images/Imgs/warrior-comic-motion-logo.mp4";

const INTRO = "We love to share creative and entertaining stories";
const GAP = 6;

const IMAGES_ON_HOVER = true;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
 

type Rect = { x: number; y: number; w: number; h: number };

// hidden state of each tile before it reveals (video, comic, artist, hero)
const WIPE = [
  "inset(0% 0% 100% 0%)",   // video: wipes down from the top
  "inset(0% 0% 0% 100%)",   // comic: wipes in from the right
  "inset(0% 100% 0% 0%)",   // artist: wipes in from the left
  "inset(50% 50% 50% 50%)", // hero: grows from the centre
];
const WIPE_DELAY = [0.05, 0.2, 0.35, 0.6]; // seconds

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export default function ThirdSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stickyRef = useRef<HTMLDivElement>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [canHover, setCanHover] = useState(true);
  const [videoOk, setVideoOk] = useState(true);
  const { muted, setMuted } = useAudio(); // use global audio state
  const [started, setStarted] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover)").matches);
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  /* Attempt unmuted autoplay. If the browser blocks it (which it will on
     first load with no interaction), unlock audio on the very first user
     gesture anywhere on the page. */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Always muted in ThirdSection - audio is handled by GlobalVideo
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  /* ---- Layout ---- */
  useEffect(() => {
    let lastW = 0;

    const layout = () => {
      const box = stickyRef.current;
      if (!box) return;
      // measure the sticky box (svh-based, stable) instead of window.innerHeight
      const vw = box.clientWidth;
      const vh = box.clientHeight;
      lastW = vw;
      const mobile = vw < 768;
      let rects: Rect[];
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
    };

    // ignore height-only resizes (mobile address bar show/hide)
    const onResize = () => {
      const box = stickyRef.current;
      if (!box || box.clientWidth === lastW) return;
      layout();
    };

    layout();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", layout);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", layout);
    };
  }, []);

  /* ---- Reveal the tiles once the section comes into view ---- */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -30% 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* on enter: remember where the cursor came in, and lock the photo open */
  const enter = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--hx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--hy", `${((e.clientY - r.top) / r.height) * 100}%`);
    el.dataset.seen = "1";
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const tileStyle = (i: number): React.CSSProperties => ({
    clipPath: started ? "inset(0% 0% 0% 0%)" : WIPE[i],
    transform: started ? "scale(1)" : "scale(1.08)",
    transition: reduce
      ? "none"
      : `clip-path 0.9s cubic-bezier(0.77,0,0.175,1) ${WIPE_DELAY[i]}s, transform 1.2s cubic-bezier(0.22,1,0.36,1) ${WIPE_DELAY[i]}s`,
  });

  const reveal = IMAGES_ON_HOVER && canHover;
  const bloom = `absolute inset-0 transition-[clip-path] duration-[220ms] ease-out ${
    reveal
      ? "[clip-path:circle(0%_at_var(--hx,50%)_var(--hy,50%))] group-data-[seen=1]:[clip-path:circle(150%_at_var(--hx,50%)_var(--hy,50%))]"
      : ""
  }`;
  const tile =
    "group absolute overflow-hidden will-change-transform";
  const label =
    "absolute left-5 top-4 z-10 font-serif text-[11px] uppercase tracking-[0.2em] transition-colors duration-500 sm:text-xs";

  return (
    <section
      ref={sectionRef}
      id="artists"
      aria-label="Enthusiastic artists"
      className="relative bg-nav-left text-nav-left-fg transition-colors duration-500"
      style={{
        // 1 viewport of pin time + 1 viewport of actual section height
        height: "calc(200svh - 4rem)",
      }}
    >
      <div
        ref={stickyRef}
        className="sticky top-16 w-full overflow-hidden sm:top-19"
        style={{
          height: "calc(100svh - 4rem)", // mobile nav = 4rem
        }}
      >
        {/* lighter glow in the middle */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_50%,var(--nav-left-band)_0%,transparent_100%)] opacity-80"
        />

        {/* grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-40 [background-image:linear-gradient(var(--nav-left-line)_1px,transparent_1px),linear-gradient(90deg,var(--nav-left-line)_1px,transparent_1px)] [background-size:84px_84px]"
        />

    

        {/* ---------- 0 · motion logo (video) ---------- */}
        <div
          ref={(el) => {
            tileRefs.current[0] = el;
          }}
          style={tileStyle(0)}
          className={`${tile} z-[1] bg-nav-overlay text-nav-right-heading`}
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
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              src={MOTION_VIDEO}
              autoPlay
              muted={true}
              loop
              playsInline
              preload="auto"
              onError={() => setVideoOk(false)}
            />
          )}

          {/* Custom mute / unmute button - controls global audio */}
          {videoOk && (
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "Unmute video" : "Mute video"}
              aria-pressed={!muted}
              className="absolute right-4 top-4 z-20 grid size-10 cursor-pointer place-items-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-black/60 hover:opacity-90 active:scale-95 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
            >
              {muted ? (
                <svg
                  viewBox="0 0 24 24"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M11 5L6 9H3v6h3l5 4V5z" />
                  <path d="M22 9l-6 6M16 9l6 6" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M11 5L6 9H3v6h3l5 4V5z" />
                  <path d="M15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13" />
                </svg>
              )}
            </button>
          )}

 
          <span className={`${label} text-nav-right-heading`}>Motion</span>
        </div>

        {/* ---------- 1 · comic notebook ---------- */}
        <div
          ref={(el) => {
            tileRefs.current[1] = el;
          }}
          onPointerEnter={enter}
          style={tileStyle(1)}
          className={`${tile} z-[1] bg-accent text-accent-fg`}
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

        {/* ---------- 2 · artist at work ---------- */}
        <div
          ref={(el) => {
            tileRefs.current[2] = el;
          }}
          onPointerEnter={enter}
          style={tileStyle(2)}
          className={`${tile} z-[1] bg-nav-left text-nav-left-fg`}
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

        {/* ---------- 3 · hero card ---------- */}
        <div
          ref={(el) => {
            tileRefs.current[3] = el;
          }}
          style={tileStyle(3)}
          className={`${tile} z-[3] bg-foreground text-background`}
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