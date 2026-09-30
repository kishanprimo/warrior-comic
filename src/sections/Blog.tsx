"use client";

import React, { useEffect, useRef, useState } from "react";

const BASE = "http://warriorcomics.com/Content/Images";
const HEADING = "Let's blog";
const SUB = "We love to share creative and entertaining stories";

type Post = { img: string; title: string; href: string };

const POSTS: Post[] = [
  {
    img: `${BASE}/blog-1.jpg`,
    title: "Finally, someone comes up with end of piracy!",
    href: "https://www.reddit.com/user/WarriorComics/comments/a5gmri/finally_someone_comes_up_with_end_of_piracy/",
  },
  {
    img: `${BASE}/blog-2.jpg`,
    title: "Warrior Comics is a way out in this illegal internet world",
    href: "https://www.reddit.com/user/WarriorComics/comments/a5gmri/finally_someone_comes_up_with_end_of_piracy/",
  },
  {
    img: `${BASE}/blog-3.jpg`,
    title: "Monetize your comic art globally",
    href: "https://www.reddit.com/r/comics/comments/a5gre1/monetize_your_art_globally/",
  },
  {
    img: `${BASE}/blog-4.jpg`,
    title: "Join us at old age home next Sunday",
    href: "https://www.reddit.com/r/comics/comments/a5gre1/monetize_your_art_globally/",
  },
];

const N = POSTS.length;
const THETA = 38;
const SLICES = 24;
const ASPECT = 0.68;
const RAD = 180 / Math.PI;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

// Wrap index into 0..N-1 (handles negatives / large values)
const wrap = (i: number) => ((i % N) + N) % N;

// Shortest signed circular distance from b to a, in [-N/2, N/2)
const circDist = (a: number, b: number) => {
  let d = (((a - b) % N) + N) % N;
  if (d >= N / 2) d -= N;
  return d;
};

