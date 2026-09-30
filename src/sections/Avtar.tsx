"use client";

import React, { useEffect, useRef, useState } from "react";

const BASE = "http://warriorcomics.com/Content/Images";

type Card = { name: string; text: string; href: string };
type Slide = {
  left: string[]; // images on the left of the band
  right: string[]; // images on the right of the band
  cards: [Card, Card];
};

/* Swap images between slides here if a character ends up on the wrong side */
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

  /* ---------- Keyboard nav (optional, nice touch) ---------- */
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
      className="relative z-20 -mt-20 md:-mt-28 bg-transparent font-sans overflow-x-clip"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* Stage: characters rise above the band (overlapping the blog) and drop below it */}
      <div className="relative w-full h-[350px] md:h-[470px]">
        {/* Blue band */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-[80px] md:top-[110px] h-[210px] md:h-[265px]"
          style={{ background: "#17789e" }}
        />

        {/* Slides */}
        {SLIDES.map((s, si) => {
          const on = si === index;
          return (
            <div
              key={si}
              aria-hidden={!on}
              className="absolute inset-0"
              style={{
                opacity: on ? 1 : 0,
                pointerEvents: on ? "auto" : "none",
                transition: "opacity 0.7s ease",
                zIndex: on ? 2 : 1,
              }}
            >
              {/* Left characters */}
              <div className="absolute left-0 top-[14px] md:top-[30px] flex items-end pointer-events-none pl-0 md:pl-[2%]">
                {s.left.map((src, k) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={k}
                    src={src}
                    alt=""
                    draggable={false}
                    className={`block w-auto max-w-none select-none h-[260px] md:h-[400px] ${
                      k > 0 ? "-ml-10 md:-ml-16 hidden sm:block" : ""
                    }`}
                    style={{
                      transform: on ? "translateX(0)" : "translateX(-40px)",
                      transition: "transform 0.9s cubic-bezier(0.22,1,0.36,1)",
                      filter: "drop-shadow(0 0 22px rgba(120,220,255,0.35))",
                    }}
                  />
                ))}
              </div>

              {/* Right characters */}
              <div className="absolute right-0 top-[14px] md:top-[30px] flex items-end flex-row-reverse pointer-events-none pr-0 md:pr-[2%]">
                {s.right.map((src, k) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={k}
                    src={src}
                    alt=""
                    draggable={false}
                    className={`block w-auto max-w-none select-none h-[260px] md:h-[400px] ${
                      k > 0 ? "-mr-10 md:-mr-16 hidden sm:block" : ""
                    }`}
                    style={{
                      transform: on ? "translateX(0)" : "translateX(40px)",
                      transition: "transform 0.9s cubic-bezier(0.22,1,0.36,1)",
                      filter: "drop-shadow(0 0 22px rgba(120,220,255,0.35))",
                    }}
                  />
                ))}
              </div>

              {/* Centre cards */}
              <div className="absolute inset-x-0 top-[80px] md:top-[110px] h-[210px] md:h-[265px] flex items-center justify-center px-[22%] sm:px-[20%] md:px-[24%] lg:px-[27%] pointer-events-none">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-3 w-full max-w-[760px] pointer-events-auto text-white -mt-4">
                  {s.cards.map((c, ci) => (
                    <div
                      key={ci}
                      className={`flex items-start gap-3 ${
                        ci === 1 ? "hidden sm:flex" : ""
                      }`}
                      style={{
                        transform: on ? "translateY(0)" : "translateY(12px)",
                        opacity: on ? 1 : 0,
                        transition: `transform 0.7s cubic-bezier(0.22,1,0.36,1) ${
                          0.08 + ci * 0.08
                        }s, opacity 0.7s ease ${0.08 + ci * 0.08}s`,
                      }}
                    >
                      <svg
                        aria-hidden
                        className="shrink-0 mt-0.5"
                        width="30"
                        height="30"
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
                        <h3 className="m-0 text-base md:text-lg font-bold uppercase tracking-wide leading-tight">
                          {c.name}
                        </h3>
                        <p className="mt-1 mb-2.5 text-[10px] md:text-[11px] leading-snug uppercase text-white/90">
                          {c.text}
                        </p>
                        <a
                          href={c.href}
                          className="inline-block px-3.5 py-1.5 text-xs md:text-[13px] font-bold text-white no-underline transition-colors duration-200"
                          style={{ background: "#c8102e" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#a30d25")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "#c8102e")
                          }
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

        {/* Pagination dots (inside the band, bottom centre) */}
        <div className="absolute inset-x-0 top-[80px] md:top-[110px] h-[210px] md:h-[265px] flex items-end justify-center pb-4 md:pb-5 pointer-events-none">
          <div className="flex items-center gap-2.5 pointer-events-auto">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className="p-0 border-none cursor-pointer rounded-full transition-all duration-300"
                style={{
                  width: i === index ? 26 : 10,
                  height: 10,
                  background: i === index ? "#ffffff" : "rgba(255,255,255,0.4)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}