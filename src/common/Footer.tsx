"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/* Content (from warriorcomics.com)                                    */
/* ------------------------------------------------------------------ */
const BASE = "/Images/Imgs";
const LOGO = `${BASE}/Logo.png`;
const TOKEN_LOGO = `${BASE}/warrior-token-logo.png`;

const ICO_HREF = "https://warriortoken.com/";
const EMAIL = "info@warriorcomics.com";
const PHONE = "+1 702-674-6666";
const PHONE_HREF = "tel:+17026746666";

const MENUS = [
  { label: "Character", href: "/character" },
  { label: "Comics", href: "/comics" },
  { label: "Videos", href: "/videos" },
  { label: "Blog", href: "/blog" },
  // { label: "News", href: "/news" },
  { label: "FAQ", href: "/faq" },
];

const POLICIES = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

const SOCIALS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/Warriorcomics/",
    brand: "#1877f2",
    path: "M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z",
  },
  {
    label: "Twitter",
    href: "https://twitter.com/WarriorComics",
    brand: "#1d9bf0",
    path: "M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 0 0 1.88-2.37 8.6 8.6 0 0 1-2.72 1.04 4.28 4.28 0 0 0-7.29 3.9A12.14 12.14 0 0 1 3.15 4.79a4.28 4.28 0 0 0 1.33 5.71 4.25 4.25 0 0 1-1.94-.54v.05a4.28 4.28 0 0 0 3.43 4.2 4.3 4.3 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.97A8.59 8.59 0 0 1 2 19.54a12.1 12.1 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2l-.01-.56A8.7 8.7 0 0 0 22.46 6z",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCkshim4H3St0L0YrksRKa5Q",
    brand: "#ff0000",
    path: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z",
  },
  {
    label: "Reddit",
    href: "https://www.reddit.com/user/WarriorComics",
    brand: "#ff4500",
    path: "M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z",
  },
  {
    label: "Medium",
    href: "https://medium.com/@warriorcomics99",
    brand: "#ffffff",
    path: "M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z",
  },
];

const WORDMARK = "Warrior Comics";
const EASE = "cubic-bezier(0.77,0,0.175,1)";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/* Self-contained keyframes */
const CSS = `
@keyframes ftSweep { from { transform: translateX(-120%); } to { transform: translateX(420%); } }
@keyframes ftSpin { to { transform: rotate(360deg); } }
@keyframes ftSpinRev { to { transform: rotate(-360deg); } }
@keyframes ftTwinkle { 0%,100% { opacity:.2; transform:scale(.7);} 50% { opacity:1; transform:scale(1.4);} }
@keyframes ftRise {
  0%   { transform: translate3d(0,0,0); opacity: 0; }
  10%  { opacity: 1; }
  100% { transform: translate3d(var(--dx), -420px, 0); opacity: 0; }
}
@keyframes ftShimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
@keyframes ftFlicker {
  0%,100% { opacity:.55; } 8% { opacity:.8; } 17% { opacity:.5; } 31% { opacity:.92; }
  47% { opacity:.6; } 63% { opacity:.85; } 78% { opacity:.5; } 90% { opacity:.75; }
}
.ft-sweep   { animation: ftSweep 6s cubic-bezier(.4,0,.2,1) infinite; }
.ft-spin    { animation: ftSpin 14s linear infinite; }
.ft-spin-rev{ animation: ftSpinRev 30s linear infinite; }
.ft-twinkle { animation: ftTwinkle 3.4s ease-in-out infinite; }
.ft-rise    { animation: ftRise linear infinite; }
.ft-shimmer { animation: ftShimmer 7s linear infinite; }
.ft-flicker { animation: ftFlicker 3.2s linear infinite; }
@media (prefers-reduced-motion: reduce) {
  .ft-sweep,.ft-spin,.ft-spin-rev,.ft-twinkle,.ft-rise,.ft-shimmer,.ft-flicker { animation: none !important; }
}
`;

// rising embers: [left %, duration s, delay s, size px, drift px]
const EMBERS: [number, number, number, number, number][] = [
  [8, 9, 0, 2, 20],
  [21, 11, 3, 3, -16],
  [37, 10, 6, 2, 22],
  [52, 12, 1, 3, -24],
  [66, 9, 5, 2, 18],
  [80, 11, 2, 3, -20],
  [93, 10, 7, 2, 14],
];

// stars: [left %, top %, delay s, size px]
const STARS: [number, number, number, number][] = [
  [6, 18, 0, 2],
  [24, 62, 1.3, 3],
  [44, 14, 2.2, 2],
  [61, 74, 0.7, 2],
  [77, 24, 1.8, 3],
  [95, 55, 0.4, 2],
];

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */
function Line({ d }: { d: string[] }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0"
    >
      {d.map((p) => (
        <path key={p} d={p} />
      ))}
    </svg>
  );
}

const MAIL = ["M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z", "M22 6l-10 7L2 6"];
const PHONE_ICON = [
  "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z",
];
const PIN = ["M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z", "M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"];

