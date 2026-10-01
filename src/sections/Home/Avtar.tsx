"use client";

import React, { useEffect, useRef, useState } from "react";

const BASE = "/images/Avtar";

type Card = { name: string; text: string; href: string };
type Slide = {
  left: string[]; // images on the left
  right: string[]; // images on the right
  cards: [Card, Card];
};

/* Allows 2 images on 2xl screens, conditionally hidden on smaller screens */
const SLIDES: Slide[] = [
  {
    left: [`${BASE}/doctor-1.png`, `${BASE}/ange-guru-1.png`],
    right: [`${BASE}/sentor-1.png`],
    cards: [
      {
        name: "Avatarman",
        text: "He is the son of Merlyn Meronius and Petra Meronius. He is capable of transdimensional travel, time-travel, teleportation, levitation...",
        href: "#",
      },
      {
        name: "Sentor",
        text: "He is an enemy of Avatarman. Possess technological and semi magical skills making him equally powerful like Avatarman. His cube is his power.",
        href: "#",
      },
    ],
  },
  {
    left: [`${BASE}/petraB.png`],
    right: [`${BASE}/doctor-1.png`],
    cards: [
      {
        name: "Ange Apollo",
        text: "He has exceptional intelligence, remarkably knowledge makes him Avatarman's advisor and guide. He is a perfect blend of wisdom and design.",
        href: "#",
      },
      {
        name: "Doctor Handel Von Neumann",
        text: "He is stylish, intelligent and very professional. He is a perfect blend of genius for a billionaire, the world's smartest...",
        href: "#",
      },
    ],
  },
  {
    left: [`${BASE}/Merlyn-1.png`],
    right: [`${BASE}/petraB.png`, `${BASE}/ange-guru-1.png`],
    cards: [
      {
        name: "Merlyn Meronius",
        text: "He is a great wizard, master of ancient magic and the royal protector of the realm. His staff lights up when a new tale begins.",
        href: "#",
      },
      {
        name: "Petra Meronius",
        text: "She is a queen, mother of Avatarman with charming looks though she is not making hard work by her extraordinary powers...",
        href: "#",
      },
    ],
  },
];

const AUTO_MS = 5200;

export default function Avtar() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  /* ---------- Auto-advance ---------- */
  useEffect(() => {
    if (paused) return;

    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, AUTO_MS);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [paused]);

  /* ---------- Keyboard nav ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % SLIDES.length);
      if (e.key === "ArrowLeft")
        setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

return (
    <section
      id="avatars"
      className="relative z-20 -mt-12 sm:-mt-20 md:-mt-28 bg-transparent font-sans overflow-x-clip select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* Stage */}
      <div className="relative w-full h-[320px] sm:h-[380px] md:h-[470px]">
        {/* Blue band */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-[60px] sm:top-[80px] md:top-[110px] h-[220px] sm:h-[240px] md:h-[265px] bg-[#17789e]"
        />

        {/* Slides */}
        {SLIDES.map((s, si) => {
          const on = si === index;
          return (
            <div
              key={si}
              aria-hidden={!on}
              className={`absolute inset-0 transition-opacity duration-700 ease ${
                on ? "opacity-100 pointer-events-auto z-[2]" : "opacity-0 pointer-events-none z-[1]"
              }`}
            >
              {/* Left Characters */}
              <div className="absolute left-0 top-[10px] sm:top-[14px] md:top-[30px] flex items-end pointer-events-none pl-0 md:pl-[2%] max-w-[32%] sm:max-w-none">
                {s.left.map((src, k) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={k}
                    src={src}
                    alt=""
                    draggable={false}
                    className={`block w-auto max-w-full sm:max-w-none select-none object-contain h-[200px] xs:h-[240px] sm:h-[310px] md:h-[400px] drop-shadow-[0_0_22px_rgba(120,220,255,0.35)] transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      on ? "translate-x-0" : "-translate-x-[40px]"
                    } ${k > 0 ? "-ml-8 sm:-ml-12 md:-ml-16 hidden 2xl:block" : ""}`}
                  />
                ))}
              </div>

              {/* Right Characters */}
              <div className="absolute right-0 top-[10px] sm:top-[14px] md:top-[30px] flex items-end flex-row-reverse pointer-events-none pr-0 md:pr-[2%] max-w-[32%] sm:max-w-none">
                {s.right.map((src, k) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={k}
                    src={src}
                    alt=""
                    draggable={false}
                    className={`block w-auto max-w-full sm:max-w-none select-none object-contain h-[200px] xs:h-[240px] sm:h-[310px] md:h-[400px] drop-shadow-[0_0_22px_rgba(120,220,255,0.35)] transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      on ? "translate-x-0" : "translate-x-[40px]"
                    } ${k > 0 ? "-mr-8 sm:-mr-12 md:-mr-16 hidden 2xl:block" : ""}`}
                  />
                ))}
              </div>

              {/* Center text cards */}
              <div className="absolute inset-x-0 top-[60px] sm:top-[80px] md:top-[110px] h-[220px] sm:h-[240px] md:h-[265px] flex items-center justify-center px-4 sm:px-[20%] md:px-[24%] lg:px-[27%] pointer-events-none">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 lg:gap-x-12 gap-y-3 w-full max-w-[760px] pointer-events-auto text-white -mt-2 sm:-mt-4">
                  {s.cards.map((c, ci) => (
                    <div
                      key={ci}
                      className={`flex items-start gap-2 sm:gap-3 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1),ease] ${
                        on ? "translate-y-0 opacity-100" : "translate-y-[12px] opacity-0"
                      } ${ci === 1 ? "hidden sm:flex" : ""}`}
                      style={{ transitionDelay: `${0.08 + ci * 0.08}s` }}
                    >
                      <svg
                        aria-hidden
                        className="shrink-0 mt-0.5 w-5 h-5 sm:w-7 sm:h-7"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      <div className="min-w-0">
                        <h3 className="m-0 text-sm sm:text-base md:text-lg font-bold uppercase tracking-wide leading-tight">
                          {c.name}
                        </h3>
                        <p className="mt-1 mb-2 sm:mb-2.5 text-[9px] sm:text-[10px] md:text-[11px] leading-snug uppercase text-white/90 line-clamp-3 sm:line-clamp-none">
                          {c.text}
                        </p>
                        <a
                          href={c.href}
                          className="inline-block px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[10px] sm:text-xs md:text-[13px] font-bold text-white no-underline bg-[#c8102e] transition-colors duration-200 hover:bg-[#a30d25]"
                        >
                          Read more
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {/* Pagination dots */}
        <div className="absolute inset-x-0 top-[60px] sm:top-[80px] md:top-[110px] h-[220px] sm:h-[240px] md:h-[265px] flex items-end justify-center pb-3 sm:pb-4 md:pb-5 pointer-events-none">
          <div className="flex items-center gap-2.5 pointer-events-auto z-10">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-[10px] p-0 border-none cursor-pointer rounded-full transition-all duration-300 ${
                  i === index ? "w-[26px] bg-white" : "w-[10px] bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}