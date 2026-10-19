"use client";

import React, { useEffect, useState } from "react";

interface LoaderProps {
  onComplete?: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  // Phase 1: 'cream' (Light canvas, animated lines + circled Kanji)
  // Phase 2: 'black-transition' (Dark canvas wipes out from the center line)
  // Phase 3: 'title-reveal' (Outlined headline rises from bottom-left, then fills)
  // Phase 4: 'complete' (Unmounts loader)
  // All colors come from src/app/colors.css and follow the dark/light theme.
  const [phase, setPhase] = useState<
    "cream" | "black-transition" | "title-reveal" | "complete"
  >("cream");

  useEffect(() => {
    // Step 1: Light canvas with lines + Kanji circle (0ms - 2000ms)
    const t1 = setTimeout(() => {
      setPhase("black-transition");
    }, 2000);

    // Step 2: Center wipe (2000ms - 3200ms)
    const t2 = setTimeout(() => {
      setPhase("title-reveal");
    }, 3200);

    // Step 3: Title rises, fills, then loader unmounts (6000ms)
    const t3 = setTimeout(() => {
      setPhase("complete");
      if (onComplete) onComplete();
    }, 6000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  if (phase === "complete") return null;

  const isTitle = phase === "title-reveal";

  return (
    <div className="fixed inset-0 z-[9999] select-none overflow-hidden font-sans pointer-events-none">
      <style>{`
        @keyframes wcLineDown { from { transform: translateY(0); } to { transform: translateY(100%); } }
        @keyframes wcLineUp { from { transform: translateY(0); } to { transform: translateY(-100%); } }
        @keyframes wcCenterOut { 0%, 30% { transform: scaleY(1); } 100% { transform: scaleY(0); } }
        @keyframes wcCircleIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
        @keyframes wcCircleOut { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.9); } }
        @keyframes wcWipe {
          from { clip-path: inset(0 calc(50% - 1px) 0 calc(50% - 1px)); }
          to { clip-path: inset(0 0 0 0); }
        }
        @keyframes wcRise { from { transform: translateY(105%); } to { transform: translateY(0); } }
        @keyframes wcFill { from { color: transparent; } to { color: var(--loader-b-fg); } }
        @keyframes wcFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes wcRingIn { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
 
      `}</style>

      {/* ---------------------------------------------------- */}
      {/* PHASE 1: LIGHT CANVAS WITH LINES + CIRCLED KANJI     */}
      {/* ---------------------------------------------------- */}
 <div className="absolute inset-0 overflow-hidden bg-loader-a">
  {/* Left line (slides DOWN) */}
  <div className="absolute top-0 left-[7.5%] h-full w-[2px] overflow-hidden">
    <div
      className="h-full w-full bg-loader-a-fg"
      style={{ animation: "wcLineDown 1.4s cubic-bezier(0.77,0,0.175,1) 0.5s forwards" }}
    />
  </div>

  {/* Center line (slides UP) */}
  <div className="absolute top-0 left-1/2 h-full w-px overflow-hidden">
    <div
      className="h-full w-full bg-loader-a-fg/60"
      style={{ animation: "wcLineUp 1.4s cubic-bezier(0.77,0,0.175,1) 0.6s forwards" }}
    />
  </div>

  {/* Right line (slides DOWN) */}
  <div className="absolute top-0 left-[92.5%] h-full w-[2px] overflow-hidden">
    <div
      className="h-full w-full bg-loader-a-fg"
      style={{ animation: "wcLineDown 1.4s cubic-bezier(0.77,0,0.175,1) 0.7s forwards" }}
    />
  </div>

  {/* Bigger circle with outer rings + Japanese text */}
  <div className="absolute inset-0 grid place-items-center">
    <div
      className="col-start-1 row-start-1 h-44 w-44 rounded-full border border-loader-a-fg/20 sm:h-64 sm:w-64"
      style={{
        animation: "wcRingIn 0.8s ease-out 0.25s both, wcCircleOut 0.6s ease-in 1.3s forwards",
      }}
    />
    <div
      className="col-start-1 row-start-1 h-32 w-32 rounded-full border border-loader-a-fg/35 sm:h-48 sm:w-48"
      style={{
        animation: "wcRingIn 0.7s ease-out 0.15s both, wcCircleOut 0.6s ease-in 1.3s forwards",
      }}
    />
    <div
      className="col-start-1 row-start-1 flex h-24 w-24 items-center justify-center rounded-full border border-loader-a-fg/60 bg-loader-a sm:h-36 sm:w-36"
      style={{
        animation: "wcCircleIn 0.5s ease-out both, wcCircleOut 0.6s ease-in 1.3s forwards",
      }}
    >
      <span className="font-serif text-3xl leading-none text-loader-a-fg sm:text-5xl">
        WC
      </span>
    </div>
  </div>
</div>

      {/* ---------------------------------------------------- */}
      {/* PHASE 2 & 3: WIPE + LEFT-ALIGNED TITLE REVEAL        */}
      {/* ---------------------------------------------------- */}
      <div
        className="absolute inset-0 flex flex-col justify-between bg-loader-b p-6 sm:p-12"
        style={{
          visibility: phase === "cream" ? "hidden" : "visible",
          clipPath:
            phase === "cream"
              ? "inset(0 calc(50% - 1px) 0 calc(50% - 1px))"
              : undefined,
          animation:
            phase === "cream"
              ? undefined
              : "wcWipe 1.1s cubic-bezier(0.77,0,0.175,1) forwards",
        }}
      >
       

        {/* Background Japanese Watermark Overlay */}
        <span
          className={`pointer-events-none absolute inset-0 flex items-center justify-center font-serif text-[24vw] font-black leading-none text-loader-b-fg/[0.05] transition-all duration-1000 sm:text-[18vw] ${
            isTitle ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
        >
          Comic
        </span>

        {/* LEFT-ALIGNED OUTLINED TYPOGRAPHY (BOTTOM-LEFT) */}
        <div className="relative z-10 flex flex-1 flex-col items-start justify-end pb-6 sm:pb-8">
          <div className="overflow-hidden py-1 pl-1">
            <h1
              className="pr-[0.12em] text-left text-[16vw] font-black uppercase leading-[0.85] tracking-tighter sm:text-[14vw]"
              style={{
                WebkitTextStroke: "1.5px var(--loader-b-stroke)",
                color: "transparent",
                transform: "translateY(105%)",
                animation: isTitle
                  ? "wcRise 1.4s cubic-bezier(0.77,0,0.175,1) forwards, wcFill 1.1s ease-in-out 1.2s forwards"
                  : undefined,
              }}
            >
              WARRIOR
            </h1>
          </div>
         
        </div>

      {/* BOTTOM METADATA BAR */}
<div
  className={`relative z-10 flex flex-col gap-4 border-t border-loader-b-line pt-5 font-mono transition-opacity duration-700 sm:flex-row sm:items-end sm:justify-between sm:pt-6 ${
    isTitle ? "opacity-100" : "opacity-0"
  }`}
>
  <div>
    <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.3em] text-accent sm:text-sm">
      Explore
    </span>
    <span className="text-base font-medium uppercase tracking-[0.12em] text-loader-b-fg  ">
      Comics · Videos · Blogs · Characters
    </span>
  </div>

  <div className="sm:text-right">
    <span className="mb-1 block text-xs font-bold uppercase tracking-[0.3em] text-accent sm:text-sm">
      Warrior Token
    </span>
    <span className="animate-pulse text-base font-bold uppercase tracking-[0.12em] text-loader-b-fg ">
      ICO Presale Starting Soon
    </span>
  </div>
</div>
      </div>
    </div>
  );
}