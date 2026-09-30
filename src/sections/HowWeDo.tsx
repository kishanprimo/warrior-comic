"use client";

import React, { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* Content                                                            */
/* ------------------------------------------------------------------ */
const HEADING = "How we do this";
const SUB = "Behind every panel, every frame, every story — the craft.";

const VIDEO = {
  src: "https://www.youtube.com/embed/dQw4w9WgXcQ", // replace with your embed URL
  title: "Empowering Young Artists – Outdoor Art Workshop by Warrior Comics",
  channel: "Warrior Comics",
  href: "https://www.youtube.com/@WarriorComics",
};

const STEPS = [
  {
    n: "01",
    title: "Idea & Script",
    text: "Every great panel starts as a scribble. We shape characters, arcs and dialogue until the story earns its place on the page.",
    kanji: "着想",
  },
  {
    n: "02",
    title: "Sketch & Ink",
    text: "Pencils become ink, ink becomes motion. Our artists push contrast and rhythm so each frame hits with weight.",
    kanji: "線画",
  },
  {
    n: "03",
    title: "Color & VFX",
    text: "Light, mood and magic — layered digitally to give the WC-Universe its signature cinematic glow.",
    kanji: "彩色",
  },
  {
    n: "04",
    title: "Publish & Share",
    text: "From print to screen, we ship to readers worldwide and keep the community part of the journey.",
    kanji: "公開",
  },
];

export default function HowWeDo() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  /* Entrance animation when section scrolls into view */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setMounted(true);
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Auto-cycle the step highlight */
  useEffect(() => {
    const t = window.setInterval(() => {
      setActiveStep((i) => (i + 1) % STEPS.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-we-do"
      className="relative w-full overflow-hidden bg-background text-foreground font-sans py-20 md:py-32 transition-colors duration-500"
    >
      {/* Soft background ambient accent glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--accent) 60%, transparent), transparent 70%)",
        }}
      />

      {/* Faint technical grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ---------- Header Section ---------- */}
        <div
          className="relative mx-auto mb-12 flex max-w-2xl flex-col items-center text-center md:mb-20"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          {/* Status Badge */}
          <div className="mb-5 flex items-center gap-2 rounded-full border border-foreground/15 bg-foreground/[0.03] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/80 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Creative Process
          </div>

          <h2 className="m-0 font-serif text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-[0.12em] leading-tight text-foreground">
            {HEADING}
          </h2>

          <p className="mt-4 max-w-lg text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-foreground/60 leading-relaxed">
            {SUB}
          </p>

          <div className="mt-6 flex items-center gap-2">
            <span className="h-px w-8 bg-foreground/20" />
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="h-px w-8 bg-foreground/20" />
          </div>
        </div>

        {/* ---------- Main Interactive Grid ---------- */}
        {/* lg:items-start keeps the left column pinned to top without stretching/jerking */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          
          {/* ============ LEFT: Embedded Video Frame (5 cols - Sticky to top) ============ */}
          <div
            className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col gap-4 self-start"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(28px)",
              transition: "opacity 0.9s ease 0.15s, transform 0.9s ease 0.15s",
            }}
          >
            <div className="group relative overflow-hidden rounded-2xl border border-foreground/15 bg-black/95 shadow-2xl transition-all duration-300 hover:border-foreground/30">
              {/* Floating top status bar */}
              <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/90 via-black/50 to-transparent px-4 py-3 backdrop-blur-[2px]">
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent text-[9px] font-black tracking-tighter text-accent-fg">
                    WC
                  </span>
                  <p className="m-0 truncate text-xs font-semibold text-white/90">
                    {VIDEO.channel}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                  Featured
                </span>
              </div>

              {/* Responsive 16:9 Aspect Video Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-black/80">
                <iframe
                  className="absolute inset-0 h-full w-full border-0"
                  src={VIDEO.src}
                  title={VIDEO.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>

              {/* Video Title Footer */}
              <div className="border-t border-white/10 bg-black/80 p-4 backdrop-blur-sm">
                <p className="m-0 text-xs font-medium leading-relaxed text-white/85 line-clamp-2">
                  {VIDEO.title}
                </p>
              </div>
            </div>

            {/* Video Footer Info Bar */}
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/50">
                Official Showcase
              </span>
              <a
                href={VIDEO.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-foreground transition-all hover:text-accent hover:underline decoration-accent decoration-2 underline-offset-4"
              >
                Watch on YouTube
                <svg
                  className="h-3 w-3 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
              </a>
            </div>
          </div>

          {/* ============ RIGHT: Interactive Process Steps (7 cols) ============ */}
          <div
            className="lg:col-span-7 flex flex-col justify-start min-h-[420px]"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(28px)",
              transition: "opacity 0.9s ease 0.25s, transform 0.9s ease 0.25s",
            }}
          >
            <div className="space-y-3">
              {STEPS.map((s, i) => {
                const isActive = i === activeStep;
                return (
                  <div
                    key={s.n}
                    onClick={() => setActiveStep(i)}
                    onMouseEnter={() => setActiveStep(i)}
                    onFocus={() => setActiveStep(i)}
                    tabIndex={0}
                    role="button"
                    aria-expanded={isActive}
                    className={`group relative overflow-hidden rounded-xl border transition-all duration-300 outline-none cursor-pointer ${
                      isActive
                        ? "border-foreground/30 bg-foreground/[0.04] shadow-lg"
                        : "border-foreground/10 bg-transparent hover:border-foreground/20 hover:bg-foreground/[0.01]"
                    }`}
                  >
                    {/* Active Step Accent Indicator */}
                    <div
                      aria-hidden
                      className={`absolute left-0 top-0 bottom-0 w-1 bg-accent transition-transform duration-300 ease-out origin-top ${
                        isActive ? "scale-y-100" : "scale-y-0"
                      }`}
                    />

                    <div className="p-4 sm:p-5">
                      {/* Step Header Row */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <span
                            className={`font-serif text-lg sm:text-xl font-bold tracking-tight transition-colors duration-300 ${
                              isActive ? "text-accent" : "text-foreground/40"
                            }`}
                          >
                            {s.n}
                          </span>
                          <h3 className="m-0 font-serif text-base sm:text-lg font-bold uppercase tracking-[0.14em] text-foreground truncate">
                            {s.title}
                          </h3>
                        </div>

                        {/* Kanji Badge */}
                        <div className="flex items-center gap-3">
                          <span
                            className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border font-serif text-xs font-semibold transition-all duration-300 ${
                              isActive
                                ? "border-foreground bg-foreground text-background shadow-md"
                                : "border-foreground/15 bg-transparent text-foreground/60"
                            }`}
                          >
                            {s.kanji}
                          </span>
                        </div>
                      </div>

                      {/* Smooth CSS Grid Expand/Collapse without impacting side layout */}
                      <div
                        className={`grid transition-all duration-300 ease-in-out ${
                          isActive
                            ? "grid-rows-[1fr] opacity-100 mt-3"
                            : "grid-rows-[0fr] opacity-0 mt-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="m-0 text-xs sm:text-sm leading-relaxed text-foreground/75 font-normal pl-7 sm:pl-9">
                            {s.text}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Auto-cycle step progress bar */}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground/10">
                        <div
                          className="h-full bg-accent transition-all ease-linear"
                          style={{
                            width: isActive ? "100%" : "0%",
                            transitionDuration: isActive ? "4000ms" : "0ms",
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ---------- Bottom CTA Strip ---------- */}
        <div
          className="mt-12  flex flex-col sm:flex-row items-center justify-between gap-5 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-6 backdrop-blur-md"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 1s ease 0.4s, transform 1s ease 0.4s",
          }}
        >
          <div className="text-center sm:text-left ">
            <h4 className="m-0 font-serif text-sm font-bold uppercase tracking-[0.16em] text-foreground">
              Ready to create together?
            </h4>
            <p className="mt-1 m-0 text-xs uppercase tracking-[0.18em] text-foreground/60">
              Want to collaborate or feature your art?
            </p>
          </div>

          <a
            href="mailto:info@warriorcomics.com"
            className="group inline-flex items-center gap-2.5 rounded-full bg-accent px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-accent-fg shadow-lg transition-all duration-300 hover:opacity-90 hover:shadow-xl hover:scale-[1.02] shrink-0"
          >
            Get in touch
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}