export default function Blog() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const floorRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const activeRef = useRef(0);
  const visibleRef = useRef(false);
  const pausedRef = useRef(false);
  const userInteractedRef = useRef(false);
  const targetRef = useRef(0); // unbounded, keeps counting up -> seamless loop
  const virtualRef = useRef(0); // eased value chasing targetRef
  const swipeStartRef = useRef<number | null>(null);

  const [active, setActive] = useState(0);
  const [ringState, setRingState] = useState({ mode: "idle", inside: false });
  const [hovered, setHovered] = useState<number | null>(null);

  /* ---------- navigation (shortest circular path, never snaps back) ---------- */
  const goTo = (i: number, userClick = true) => {
    if (userClick) {
      userInteractedRef.current = true;
      window.setTimeout(() => {
        userInteractedRef.current = false;
      }, 6000);
    }
    const cur = targetRef.current;
    targetRef.current = cur + circDist(wrap(i), cur);
  };

  const step = (dir: 1 | -1, userClick = true) => {
    if (userClick) {
      userInteractedRef.current = true;
      window.setTimeout(() => {
        userInteractedRef.current = false;
      }, 6000);
    }
    targetRef.current = Math.round(targetRef.current) + dir;
  };

  const onCardClick = (i: number, href: string) => {
    if (i !== activeRef.current) goTo(i, true);
    else window.open(href, "_blank", "noopener,noreferrer");
  };

  /* ---------- main effect ---------- */
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    let raf = 0;
    let cw = 420;
    let ch = 285;
    let R = 750;

    let mx = -100,
      my = -100,
      rx = -100,
      ry = -100;

    /* ---------- layout (based on stage size, not window height) ---------- */
    const layout = () => {
      const vw = window.innerWidth;
      const sh = stageRef.current?.clientHeight ?? window.innerHeight * 0.8;
      cw = clamp(Math.min(vw * 0.42, (sh * 0.5) / ASPECT), 200, 480);
      ch = cw * ASPECT;
      R = cw * 1.6;

      if (wallRef.current) wallRef.current.style.transform = `translateZ(${R}px)`;

      const sw = cw / SLICES;
      const place = (x: number, lift: number) => {
        const a = x / R;
        return `translate3d(${R * Math.sin(a)}px, 0, ${
          R * (1 - Math.cos(a)) + lift
        }px) rotateY(${-a * RAD}deg)`;
      };

      cardRefs.current.forEach((el) => {
        if (!el) return;
        el.style.width = `${cw}px`;
        el.style.height = `${ch}px`;
        el.style.marginLeft = `${-cw / 2}px`;
        el.style.marginTop = `${-ch / 2}px`;

        el.querySelectorAll<HTMLElement>(".wb-slice").forEach((sl, k) => {
          const x = (k + 0.5 - SLICES / 2) * sw;
          sl.style.width = `${sw + 1.5}px`;
          sl.style.height = `${ch}px`;
          sl.style.marginLeft = `${-(sw + 1.5) / 2}px`;
          sl.style.marginTop = `${-ch / 2}px`;
          sl.style.backgroundSize = `${cw}px ${ch}px`;
          sl.style.backgroundPosition = `${-k * sw}px 0`;
          sl.style.transform = place(x, 0);
        });

        const tag = el.querySelector<HTMLElement>(".wb-tag");
        if (tag) {
          const tw = cw * 0.5;
          tag.style.width = `${tw}px`;
          tag.style.marginLeft = `${-tw / 2}px`;
          tag.style.transform = place(-cw / 2 + cw * 0.05 + tw / 2, 12);
        }
      });
    };

    /* ---------- apply: circular placement from continuous index ---------- */
    const apply = () => {
      virtualRef.current += (targetRef.current - virtualRef.current) * 0.08;
      const v = virtualRef.current;

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = circDist(i, v);
        const ad = Math.abs(d);
        const dim = 1 - 0.65 * Math.min(1, ad);

        el.style.transform = `rotateY(${-d * THETA}deg) translateZ(${-R}px)`;
        el.style.filter = `brightness(${dim.toFixed(3)})`;
        el.style.visibility = ad > 1.8 ? "hidden" : "visible";
        el.dataset.active = ad < 0.4 ? "true" : "false";
      });

      if (floorRef.current)
        floorRef.current.style.backgroundPosition = `${-v * cw * 0.8}px 0`;

      const idx = wrap(Math.round(v));
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
    };

    /* ---------- pointer ---------- */
    const onMove = (e: PointerEvent) => {
      if (!fine) return;
      mx = e.clientX;
      my = e.clientY;
      const t = e.target as Element | null;
      const insideStage = !!t?.closest?.("[data-stage]");
      const card = t?.closest?.("[data-card]") as HTMLElement | null;

      let nextMode = "idle";
      if (card) {
        const idx = Number(card.dataset.card);
        nextMode = idx === activeRef.current ? "open" : "view";
        setHovered(idx);
      } else {
        setHovered(null);
      }
      if (t?.closest?.("button,a")) nextMode = "hot";

      setRingState({ mode: nextMode, inside: insideStage });
    };

    /* ---------- loop ---------- */
    const tick = () => {
      apply();
      const ring = ringRef.current;
      const dot = dotRef.current;
      if (fine && ring) {
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
        if (dot) {
          dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    /* ---------- autoplay: only while visible, never snaps back ---------- */
    const auto = window.setInterval(() => {
      if (!visibleRef.current || pausedRef.current || userInteractedRef.current) return;
      step(1, false);
    }, 3800);

    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.35 }
    );
    if (sectionRef.current) io.observe(sectionRef.current);

    layout();
    window.addEventListener("resize", layout);
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(auto);
      io.disconnect();
      window.removeEventListener("resize", layout);
      window.removeEventListener("pointermove", onMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- swipe ---------- */
  const onPointerDown = (e: React.PointerEvent) => {
    swipeStartRef.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (swipeStartRef.current === null) return;
    const dx = e.clientX - swipeStartRef.current;
    swipeStartRef.current = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1, true);
  };

  /* ---------- cursor styles ---------- */
  const getRingStyles = () => {
    let size = "w-10 h-10 border-foreground/50 bg-foreground/5";
    if (ringState.mode === "open") size = "w-[64px] h-[64px] bg-accent/25 border-accent";
    else if (ringState.mode === "hot") size = "w-6 h-6 bg-accent border-accent";
    else if (ringState.mode === "view") size = "w-12 h-12 border-accent/80 bg-accent/10";
    return `${size} ${ringState.inside ? "opacity-100" : "opacity-0"}`;
  };

  const getDotStyles = () => {
    let base = "w-1.5 h-1.5 bg-foreground/70 border-transparent";
    if (ringState.mode === "open") base = "w-2 h-2 bg-accent border-transparent";
    if (ringState.mode === "hot") base = "w-1.5 h-1.5 bg-accent-fg border-transparent";
    return `${base} ${ringState.inside ? "opacity-100" : "opacity-0"}`;
  };

  return (
    <section
      ref={sectionRef}
      id="blog"
      className="relative bg-background text-foreground font-sans"
    >
      <div
        ref={stageRef}
        data-stage
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
        className="relative w-full overflow-hidden flex flex-col items-center px-6 pt-8 pb-20 md:px-10 md:pt-10 md:pb-24"
        style={{ height: "clamp(520px, 80vh, 720px)" }}
      >
        {/* Stars */}
        <div aria-hidden className="absolute -inset-6 pointer-events-none wc-stars wc-star-drift" />

        {/* Pulsing glow */}
        <div
          aria-hidden
          className="absolute left-1/2 top-[45%] w-[70vmin] h-[70vmin] rounded-full pointer-events-none wc-glow-pulse"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--accent) 22%, transparent) 0%, transparent 65%)",
          }}
        />

        {/* Spinning rings */}
        <div
          aria-hidden
          className="absolute left-1/2 top-[45%] w-[60vmin] h-[60vmin] rounded-full border border-dashed border-foreground/15 pointer-events-none wc-spin-slow"
        />
        <div
          aria-hidden
          className="absolute left-1/2 top-[45%] w-[80vmin] h-[80vmin] rounded-full border border-accent/25 pointer-events-none wc-spin-slow-reverse"
        />

        {/* Vignette */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle, transparent 55%, var(--background) 100%)" }}
        />

        {/* Perspective Floor */}
        <div
          aria-hidden
          className="absolute bottom-0 w-full h-[40%] pointer-events-none"
          style={{ perspective: "600px" }}
        >
          <div
            ref={floorRef}
            className="w-[200%] h-full -ml-[50%] origin-[50%_100%]"
            style={{
              transform: "rotateX(80deg)",
              backgroundImage:
                "linear-gradient(to right, color-mix(in srgb, var(--foreground) 10%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--foreground) 10%, transparent) 1px, transparent 1px)",
              backgroundSize: "60px 40px",
            }}
          />
        </div>

        {/* Heading — tight to content */}
        <header className="relative z-10 text-center pointer-events-none">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight m-0 text-foreground leading-tight">
            {HEADING}
          </h2>
          <p className="text-xs md:text-sm text-foreground/60 mt-1 mb-0">{SUB}</p>
        </header>

        {/* 3D Wall */}
        <div
          className="relative flex-1 w-full flex items-center justify-center min-h-0"
          style={{ perspective: "1200px" }}
        >
          <div
            ref={wallRef}
            className="absolute"
            style={{ transformStyle: "preserve-3d" }}
          >
            {POSTS.map((p, i) => (
              <article
                key={p.title}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                data-card={i}
                role="button"
                tabIndex={0}
                aria-label={p.title}
                onClick={() => onCardClick(i, p.href)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onCardClick(i, p.href);
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="absolute top-1/2 left-1/2 cursor-pointer group"
                style={{
                  transformStyle: "preserve-3d",
                  transition: "filter 0.3s ease",
                  borderRadius: "12px",
                  boxShadow: "0 18px 40px -10px rgba(0,0,0,0.45)",
                  outline:
                    hovered === i
                      ? "2px solid color-mix(in srgb, var(--accent) 70%, transparent)"
                      : "none",
                  outlineOffset: "2px",
                }}
              >
                {Array.from({ length: SLICES }, (_, k) => (
                  <span
                    key={k}
                    aria-hidden
                    className="wb-slice absolute top-1/2 left-1/2 bg-no-repeat"
                    style={{
                      backgroundImage: `url("${p.img}")`,
                      backfaceVisibility: "hidden",
                      borderRadius: "8px",
                    }}
                  />
                ))}
                <div
                  className="absolute inset-0 pointer-events-none z-[2] rounded-lg"
                  style={{
                    background:
                      "linear-gradient(to top, color-mix(in srgb, var(--nav-overlay-bg) 92%, transparent) 0%, transparent 60%)",
                  }}
                />
                <h3 className="wb-tag absolute bottom-5 left-1/2 z-[3] m-0 text-left font-medium leading-snug text-white pointer-events-none">
                  {p.title}
                </h3>
              </article>
            ))}
          </div>
        </div>

       

        <div className="absolute bottom-5 md:bottom-7 flex items-center gap-1.5 p-1.5 bg-foreground/10 backdrop-blur-md rounded-full border border-foreground/20 z-10 shadow-sm">
          <span className="px-3.5 py-2 text-xs font-bold text-foreground">WC.</span>
          <button
            type="button"
            onClick={() => step(1, true)}
            className="bg-accent text-accent-fg border-none px-5 py-2 rounded-full text-xs font-semibold cursor-pointer transition-transform duration-200 hover:brightness-110 hover:scale-105"
          >
            Next story
          </button>
        </div>

        {/* Cursor */}
        <div
          ref={ringRef}
          aria-hidden
          className={`fixed top-0 left-0 border-2 rounded-full pointer-events-none z-[9999] transition-all duration-200 ease-out ${getRingStyles()}`}
          style={{
            boxShadow:
              ringState.mode === "open"
                ? "0 0 20px color-mix(in srgb, var(--accent) 50%, transparent)"
                : "0 0 12px color-mix(in srgb, var(--foreground) 15%, transparent)",
          }}
        />
        <div
          ref={dotRef}
          aria-hidden
          className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9999] transition-all duration-150 ease-out ${getDotStyles()}`}
        />
      </div>
    </section>
  );
}