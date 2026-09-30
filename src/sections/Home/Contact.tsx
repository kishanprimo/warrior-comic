"use client";

import React, { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* Content (from warriorcomics.com)                                    */
/* ------------------------------------------------------------------ */
const BASE = "/wc-content/Images";
const BG_IMG = `${BASE}/artist.jpg`;
const HERO_L = `${BASE}/avtarman.png`;
const HERO_R = `${BASE}/sentor-1.png`;

const HEADING = "We'd love to hear about your project.";

const EMAIL = "info@warriorcomics.com";
const PHONE = "+1 702-674-6666";
const PHONE_HREF = "tel:+17026746666";
const OFFICE = ["PO Box 230610, Las Vegas, Nevada", "Warrior Comics Inc."];

const SOCIALS = [
  { label: "Facebook", href: "https://www.facebook.com/Warriorcomics/" },
  { label: "Twitter", href: "https://twitter.com/WarriorComics" },
  { label: "YouTube", href: "https://www.youtube.com/channel/UCkshim4H3St0L0YrksRKa5Q" },
  { label: "Reddit", href: "https://www.reddit.com/user/WarriorComics" },
  { label: "Medium", href: "https://medium.com/@warriorcomics99" },
];

const MARQUEE = "Let's create another world  ✳  WC-Universe  ✳  Warrior Comics  ✳  ";

// Where the form is sent. Leave "" to open the visitor's email app (mailto).
// Set to e.g. "/api/contact" once you have a backend route that accepts JSON.
const CONTACT_ENDPOINT = "";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const EASE = "cubic-bezier(0.77,0,0.175,1)";

type Values = { name: string; email: string; phone: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;
type Status = "idle" | "sending" | "sent" | "error";

const validate = (v: Values): Errors => {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please tell us your name";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()))
    e.email = "Enter a valid email address";
  if (v.phone.trim() && !/^[+\d][\d\s\-()]{6,}$/.test(v.phone.trim()))
    e.phone = "Enter a valid phone number";
  if (v.message.trim().length < 10) e.message = "Tell us a little more (10+ characters)";
  return e;
};

/* Self-contained keyframes */
const CSS = `
@keyframes ctKen { from { transform: scale(1.05); } to { transform: scale(1.2) translate(-1.5%, -1%); } }
@keyframes ctSpin { to { transform: rotate(360deg); } }
@keyframes ctSpinRev { to { transform: rotate(-360deg); } }
@keyframes ctPulse { 0%,100% { opacity:.4; transform: scale(1);} 50% { opacity:.9; transform: scale(1.12);} }
@keyframes ctMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes ctRise {
  0%   { transform: translate3d(0,0,0); opacity: 0; }
  10%  { opacity: 1; }
  100% { transform: translate3d(var(--dx), -85vh, 0); opacity: 0; }
}
@keyframes ctFloat { 0%,100% { transform: translate3d(0,0,0);} 50% { transform: translate3d(0,-12px,0);} }
@keyframes ctShake {
  0%,100% { transform: translateX(0); }
  20% { transform: translateX(-8px); } 40% { transform: translateX(7px); }
  60% { transform: translateX(-5px); } 80% { transform: translateX(3px); }
}
@keyframes ctSpinner { to { transform: rotate(360deg); } }
@keyframes ctDraw { to { stroke-dashoffset: 0; } }
@keyframes ctPop { 0% { transform: scale(.6); opacity:0; } 70% { transform: scale(1.08); opacity:1; } 100% { transform: scale(1); } }
@keyframes ctBurst {
  0%   { transform: translate(0,0) scale(1); opacity: 1; }
  100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
}
@keyframes ctTwinkle { 0%,100% { opacity:.2; transform:scale(.7);} 50% { opacity:1; transform:scale(1.4);} }
.ct-ken      { animation: ctKen 26s ease-in-out infinite alternate; }
.ct-spin     { animation: ctSpin 50s linear infinite; }
.ct-spin-rev { animation: ctSpinRev 34s linear infinite; }
.ct-pulse    { animation: ctPulse 5s ease-in-out infinite; }
.ct-marquee  { animation: ctMarquee 28s linear infinite; }
.ct-float    { animation: ctFloat 7s ease-in-out infinite; }
.ct-shake    { animation: ctShake .5s ease-in-out; }
.ct-twinkle  { animation: ctTwinkle 3.4s ease-in-out infinite; }
.ct-draw     { stroke-dasharray: 60; stroke-dashoffset: 60; animation: ctDraw .7s .25s ease-out forwards; }
.ct-pop      { animation: ctPop .7s cubic-bezier(.2,.9,.3,1.2) both; }
.ct-burst    { animation: ctBurst 1s ease-out forwards; }
.ct-rise     { animation: ctRise linear infinite; }
@media (prefers-reduced-motion: reduce) {
  .ct-ken,.ct-spin,.ct-spin-rev,.ct-pulse,.ct-marquee,.ct-float,
  .ct-twinkle,.ct-rise { animation: none !important; }
}
`;

// rising embers: [left %, duration s, delay s, size px, drift px]
const EMBERS: [number, number, number, number, number][] = [
  [6, 11, 0, 3, 30],
  [14, 14, 4, 2, -20],
  [27, 12, 7, 3, 24],
  [41, 15, 2, 2, -30],
  [55, 13, 9, 3, 18],
  [68, 16, 5, 2, -26],
  [79, 12, 1, 4, 34],
  [90, 14, 8, 3, -18],
];

// twinkling stars: [left %, top %, delay s, size px]
const STARS: [number, number, number, number][] = [
  [9, 20, 0, 3],
  [22, 70, 1.2, 2],
  [47, 10, 2.1, 3],
  [63, 82, 0.6, 2],
  [78, 26, 1.7, 3],
  [92, 58, 0.3, 2],
];

/* ------------------------------------------------------------------ */
/* Tiny inline icons                                                   */
/* ------------------------------------------------------------------ */
const ICONS = {
  mail: ["M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z", "M22 6l-10 7L2 6"],
  phone: [
    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z",
  ],
  user: ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  pin: ["M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z", "M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"],
  chat: ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  send: ["M22 2L11 13", "M22 2l-7 20-4-9-9-4 20-7z"],
} as const;

function Icon({ name, className = "h-4 w-4" }: { name: keyof typeof ICONS; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {ICONS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Floating-label field                                                */
/* ------------------------------------------------------------------ */
function Field({
  id,
  label,
  icon,
  value,
  error,
  onChange,
  type = "text",
  textarea = false,
  optional = false,
  autoComplete,
  maxLength,
}: {
  id: keyof Values;
  label: string;
  icon: keyof typeof ICONS;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
  optional?: boolean;
  autoComplete?: string;
  maxLength?: number;
}) {
  const common =
    "peer w-full bg-transparent pl-11 pr-4 text-sm text-nav-right-heading outline-none placeholder-transparent";
  const labelCls = `pointer-events-none absolute left-11 origin-left text-sm text-nav-right-text/70 transition-all duration-200
    peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.18em] peer-focus:text-accent
    peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.18em] ${
      textarea ? "top-5" : "top-1/2 -translate-y-1/2"
    }`;

  return (
    <div>
      <div
        className={`group relative overflow-hidden rounded-lg border bg-black/25 backdrop-blur-sm transition-all duration-300 focus-within:bg-black/40 focus-within:shadow-[0_0_24px_-6px_var(--accent)] ${
          error
            ? "border-red-400/70"
            : "border-nav-right-line hover:border-nav-right-ring focus-within:border-accent/70"
        }`}
      >
        <span
          className={`pointer-events-none absolute left-4 z-10 text-nav-right-text/60 transition-colors duration-300 group-focus-within:text-accent ${
            textarea ? "top-5" : "top-1/2 -translate-y-1/2"
          }`}
        >
          <Icon name={icon} />
        </span>

        {textarea ? (
          <textarea
            id={id}
            name={id}
            value={value}
            rows={5}
            maxLength={maxLength}
            placeholder=" "
            onChange={(e) => onChange(e.target.value)}
            className={`${common} resize-none pb-3 pt-7`}
            aria-invalid={!!error}
          />
        ) : (
          <input
            id={id}
            name={id}
            type={type}
            value={value}
            autoComplete={autoComplete}
            placeholder=" "
            onChange={(e) => onChange(e.target.value)}
            className={`${common} h-14 pt-4`}
            aria-invalid={!!error}
          />
        )}

        <label htmlFor={id} className={labelCls}>
          {label}
          {optional && <span className="ml-1 normal-case tracking-normal opacity-60">(optional)</span>}
        </label>

        {/* animated underline */}
        <span
          aria-hidden
          className={`absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 transition-transform duration-500 group-focus-within:scale-x-100 ${
            error ? "bg-red-400" : "bg-accent"
          }`}
        />
      </div>

      <p
        className={`m-0 overflow-hidden px-1 text-[11px] text-red-300 transition-all duration-300 ${
          error ? "mt-1.5 max-h-6 opacity-100" : "max-h-0 opacity-0"
        }`}
        role="alert"
      >
        {error || "\u00A0"}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const cRef = useRef<HTMLSpanElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const [inView, setInView] = useState(false);
  const [values, setValues] = useState<Values>({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [shake, setShake] = useState(false);

  /* reveal when it scrolls into view */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* scroll + mouse parallax (one rAF loop, smoothed) */
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    let raf = 0;
    let pass = 0;
    let mx = 0;
    let my = 0;
    let tx = 0;
    let ty = 0;

    const onMove = (e: PointerEvent) => {
      if (!fine) return;
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const loop = () => {
      const el = sectionRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const k = reduce ? 1 : 0.1;
        pass += (clamp((vh - r.top) / (vh + r.height)) - pass) * k;
        mx += (tx - mx) * k;
        my += (ty - my) * k;

        if (cRef.current)
          cRef.current.style.transform = `translate(-50%, -50%) rotate(${pass * 160}deg)`;
        if (bgRef.current)
          bgRef.current.style.transform = `translate3d(${mx * -10}px, ${(0.5 - pass) * 60 + my * -8}px, 0)`;
        if (leftRef.current)
          leftRef.current.style.transform = `translate3d(${mx * -18}px, ${(0.5 - pass) * 70 + my * -8}px, 0)`;
        if (rightRef.current)
          rightRef.current.style.transform = `translate3d(${mx * -18}px, ${(0.5 - pass) * 70 + my * -8}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  /* spotlight that follows the cursor inside the form panel */
  const onPanelMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const p = panelRef.current;
    if (!p) return;
    const r = p.getBoundingClientRect();
    p.style.setProperty("--mx", `${e.clientX - r.left}px`);
    p.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const set = (k: keyof Values) => (v: string) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((s) => ({ ...s, [k]: undefined }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setShake(true);
      window.setTimeout(() => setShake(false), 520);
      return;
    }
    setStatus("sending");
    try {
      if (CONTACT_ENDPOINT) {
        const res = await fetch(CONTACT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (!res.ok) throw new Error("Request failed");
      } else {
        const body = `Name: ${values.name}\nEmail: ${values.email}\nPhone: ${
          values.phone || "-"
        }\n\n${values.message}`;
        window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
          `Project enquiry from ${values.name}`
        )}&body=${encodeURIComponent(body)}`;
        await new Promise((r) => setTimeout(r, 900));
      }
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setValues({ name: "", email: "", phone: "", message: "" });
    setErrors({});
    setStatus("idle");
  };

  const rise = (d: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(22px)",
    transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
    transitionDelay: inView ? `${d}s` : "0s",
  });

  const words = HEADING.split(" ");

  const INFO = [
    {
      icon: "mail" as const,
      title: "Email",
      lines: [EMAIL],
      href: `mailto:${EMAIL}`,
    },
    {
      icon: "phone" as const,
      title: "Phone",
      lines: [PHONE],
      href: PHONE_HREF,
    },
    {
      icon: "pin" as const,
      title: "Office",
      lines: OFFICE,
      href: undefined,
    },
  ];

  /* ---------------------------------------------------------------- */
  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-label="Contact Warrior Comics"
      className="relative isolate overflow-hidden bg-[color-mix(in_oklab,var(--nav-overlay-bg)_30%,#000)] text-nav-right-heading transition-colors duration-500 font-sans"
    >
      <style>{CSS}</style>

      {/* ============ BACKDROP ============ */}
      {/* photo, slowly zooming, dark overlay */}
      <div aria-hidden className="pointer-events-none absolute -inset-10 overflow-hidden">
        <div ref={bgRef} className="h-full w-full will-change-transform">
          <div
            className="ct-ken h-full w-full bg-cover bg-center opacity-[0.28]"
            style={{ backgroundImage: `url("${BG_IMG}")` }}
          />
        </div>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_40%,var(--nav-right-from)_0%,transparent_65%)] opacity-30"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_20%,rgba(0,0,0,0.8)_100%)]"
      />
      {/* comic halftone dots */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50 [background-image:radial-gradient(var(--nav-right-line)_1px,transparent_1.6px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_at_50%_50%,transparent_35%,#000_100%)]"
      />

      {/* rings behind the panel */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[min(120vw,1100px)] -translate-x-1/2 -translate-y-1/2"
      >
        <div className="ct-pulse absolute inset-[18%] rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute inset-[6%] rounded-full border border-nav-right-line" />
        <div className="ct-spin-rev absolute inset-0 rounded-full border border-dashed border-nav-right-line">
          <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_16px_3px_var(--accent)]" />
        </div>
        <div className="ct-spin absolute -inset-[6%] rounded-full border border-nav-right-line/40">
          <span className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_14px_4px_rgba(103,232,249,0.6)]" />
        </div>
      </div>

      {/* rising embers + twinkling stars */}
      {EMBERS.map(([l, dur, del, sz, dx], i) => (
        <span
          key={`e${i}`}
          aria-hidden
          className="ct-rise pointer-events-none absolute bottom-0 rounded-full bg-orange-400 shadow-[0_0_8px_2px_rgba(251,146,60,0.7)]"
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
          aria-hidden
          className="ct-twinkle pointer-events-none absolute rounded-full bg-nav-right-heading"
          style={{ left: `${l}%`, top: `${t}%`, width: sz, height: sz, animationDelay: `${d}s` }}
        />
      ))}

      {/* ============ CHARACTERS (face-off, behind the glass panel) ============ */}
      <div
        ref={leftRef}
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 z-[1] hidden will-change-transform md:block"
      >
        <div
          className="relative"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateX(0)" : "translateX(-80px)",
            transition: `opacity 1s ease-out 0.4s, transform 1.2s ${EASE} 0.4s`,
          }}
        >
          <div className="ct-pulse absolute left-1/2 top-1/3 h-[70%] w-[90%] -translate-x-1/2 rounded-full bg-cyan-400/25 blur-3xl" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_L}
            alt=""
            draggable={false}
            className="ct-float relative h-[clamp(320px,46vw,640px)] w-auto max-w-none -translate-x-[22%] select-none opacity-60 drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)] xl:-translate-x-[8%] xl:opacity-100"
          />
        </div>
      </div>

      <div
        ref={rightRef}
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 z-[1] hidden will-change-transform md:block"
      >
        <div
          className="relative"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateX(0)" : "translateX(80px)",
            transition: `opacity 1s ease-out 0.55s, transform 1.2s ${EASE} 0.55s`,
          }}
        >
          <div className="ct-pulse absolute left-1/2 top-1/3 h-[70%] w-[90%] -translate-x-1/2 rounded-full bg-red-500/25 blur-3xl" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_R}
            alt=""
            draggable={false}
            className="ct-float relative h-[clamp(320px,46vw,640px)] w-auto max-w-none translate-x-[22%] select-none opacity-60 drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)] [animation-delay:-3s] xl:translate-x-[8%] xl:opacity-100"
          />
        </div>
      </div>

      {/* ============ CONTENT ============ */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-20 sm:px-6 sm:pt-24 md:pb-20 md:pt-28 lg:px-8">
        {/* Heading */}
        <header className="relative mx-auto mb-10 max-w-3xl text-center md:mb-14">
          <span
            ref={cRef}
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 select-none font-serif text-[9rem] leading-none text-nav-right-heading/10 sm:text-[13rem]"
            style={{ transform: "translate(-50%, -50%)" }}
          >
            C
          </span>

          <div
            className="relative mb-4 inline-flex items-center gap-2 rounded-full border border-nav-right-line bg-black/30 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] backdrop-blur-md"
            style={rise(0)}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Contact
          </div>

          <h2
            aria-label={HEADING}
            className="relative m-0 font-serif text-[clamp(1.7rem,4.6vw,3.4rem)] font-bold uppercase leading-[1.08] tracking-wide"
          >
            {words.map((w, i) => (
              <span key={i} aria-hidden className="inline-block overflow-hidden py-1 pr-[0.28em] align-bottom">
                <span
                  className="block"
                  style={{
                    transform: inView ? "translateY(0)" : "translateY(115%)",
                    transition: `transform 1s ${EASE}`,
                    transitionDelay: inView ? `${0.15 + i * 0.07}s` : "0s",
                  }}
                >
                  {w}
                </span>
              </span>
            ))}
          </h2>

     

        </header>

        {/* Grid: info + form */}
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          {/* ---------- INFO ---------- */}
          <aside className="flex flex-col gap-4 lg:col-span-4">
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {INFO.map((it, i) => {
                const Wrap = it.href ? "a" : "div";
                return (
                  <div key={it.title} style={rise(0.6 + i * 0.12)}>
                    <Wrap
                      {...(it.href ? { href: it.href } : {})}
                      className="group relative flex h-full items-start gap-4 overflow-hidden rounded-xl border border-nav-right-line bg-black/30 p-4 text-inherit no-underline backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-accent/70 hover:bg-black/45 hover:shadow-[0_18px_40px_-16px_var(--accent)]"
                    >
                      <span
                        aria-hidden
                        className="absolute bottom-0 left-0 top-0 w-1 origin-top scale-y-0 bg-accent transition-transform duration-300 group-hover:scale-y-100"
                      />
                      <span
                        aria-hidden
                        className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/10 transition-transform duration-700 group-hover:translate-x-[520%]"
                      />
                      <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent text-accent-fg transition-transform duration-500 group-hover:rotate-[360deg]">
                        <Icon name={it.icon} className="h-5 w-5" />
                      </span>
                      <span className="relative min-w-0">
                        <span className="block font-serif text-xs font-semibold uppercase tracking-[0.2em] text-nav-right-heading">
                          {it.title}
                        </span>
                        {it.lines.map((l) => (
                          <span
                            key={l}
                            className="mt-1 block break-words text-sm leading-snug text-nav-right-text"
                          >
                            {l}
                          </span>
                        ))}
                      </span>
                    </Wrap>
                  </div>
                );
              })}
            </div>

            {/* socials */}
            <div
              className="rounded-xl border border-nav-right-line bg-black/30 p-4 backdrop-blur-md"
              style={rise(1.0)}
            >
              <p className="m-0 mb-3 font-serif text-xs font-semibold uppercase tracking-[0.2em]">
                Follow the universe
              </p>
              <div className="flex flex-wrap gap-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-nav-right-line px-3 py-1.5 text-[11px] uppercase tracking-[0.14em] text-nav-right-text no-underline transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-accent-fg"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </aside>

          {/* ---------- FORM PANEL ---------- */}
          <div className="relative lg:col-span-8" style={rise(0.5)}>
            {/* character peeking above the panel on small screens */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO_L}
              alt=""
              draggable={false}
              className="ct-float pointer-events-none absolute -top-20 right-3 z-0 h-28 w-auto select-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] md:hidden"
            />

            <div
              ref={panelRef}
              onPointerMove={onPanelMove}
              className={`relative z-10 overflow-hidden rounded-2xl border border-nav-right-line bg-black/40 p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-8 ${
                shake ? "ct-shake" : ""
              }`}
            >
              {/* cursor spotlight */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-70"
                style={{
                  background:
                    "radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), color-mix(in srgb, var(--accent) 16%, transparent), transparent 60%)",
                }}
              />
              {/* accent corner brackets */}
              {[
                "left-2 top-2 border-l-2 border-t-2",
                "right-2 top-2 border-r-2 border-t-2",
                "left-2 bottom-2 border-l-2 border-b-2",
                "right-2 bottom-2 border-r-2 border-b-2",
              ].map((c) => (
                <span
                  key={c}
                  aria-hidden
                  className={`pointer-events-none absolute h-4 w-4 border-accent ${c}`}
                />
              ))}

              {status === "sent" ? (
                /* ---------- SUCCESS ---------- */
                <div
                  key="sent"
                  className="relative flex min-h-[420px] flex-col items-center justify-center text-center"
                >
                  <div className="relative mb-6 grid place-items-center">
                    {Array.from({ length: 14 }, (_, i) => {
                      const a = (i / 14) * Math.PI * 2;
                      const r = 90 + (i % 3) * 30;
                      return (
                        <span
                          key={i}
                          aria-hidden
                          className="ct-burst absolute h-2 w-2 rounded-full bg-accent"
                          style={
                            {
                              "--tx": `${Math.cos(a) * r}px`,
                              "--ty": `${Math.sin(a) * r}px`,
                            } as React.CSSProperties
                          }
                        />
                      );
                    })}
                    <span className="ct-pop grid h-24 w-24 place-items-center rounded-full border-2 border-accent bg-accent/15 shadow-[0_0_40px_var(--accent)]">
                      <svg viewBox="0 0 24 24" className="h-12 w-12 text-accent" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path className="ct-draw" d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                    </span>
                  </div>
                  <h3 className="m-0 font-serif text-2xl font-bold uppercase tracking-wide sm:text-3xl">
                    Message sent
                  </h3>
                  <p className="mx-auto mb-0 mt-3 max-w-sm text-sm leading-relaxed text-nav-right-text">
                    Thank you, {values.name.split(" ")[0] || "friend"}. The Warrior Comics team will get
                    back to you soon.
                  </p>
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-7 cursor-pointer rounded-full border border-nav-right-ring bg-transparent px-6 py-2.5 font-serif text-[11px] uppercase tracking-[0.2em] text-nav-right-heading transition-all duration-300 hover:border-accent hover:bg-accent hover:text-accent-fg"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                /* ---------- FORM ---------- */
                <form key="form" onSubmit={submit} noValidate className="relative">
                  <div className="mb-6 flex items-center justify-between gap-3">
                    <p className="m-0 font-serif text-xs font-semibold uppercase tracking-[0.25em] text-nav-right-heading">
                      Project brief
                    </p>
                    <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-nav-right-text">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                      Open for projects
                    </span>
                  </div>

                  <div className="grid gap-x-5 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                    <Field
                      id="name"
                      label="Name"
                      icon="user"
                      value={values.name}
                      error={errors.name}
                      onChange={set("name")}
                      autoComplete="name"
                    />
                    <Field
                      id="email"
                      label="Email"
                      icon="mail"
                      type="email"
                      value={values.email}
                      error={errors.email}
                      onChange={set("email")}
                      autoComplete="email"
                    />
                    <div className="sm:col-span-2 lg:col-span-1">
                      <Field
                        id="phone"
                        label="Phone"
                        icon="phone"
                        type="tel"
                        value={values.phone}
                        error={errors.phone}
                        onChange={set("phone")}
                        autoComplete="tel"
                        optional
                      />
                    </div>
                    <div className="sm:col-span-2 lg:col-span-3">
                      <Field
                        id="message"
                        label="Tell us about your project"
                        icon="chat"
                        textarea
                        maxLength={600}
                        value={values.message}
                        error={errors.message}
                        onChange={set("message")}
                      />
                      <p className="m-0 mt-1 text-right text-[10px] tracking-[0.15em] text-nav-right-text/60">
                        {values.message.length} / 600
                      </p>
                    </div>
                  </div>

                  {status === "error" && (
                    <p className="m-0 mt-2 rounded-lg border border-red-400/50 bg-red-500/10 px-3 py-2 text-xs text-red-200" role="alert">
                      Something went wrong. Please try again, or email us at {EMAIL}.
                    </p>
                  )}

                  <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                    <p className="m-0 text-center text-[11px] text-nav-right-text/70 sm:text-left">
                      Your details are only used to reply to your message.
                    </p>
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="group/btn relative inline-flex min-w-[190px] cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full border-none bg-accent px-8 py-3.5 font-serif text-xs uppercase tracking-[0.2em] text-accent-fg shadow-[0_10px_30px_-10px_var(--accent)] transition-all duration-300 hover:scale-[1.04] active:scale-95 disabled:cursor-wait disabled:opacity-90"
                    >
                      {status === "sending" ? (
                        <>
                          <span
                            aria-hidden
                            className="h-4 w-4 rounded-full border-2 border-accent-fg/30 border-t-accent-fg"
                            style={{ animation: "ctSpinner 0.7s linear infinite" }}
                          />
                          <span className="relative z-10">Sending</span>
                        </>
                      ) : (
                        <>
                          <span className="relative z-10">Submit</span>
                          <Icon
                            name="send"
                            className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-1"
                          />
                        </>
                      )}
                      <span
                        aria-hidden
                        className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/40 transition-transform duration-700 group-hover/btn:translate-x-[420%]"
                      />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============ MARQUEE STRIP ============ */}
      <div className="relative z-20 overflow-hidden border-y border-nav-right-line bg-black/50 py-3 backdrop-blur-sm">
        <div className="ct-marquee flex w-max whitespace-nowrap font-serif text-xs uppercase tracking-[0.3em] text-nav-right-text sm:text-sm">
          <span className="pr-0">{MARQUEE.repeat(6)}</span>
          <span aria-hidden>{MARQUEE.repeat(6)}</span>
        </div>
      </div>
    </section>
  );
}