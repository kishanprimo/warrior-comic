"use client";

import React, { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* Content (taken from warriorcomics.com)                             */
/* ------------------------------------------------------------------ */

const HEADING = "How We Do This";

const VIDEO = {
  src: "https://www.youtube.com/embed/qAjLLApkMt4?rel=0&modestbranding=1",
  title: "Empowering Young Artists – Outdoor Art Workshop by Warrior Comics",
  href: "https://www.youtube.com/@WarriorComics",
};

// The two slides that sit next to the video on the original site
const SLIDES = ["/images/Imgs/1.jpg", "/images/Imgs/2.jpg"];
// Real blog posts from the site
const STORIES = [
  {
    title: "Monetize your comic art globally",
    text: "When we talk about creativity, there is the huge pile of genres besides us from music to art gallery to ongoing innovations! There is one more bold lesson in creative art - WebComics.",
    href: "https://www.reddit.com/r/comics/comments/a5gre1/monetize_your_art_globally/",
  },
  {
    title: "A way out in this illegal internet world",
    text: "Reading newspaper is really frustrating when one encounters continuous ongoing illegal internet frauds in every industry. Fake banking site, lottery scam, fake....",
    href: "https://www.reddit.com/user/WarriorComics/comments/a5gmri/finally_someone_comes_up_with_end_of_piracy/",
  },
  {
    title: "Finally, someone comes up with end of piracy!",
    text: "Illegal hosting of content is no doubt a massive problem in this internet world. Even many creators consider this to be inevitable. However, web comic's communities....",
    href: "https://www.reddit.com/user/WarriorComics/comments/a5gmri/finally_someone_comes_up_with_end_of_piracy/",
  },
];

const MARQUEE = "Let's create another world · WC-Universe · Warrior Comics · ";

/* scroll timeline (0..1) */
const MOVE: [number, number] = [0.14, 0.5]; // video shrinks + slides left
// [start, end] of each right-side block: slider, story 1-3, CTA
const REVEAL: [number, number][] = [
  [0.4, 0.56],
  [0.52, 0.66],
  [0.62, 0.76],
  [0.72, 0.86],
  [0.82, 0.96],
];
const FILM_SECONDS = 204;

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const pad = (n: number) => String(n).padStart(2, "0");

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */
export default function HowWeDo() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const perfRefs = useRef<(HTMLDivElement | null)[]>([]);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [mounted, setMounted] = useState(false);
  const [slide, setSlide] = useState(0);

  /* heading entrance */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setMounted(true);
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* slideshow on the right */
  useEffect(() => {
    const t = window.setInterval(
      () => setSlide((s) => (s + 1) % SLIDES.length),
      3500
    );
    return () => clearInterval(t);
  }, []);

  /* ---------- scroll-linked animation (smoothed with lerp) ---------- */
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let cur = 0;
    let target = 0;
    let last = -1;
    // start pose of the video, relative to its final (left column) pose
    let geo = { dx: 0, dy: 0, s: 1 };

    /* measure the final layout, then work out where "centered + big" is */
    const layout = () => {
      const main = mainRef.current;
      const frame = frameRef.current;
      if (!main || !frame) return;
      const prev = frame.style.transform;
      frame.style.transform = "none";
      const m = main.getBoundingClientRect();
      const f = frame.getBoundingClientRect();
      frame.style.transform = prev;

      const maxW = Math.min(m.width * 0.94, 1040);
      const s = Math.max(1, Math.min(maxW / f.width, (m.height * 0.98) / f.height));
      const w = f.width * s;
      const h = f.height * s;
      const left = m.left + (m.width - w) / 2;
      const top = m.top + (m.height - h) / 2;
      geo = { dx: left - f.left, dy: top - f.top, s };
      last = -1;
    };

    const readScroll = () => {
      const sec = sectionRef.current;
      const stage = stageRef.current;
      if (!sec || !stage) return;
      const r = sec.getBoundingClientRect();
      const total = r.height - stage.clientHeight;
      target = total > 0 ? clamp(-r.top / total) : 0;
    };

    const apply = (p: number) => {
      /* video: big + centered → smaller + left */
      const e = easeInOut(seg(p, MOVE[0], MOVE[1]));
      const inv = 1 - e;
      if (frameRef.current) {
        frameRef.current.style.transform = `translate3d(${geo.dx * inv}px, ${
          geo.dy * inv
        }px, 0) scale(${1 + (geo.s - 1) * inv})`;
      }

      /* background marquee drift */
      if (markRef.current) {
        markRef.current.style.transform = `translate3d(${-p * 30}%, 0, 0)`;
      }

      /* film perforations roll */
      perfRefs.current.forEach((el) => {
        if (el) el.style.backgroundPositionY = `${-p * 1200}px`;
      });

      /* timecode */
      if (tcRef.current) {
        const t = p * FILM_SECONDS;
        tcRef.current.textContent = `${pad(Math.floor(t / 60))}:${pad(
          Math.floor(t % 60)
        )}:${pad(Math.floor((t * 24) % 24))}`;
      }

      /* right-side content flies in one block at a time */
      blockRefs.current.forEach((el, i) => {
        if (!el) return;
        const [a, b] = REVEAL[i];
        const k = easeInOut(seg(p, a, b));
        el.style.opacity = String(k);
        el.style.transform = `translate3d(${(1 - k) * 70}px, 0, 0)`;
        el.style.pointerEvents = k > 0.5 ? "auto" : "none";
      });

      if (hintRef.current) {
        hintRef.current.style.opacity = String(1 - seg(p, 0, 0.08));
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
    apply(cur);
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", onResize);
    // fonts / images can shift the layout a moment after mount
    const t = window.setTimeout(onResize, 400);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const perfStyle: React.CSSProperties = {
    backgroundColor: "var(--nav-overlay-bg)",
    backgroundImage:
      "repeating-linear-gradient(to bottom, var(--nav-left-bg) 0 10px, transparent 10px 24px)",
    backgroundSize: "8px 24px",
    backgroundRepeat: "repeat-y",
    backgroundPositionX: "center",
  };

  const setBlock = (i: number) => (el: HTMLDivElement | null) => {
    blockRefs.current[i] = el;
  };

/* ---------------------------------------------------------------- */
  return (
    <section
      ref={sectionRef}
      id="how-we-do"
      aria-label="How we do this"
      className="relative h-[300vh] bg-nav-left text-nav-left-fg transition-colors duration-500 font-sans"
    >
      <div
        ref={stageRef}
        className="sticky top-16 sm:top-19 h-[calc(100svh-4rem)] sm:h-[calc(100svh-4.75rem)] w-full overflow-hidden"
      >
        {/* lighter glow in the middle (same as third section) */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_50%,var(--nav-left-band)_0%,transparent_100%)] opacity-80"
        />

        {/* grid (same as third section) */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-40 [background-image:linear-gradient(var(--nav-left-line)_1px,transparent_1px),linear-gradient(90deg,var(--nav-left-line)_1px,transparent_1px)] [background-size:84px_84px]"
        />

        {/* outlined marquee text */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-[3%] select-none overflow-hidden"
        >
          <div
            ref={markRef}
            className="w-max whitespace-nowrap font-serif text-[clamp(4rem,12vw,10rem)] font-bold uppercase leading-none text-transparent opacity-20 sm:opacity-40 [-webkit-text-stroke:1px_var(--nav-left-line)]"
          >
            {MARQUEE.repeat(4)}
          </div>
        </div>

        {/* ---------- content ---------- */}
        <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col px-4 py-3 sm:px-6 sm:py-5 lg:px-10 lg:py-6">
          {/* Heading */}
          <header
            className={`relative shrink-0 text-center transition-[opacity,transform] duration-[800ms] ease ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-[24px] opacity-0"
            }`}
          >
            {/* giant C watermark (as on the site) */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-serif text-[6rem] leading-none text-nav-left-fg/10 sm:text-[9rem]"
            >
              C
            </span>

            <h2 className="relative m-0 font-serif text-2xl font-bold uppercase leading-tight tracking-[0.12em] sm:text-4xl lg:text-5xl">
              {HEADING}
            </h2>
          </header>

          {/* Main area: video (left column) + content (right column) */}
          <div
            ref={mainRef}
            className="mt-2 grid min-h-0 flex-1 grid-cols-1 grid-rows-[auto_minmax(0,1fr)] items-center gap-2 sm:mt-4 sm:gap-3 lg:grid-cols-12 lg:grid-rows-[minmax(0,1fr)] lg:gap-10"
          >
            {/* ===== LEFT: cinema frame ===== */}
            <div className="relative z-20 lg:col-span-7">
              <div
                ref={frameRef}
                className="relative mx-auto w-full max-w-[760px] [transform-origin:0_0] will-change-transform"
              >
                {/* pulsing glow behind the frame */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[90%] w-[90%] rounded-full wc-glow-pulse bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--accent)_45%,transparent),transparent_70%)]"
                />

                {/* film perforations (desktop) — style applied via JS because it's a shared `perfStyle` object */}
                <div
                  ref={(el) => {
                    perfRefs.current[0] = el;
                  }}
                  aria-hidden
                  className="absolute -left-5 top-3 bottom-3 hidden w-3.5 rounded-sm md:block"
                  style={perfStyle}
                />
                <div
                  ref={(el) => {
                    perfRefs.current[1] = el;
                  }}
                  aria-hidden
                  className="absolute -right-5 top-3 bottom-3 hidden w-3.5 rounded-sm md:block"
                  style={perfStyle}
                />

                <div className="relative overflow-hidden border border-nav-left-fg/25 bg-black shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)]">
                  {/* accent corner brackets */}
                  {[
                    "left-1.5 top-1.5 border-l-2 border-t-2",
                    "right-1.5 top-1.5 border-r-2 border-t-2",
                    "left-1.5 bottom-1.5 border-l-2 border-b-2",
                    "right-1.5 bottom-1.5 border-r-2 border-b-2",
                  ].map((c) => (
                    <span
                      key={c}
                      aria-hidden
                      className={`pointer-events-none absolute z-20 h-4 w-4 border-accent ${c}`}
                    />
                  ))}

                  {/* top strip */}
                  <div className="flex items-center justify-between bg-nav-overlay px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                      Rec · WC-Cam 01
                    </span>
                    <span
                      ref={tcRef}
                      className="font-mono tracking-[0.15em] text-accent"
                    >
                      00:00:00
                    </span>
                  </div>

                  {/* video */}
                  <div className="relative aspect-video w-full bg-black">
                    <iframe
                      className="absolute inset-0 h-full w-full border-0"
                      src={VIDEO.src}
                      title={VIDEO.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>

                  {/* bottom strip */}
                  <div className="flex items-center justify-between gap-3 bg-nav-overlay px-4 py-2">
                    <p className="m-0 truncate text-[10px] font-medium uppercase tracking-[0.15em] text-white/70">
                      Official Showcase
                    </p>
                    <a
                      href={VIDEO.href}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 text-[10px] font-bold uppercase tracking-[0.18em] text-white no-underline transition-colors hover:text-accent"
                    >
                      Watch on YouTube →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== RIGHT: content that arrives on scroll ===== */}
            <div className="relative z-10 flex h-full min-h-0 flex-col gap-2 sm:gap-3 lg:col-span-5 lg:self-stretch">
              {/* slideshow (the two slides from the site) — opacity animated by JS scroll timeline */}
              <div
                ref={setBlock(0)}
                className="relative min-h-[48px] w-full flex-[1.3] overflow-hidden rounded-xl border border-nav-left-line bg-nav-overlay shadow-lg will-change-transform max-sm:hidden"
                style={{ opacity: 0 }}
              >
                {SLIDES.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={src}
                    src={src}
                    alt={`Warrior Comics slide ${i + 1}`}
                    draggable={false}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                      i === slide ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-nav-overlay/70 to-transparent"
                />
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
                  {SLIDES.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Show slide ${i + 1}`}
                      onClick={() => setSlide(i)}
                      className={`h-[3px] cursor-pointer rounded-full border-none p-0 transition-all duration-300 ${
                        i === slide ? "w-8 bg-white" : "w-5 bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* stories from the blog — opacity animated by JS scroll timeline */}
              {STORIES.map((s, i) => (
                <div
                  key={s.title}
                  ref={setBlock(i + 1)}
                  className="min-h-0 flex-1 will-change-transform"
                  style={{ opacity: 0 }}
                >
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative flex h-full flex-col justify-center overflow-hidden rounded-xl border border-nav-left-line bg-nav-overlay/30 px-3 py-1.5 text-inherit no-underline backdrop-blur-sm transition-all duration-300 hover:border-accent/70 hover:bg-nav-overlay/55 sm:px-4 sm:py-2"
                  >
                    <span
                      aria-hidden
                      className="absolute bottom-0 left-0 top-0 w-1 origin-top scale-y-0 bg-accent transition-transform duration-300 group-hover:scale-y-100"
                    />
                    <h3 className="m-0 line-clamp-2 font-serif text-[11px] font-bold uppercase leading-snug tracking-[0.08em] sm:text-sm lg:text-[15px]">
                      {s.title}
                    </h3>
                    <p className="mb-0 mt-1 line-clamp-2 text-[13px] leading-relaxed text-nav-left-fg/85 max-sm:hidden [@media(max-height:700px)]:hidden">
                      {s.text}
                    </p>
                    <span className="mt-1.5 inline-block text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                      Read more →
                    </span>
                  </a>
                </div>
              ))}

              {/* CTA — opacity animated by JS scroll timeline */}
              <div
                ref={setBlock(4)}
                className="flex shrink-0 flex-wrap items-center gap-3 will-change-transform"
                style={{ opacity: 0 }}
              >
                <a
                  href="mailto:info@warriorcomics.com"
                  className="group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-accent px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-accent-fg no-underline shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95"
                >
                  <span className="relative z-10">Get in touch</span>
                  <span aria-hidden className="relative z-10">
                    →
                  </span>
                  <span
                    aria-hidden
                    className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/40 transition-transform duration-700 group-hover/btn:translate-x-[420%]"
                  />
                </a>
                <span className="hidden text-[10px] uppercase tracking-[0.15em] text-nav-left-fg/70 sm:inline sm:text-[11px]">
                  We&rsquo;d love to hear about your project.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* scroll hint */}
        <div
          ref={hintRef}
          className="pointer-events-none absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-[9px] font-bold uppercase tracking-[0.3em] text-nav-left-fg/70"
        >
          Scroll
          <span className="h-5 w-px animate-pulse bg-accent" />
        </div>
      </div>
    </section>
  );
}