/* heading with a coloured underline that draws in */
function ColHead({
  title,
  color,
  show,
  delay,
}: {
  title: string;
  color: string;
  show: boolean;
  delay: number;
}) {
  return (
    <div className="mb-5">
      <h4 className="m-0 font-serif text-base font-semibold uppercase tracking-[0.18em] text-nav-right-heading">
        {title}
      </h4>
      <div className="relative mt-3 h-px w-full bg-nav-right-line">
        <span
          aria-hidden
          className={`absolute left-0 top-[-1px] h-[3px] w-12 origin-left ${color}`}
          style={{
            transform: show ? "scaleX(1)" : "scaleX(0)",
            transition: `transform 0.9s ${EASE}`,
            transitionDelay: show ? `${delay + 0.3}s` : "0s",
          }}
        />
      </div>
    </div>
  );
}

/* link with a growing dash + arrow */
const linkCls =
  "group inline-flex items-center gap-0 text-[15px] text-nav-right-text no-underline transition-all duration-300 hover:text-nav-right-heading";

function Dash() {
  return (
    <span
      aria-hidden
      className="mr-0 h-px w-0 bg-accent transition-all duration-300 group-hover:mr-2 group-hover:w-3"
    />
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export default function Footer() {
  const footRef = useRef<HTMLElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);

  const [inView, setInView] = useState(false);

  /* reveal when the footer scrolls into view */
  useEffect(() => {
    const el = footRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);



  /* flashlight over the giant wordmark */
  const onWordMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = wordRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    el.style.setProperty("--lit", "1");
  };
  const onWordLeave = () => {
    wordRef.current?.style.setProperty("--lit", "0");
  };

  const rise = (d: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(22px)",
    transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
    transitionDelay: inView ? `${d}s` : "0s",
  });

/* ---------------------------------------------------------------- */
  return (
    <footer
      ref={footRef}
      id="footer"
      className="relative isolate bg-[color-mix(in_oklab,var(--nav-overlay-bg)_30%,#000)] text-nav-right-heading transition-colors duration-500 font-sans"
    >
      <style>{CSS}</style>

      {/* ============ BACKDROP ============ */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_0%,var(--nav-right-from)_0%,transparent_60%)] opacity-25" />
        <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(var(--nav-right-line)_1px,transparent_1.6px)] [background-size:16px_16px] [mask-image:linear-gradient(to_bottom,transparent,#000_60%)]" />

        {/* top edge: light sweeping across */}
        <div className="absolute inset-x-0 top-0 h-px overflow-hidden bg-nav-right-line">
          <span className="ft-sweep absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-accent to-transparent" />
        </div>

        {/* forge glow from the bottom */}
        <div className="ft-flicker absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-orange-600/25 via-red-700/10 to-transparent" />

        {EMBERS.map(([l, dur, del, sz, dx], i) => (
          <span
            key={`e${i}`}
            className="ft-rise absolute bottom-0 rounded-full bg-orange-400 shadow-[0_0_8px_2px_rgba(251,146,60,0.7)]"
            style={
              {
                left: `${l}%`,
                width: sz,
                height: sz,
                animationDuration: `${dur}s`,
                animationDelay: `${del}s`,
                "--dx": `${dx}px`,
              } as React.CSSProperties
            }
          />
        ))}
        {STARS.map(([l, t, d, sz], i) => (
          <span
            key={`s${i}`}
            className="ft-twinkle absolute rounded-full bg-nav-right-heading"
            style={{ left: `${l}%`, top: `${t}%`, width: sz, height: sz, animationDelay: `${d}s` }}
          />
        ))}
      </div>

      {/* ============ COLUMNS ============ */}
      <div className="relative mx-auto grid w-full max-w-[1400px] gap-12 px-6 pb-12 pt-20 sm:grid-cols-2 sm:px-10 lg:grid-cols-4 lg:gap-12">
        {/* ---- 1 · Warrior Comics / ICO ---- */}
        <div style={rise(0.05)}>
          <ColHead title="Warrior Comics" color="bg-red-500" show={inView} delay={0.05} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO}
            alt="Warrior Comics"
            draggable={false}
            className="mb-4 h-10 w-auto select-none object-contain"
          />
          <p className="m-0 max-w-[18rem] text-[15px] leading-relaxed text-nav-right-text">
            Participate in token sale. Track our ICO here.
          </p>

          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-nav-right-line bg-black/30 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-nav-right-text">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Presale starting soon
          </div>

          <div className="mt-5">
            <a
              href={ICO_HREF}
              target="_blank"
              rel="noreferrer"
              className="group/btn relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-accent py-2.5 pl-3 pr-6 font-serif text-xs uppercase tracking-[0.2em] text-accent-fg no-underline shadow-[0_10px_30px_-10px_var(--accent)] transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black/25">
                <span
                  aria-hidden
                  className="ft-spin absolute inset-0 rounded-full border border-dashed border-accent-fg/60"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={TOKEN_LOGO}
                  alt=""
                  draggable={false}
                  className="relative h-5 w-5 object-contain"
                />
              </span>
              <span className="relative z-10">Our ICO</span>
              <span
                aria-hidden
                className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/40 transition-transform duration-700 group-hover/btn:translate-x-[420%]"
              />
            </a>
          </div>
        </div>

        {/* ---- 2 · Menus ---- */}
        <div style={rise(0.17)}>
          <ColHead title="Menus" color="bg-accent" show={inView} delay={0.17} />
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {MENUS.map((m) => (
              <li key={m.label}>
                <Link href={m.href} className={linkCls}>
                  <Dash />
                  {m.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ---- 3 · Policies + socials ---- */}
        <div style={rise(0.29)}>
          <ColHead title="Policies" color="bg-pink-400" show={inView} delay={0.29} />
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {POLICIES.map((p) => (
              <li key={p.label}>
                <a href={p.href} className={linkCls}>
                  <Dash />
                  {p.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {SOCIALS.map((s, i) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                title={s.label}
                className={`group/s relative grid h-10 w-10 place-items-center overflow-hidden rounded-md border border-nav-right-line bg-black/30 text-[var(--brand)] no-underline backdrop-blur-sm transition-[transform,background-color,border-color,color,box-shadow,opacity] duration-300 hover:-translate-y-1.5 hover:border-[var(--brand)] hover:bg-[var(--brand)] hover:text-white hover:shadow-[0_12px_24px_-8px_var(--brand)] ${
                  inView ? "scale-100 opacity-100" : "scale-[0.4] opacity-0"
                }`}
                style={
                  {
                    "--brand": s.brand,
                    transitionDelay: `${0.55 + i * 0.08}s`,
                  } as React.CSSProperties
                }
              >
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`h-[18px] w-[18px] transition-colors duration-300 ${
                    s.label === "Medium" ? "group-hover/s:text-black" : ""
                  }`}
                >
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* ---- 4 · Address ---- */}
        <div style={rise(0.41)}>
          <ColHead title="Address Information" color="bg-cyan-400" show={inView} delay={0.41} />
          <ul className="m-0 flex list-none flex-col gap-5 p-0 text-[15px] text-nav-right-text">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-cyan-300">
                <Line d={PIN} />
              </span>
              <span className="leading-relaxed">
                PO BOX 230610 Las Vegas, Nevada
                <br />
                Warrior Comics Inc.
              </span>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`} className={`${linkCls} gap-3`}>
                <span className="text-cyan-300 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110">
                  <Line d={MAIL} />
                </span>
                <span className="break-all">{EMAIL}</span>
              </a>
            </li>
            <li>
              <a href={PHONE_HREF} className={`${linkCls} gap-3`}>
                <span className="text-cyan-300 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                  <Line d={PHONE_ICON} />
                </span>
                {PHONE}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* ============ GIANT WORDMARK (flashlight) ============ */}
      <div
        ref={wordRef}
        onPointerMove={onWordMove}
        onPointerLeave={onWordLeave}
        className="relative mx-auto max-w-[1600px] select-none overflow-hidden px-2 h-[clamp(3rem,11.5vw,10.5rem)]"
        aria-hidden
      >
        <div
          className={`font-serif font-bold uppercase tracking-[0.02em] whitespace-nowrap text-center text-3xl sm:text-[clamp(3rem,7vw,12rem)] transition-[transform,opacity] duration-[1400ms,1000ms] ease-[cubic-bezier(0.77,0,0.175,1),ease-out] delay-[400ms] ${
            inView ? "translate-y-0 opacity-100" : "translate-y-[70%] opacity-0"
          }`}
        >
          {/* outline */}
          <span className="block text-transparent [-webkit-text-stroke:1px_var(--nav-right-line)]">
            {WORDMARK}
          </span>
          {/* idle shimmer — background-image references --accent; keep inline for the CSS var interpolation */}
          <span
            className="ft-shimmer absolute inset-x-0 top-0 block bg-clip-text text-transparent opacity-70 [background-size:200%_100%]"
            style={{
              backgroundImage:
                "linear-gradient(100deg, transparent 35%, color-mix(in srgb, var(--accent) 65%, transparent) 50%, transparent 65%)",
            }}
          >
            {WORDMARK}
          </span>
          {/* cursor flashlight — --mx/--my/--lit set imperatively on pointer move */}
          <span
            className="absolute inset-x-0 top-0 block bg-clip-text text-transparent transition-opacity duration-300 [background-image:radial-gradient(240px_circle_at_var(--mx,50%)_var(--my,50%),var(--accent),transparent_70%)]"
            style={{ opacity: "var(--lit, 0)" as unknown as number }}
          >
            {WORDMARK}
          </span>
        </div>
      </div>

      {/* ============ BOTTOM BAR ============ */}
      <div className="relative border-t border-nav-right-line bg-black/40 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-2 px-5 py-4 text-center sm:flex-row sm:gap-4 sm:px-8">
          <span aria-hidden className="ft-spin hidden text-accent sm:inline-block">
            ✳
          </span>
          <p className="m-0 text-sm font-semibold tracking-wide text-nav-right-heading sm:text-[15px]">
            Copyright &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> Warrior
            Comics | All rights reserved.
          </p>
          <span aria-hidden className="ft-spin hidden text-accent sm:inline-block">
            ✳
          </span>
        </div>
      </div>
    </footer>
  );
}