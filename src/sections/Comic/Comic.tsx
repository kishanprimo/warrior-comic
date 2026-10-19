"use client";
/* eslint-disable @next/next/no-img-element */

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* ---------------- Content ---------------- */
const AVATAR_BASE = "/images/Avtar";
const LOGO_BASE = "/images/Imgs";        // WC logo lives with the other site logos
const LOGO = `${LOGO_BASE}/Logo.png`;
const IMG = {
  avatarman: `${AVATAR_BASE}/avtarman1.png`,   // no dash
  sentor:    `${AVATAR_BASE}/sentor-1.png`,
  doctor:    `${AVATAR_BASE}/doctor-1.png`,
  merlyn:    `${AVATAR_BASE}/Merlyn-1.png`,    // capital M
  petra:     `${AVATAR_BASE}/petraB.png`,      // capital B
  ange:      `${AVATAR_BASE}/ange-guru-1.png`,
};
const ICO_HREF = "https://warriortoken.com/";

/* ---------------- Background war scenes ---------------- */
const BG_EXT = "png";
type Scene = { src: string; rot: number };
const WAR_SCENES: Scene[] = [
  { src: `/images/Imgs/bg1.${BG_EXT}`, rot: 0 },
  { src: `/images/Imgs/bg2.${BG_EXT}`, rot: 0 },
  { src: `/images/Imgs/bg3.${BG_EXT}`, rot: 0 },
];

/* ---------------- Geometry / motion ---------------- */
const PW = 480, PH = 680, STRIPS = 14, SW = PW / STRIPS;
const BEND = 78; // bigger = more visible page curve
const MAX_LEAVES = 8;
const SPRING_K = 28; // lower = slower, gentler flip
const SPRING_D = 2 * Math.sqrt(SPRING_K);
const HINT_IDLE = 2500; // ms after user input before hints resume
const HINT_EVERY = 1500; // ms between corner hints (lower = faster)
const HINT_LIFT = 650; // ms a corner stays lifted
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const DISPLAY: React.CSSProperties = {
  fontFamily: "Impact, Haettenschweiler, 'Franklin Gothic Heavy', 'Arial Narrow Bold', sans-serif",
};
const HIDE_BACK: React.CSSProperties = { backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" };
const HALFTONE: React.CSSProperties = {
  backgroundImage: "radial-gradient(rgba(0,0,0,0.09) 1px, transparent 1.5px)",
  backgroundSize: "6px 6px",
};
const HALFTONE_LIGHT: React.CSSProperties = {
  backgroundImage: "radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1.6px)",
  backgroundSize: "7px 7px",
};

/* ---------------- Grass ---------------- */
function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function grassPath(w: number, h: number, seed: number, step: number, minH: number, maxH: number) {
  const r = rng(seed);
  let d = `M0 ${h}`;
  for (let x = 0; x <= w; x += step) {
    const bh = h * (minH + r() * (maxH - minH));
    const lean = (r() - 0.5) * step * 2.4;
    d += ` L${x.toFixed(1)} ${(h - bh * 0.35).toFixed(1)}`;
    d += ` L${(x + step * 0.5 + lean).toFixed(1)} ${(h - bh).toFixed(1)}`;
    d += ` L${(x + step * 0.82).toFixed(1)} ${(h - bh * 0.3).toFixed(1)}`;
  }
  return `${d} L${w} ${h} Z`;
}
const GRASS_BACK = grassPath(1600, 200, 11, 7, 0.35, 0.8);
const GRASS_FRONT = grassPath(1600, 200, 29, 5, 0.18, 0.55);

const burstPoints = (spikes: number, outer: number, inner: number) =>
  Array.from({ length: spikes * 2 }, (_, i) => {
    const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? outer : inner;
    return `${(100 + Math.cos(a) * r).toFixed(1)},${(100 + Math.sin(a) * r).toFixed(1)}`;
  }).join(" ");
const BURST = burstPoints(14, 98, 70);

const STARS_BG: React.CSSProperties = {
  backgroundImage: [
    "radial-gradient(1.5px 1.5px at 8% 12%, #fff 50%, transparent 52%)",
    "radial-gradient(1px 1px at 19% 28%, #fff 50%, transparent 52%)",
    "radial-gradient(1.5px 1.5px at 33% 8%, #fff 50%, transparent 52%)",
    "radial-gradient(1px 1px at 47% 22%, #fff 50%, transparent 52%)",
    "radial-gradient(1.5px 1.5px at 61% 10%, #fff 50%, transparent 52%)",
    "radial-gradient(1px 1px at 74% 30%, #fff 50%, transparent 52%)",
    "radial-gradient(1.5px 1.5px at 86% 14%, #fff 50%, transparent 52%)",
    "radial-gradient(1px 1px at 93% 34%, #fff 50%, transparent 52%)",
  ].join(","),
  opacity: 0.7,
};

const RAYS: React.CSSProperties = {
  backgroundImage: "repeating-conic-gradient(from 0deg at 50% 46%, rgba(255,210,120,0.22) 0deg 5deg, transparent 5deg 12deg)",
  WebkitMaskImage: "radial-gradient(circle at 50% 46%, #000 0%, transparent 72%)",
  maskImage: "radial-gradient(circle at 50% 46%, #000 0%, transparent 72%)",
};

/* ---------------- Little art ---------------- */
function Swords({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className={className}>
      <path d="M10 10 L44 44" /><path d="M54 10 L20 44" />
      <path d="M38 50l10 10M26 50L16 60" /><path d="M6 38l10 10M58 38L48 48" />
    </svg>
  );
}
function Burst({ text, className = "" }: { text: string; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 200 200" className={className}>
      <polygon points={BURST} fill="#ffd23f" stroke="#111" strokeWidth="6" strokeLinejoin="round" />
      <text x="100" y="116" textAnchor="middle" fontSize="46" fill="#d41f2f" stroke="#111" strokeWidth="2" style={DISPLAY}>{text}</text>
    </svg>
  );
}
function Grass({ d, fill, className }: { d: string; fill: string; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 1600 200" preserveAspectRatio="none" className={className}>
      <path d={d} fill={fill} />
    </svg>
  );
}

/* ---------------- Paper ---------------- */
function Paper({ side, num, tone = "paper", children }: { side: "left" | "right"; num?: string; tone?: "paper" | "dark" | "crimson"; children?: React.ReactNode }) {
  const bg = tone === "paper" ? "#f3ecdd" : tone === "dark" ? "linear-gradient(160deg,#10204a 0%,#070d1f 70%)" : "linear-gradient(160deg,#5a1040 0%,#14040d 78%)";
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: bg, color: tone === "paper" ? "#15151a" : "#fff" }}>
      <div className="absolute inset-0" style={tone === "paper" ? HALFTONE : HALFTONE_LIGHT} />
      {children}
      {num && (
        <span style={DISPLAY} className={`absolute bottom-4 text-[15px] tracking-[0.2em] ${side === "left" ? "left-7" : "right-7"} ${tone === "paper" ? "text-black/55" : "text-white/55"}`}>{num}</span>
      )}
    </div>
  );
}
function CharPanel({ src, tint, className, imgClass = "h-[104%]" }: { src: string; tint: string; className: string; imgClass?: string }) {
  return (
    <div className={`absolute overflow-hidden border-[5px] border-black ${className}`} style={{ background: tint }}>
      <div className="absolute inset-0" style={HALFTONE_LIGHT} />
      <img src={src} alt="" draggable={false} className={`absolute bottom-0 left-1/2 w-auto max-w-none -translate-x-1/2 object-contain ${imgClass}`} style={{ filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.5))" }} />
    </div>
  );
}
function Caption({ name, text, className = "" }: { name: string; text: string; className?: string }) {
  return (
    <div className={className}>
      <p style={DISPLAY} className="m-0 text-[21px] uppercase leading-[1.05] tracking-wide text-[#d41f2f]">{name}</p>
      <p className="mb-0 mt-1.5 text-[12.5px] leading-snug text-[#15151a]/85">{text}</p>
    </div>
  );
}

/* ---------------- Pages ---------------- */
type Face = { side: "cover" | "left" | "right" | "back" | "blank"; node: React.ReactNode };

const P_COVER: Face = {
  side: "cover",
  node: (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "linear-gradient(180deg,#0b0614 0%,#2a0b30 24%,#6d1347 50%,#b3203f 74%,#d0432f 88%,#1a0710 100%)" }}>
      <div className="absolute inset-0" style={STARS_BG} />
      <div className="absolute inset-0" style={RAYS} />
      <div className="absolute inset-0" style={HALFTONE_LIGHT} />
      <div className="absolute left-1/2 top-[46%] h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(circle, rgba(255,214,130,0.65) 0%, rgba(255,90,100,0.28) 45%, transparent 70%)" }} />
      <img src={IMG.avatarman} alt="" draggable={false} className="absolute bottom-[5%] left-1/2 h-[72%] w-auto max-w-none -translate-x-1/2 object-contain" style={{ filter: "drop-shadow(0 0 28px rgba(255,170,90,0.6)) drop-shadow(0 10px 14px rgba(0,0,0,0.6))" }} />
      <Grass d={GRASS_BACK} fill="#1a0a14" className="absolute inset-x-0 bottom-0 h-[17%] w-full" />
      <Grass d={GRASS_FRONT} fill="#07030a" className="absolute inset-x-0 bottom-0 h-[11%] w-full" />

      {/* top banner */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-black/55 px-6 py-2 text-[#ffd23f]" style={DISPLAY}>
        <span className="text-[12px] tracking-[0.35em]">WC UNIVERSE</span>
        <img src={LOGO} alt="" draggable={false} className="h-8 w-auto object-contain" />
        <span className="text-[12px] tracking-[0.35em]">FIRST ISSUE</span>
      </div>

      <div className="absolute inset-x-0 top-[70px] text-center">
        <p style={{ ...DISPLAY, WebkitTextStroke: "2px #111", textShadow: "5px 5px 0 #d41f2f, 9px 9px 0 rgba(0,0,0,0.4)" }} className="m-0 text-[80px] leading-none tracking-wide text-white">WC-COMICS</p>
        {/* <div style={DISPLAY} className="mx-auto mt-3 inline-block -skew-x-12 border-[3px] border-black bg-[#ffd23f] px-6 py-0.5 text-[16px] tracking-[0.4em] text-black shadow-[4px_4px_0_#000]">ISSUE #01</div> */}
      </div>

      <Burst text="NEW!" className="absolute right-3 top-[26%] w-[104px] rotate-[14deg]" />

      <div style={DISPLAY} className="absolute bottom-[8%] left-1/2 -translate-x-1/2 -rotate-[6deg] whitespace-nowrap border-4 border-white bg-[#d41f2f] px-6 py-1 text-[32px] tracking-[0.16em] text-white shadow-[6px_6px_0_rgba(0,0,0,0.5)]">COMING SOON</div>
      <p style={DISPLAY} className="absolute inset-x-0 bottom-2 m-0 text-center text-[10px] tracking-[0.4em] text-white/60">RESPECTING CREATIVITY</p>
    </div>
  ),
};
const P_INTRO: Face = {
  side: "left",
  node: (
    <Paper side="left" num="01">
      <div className="absolute inset-0 flex flex-col p-9">
        <div className="flex items-center gap-3 text-[#d41f2f]"><Swords /><span style={DISPLAY} className="text-[14px] tracking-[0.35em]">WC UNIVERSE</span></div>
        <h3 style={DISPLAY} className="m-0 mt-7 text-[42px] uppercase leading-[1.02] text-[#15151a]">Stories that connect to your inner space.</h3>
        <p style={DISPLAY} className="m-0 mt-5 text-[25px] uppercase leading-[1.1] text-[#d41f2f]">Stories that will unfold your craving to be much more than a normal human are coming soon.</p>
        <div className="mt-auto border-l-[5px] border-[#d41f2f] pl-4">
          <p className="m-0 text-[13.5px] leading-relaxed text-[#15151a]/85">Virtual Heroes, Villains, Queens, Emperors, Powers, Wars, and an astonishing Empire. An open world for creators who believe in <b>respecting creativity</b>.</p>
        </div>
      </div>
    </Paper>
  ),
};
const P_AVATAR: Face = {
  side: "right",
  node: (
    <Paper side="right" num="02" tone="dark">
      <div className="absolute inset-[22px] overflow-hidden border-[5px] border-black bg-[radial-gradient(circle_at_50%_62%,#2a5bb8_0%,#10204a_55%,#070d1f_100%)]">
        <div className="absolute inset-0" style={HALFTONE_LIGHT} />
        <img src={IMG.avatarman} alt="" draggable={false} className="absolute bottom-0 left-1/2 h-[96%] w-auto max-w-none -translate-x-1/2 object-contain" style={{ filter: "drop-shadow(0 0 22px rgba(120,200,255,0.5))" }} />
        <div className="absolute left-3 top-3 max-w-[62%] border-[3px] border-black bg-[#ffd23f] px-3 py-2 text-black">
          <p style={DISPLAY} className="m-0 text-[22px] uppercase leading-none tracking-wide">Avatarman</p>
          <p className="mb-0 mt-1 text-[12px] font-semibold leading-snug">aka Maxwell Meronius, the youngest member of the council of 9.</p>
        </div>
        <Burst text="SOON!" className="absolute -right-4 top-[30%] w-[150px] rotate-[12deg]" />
      </div>
    </Paper>
  ),
};
const P_SENTOR: Face = {
  side: "left",
  node: (
    <Paper side="left" num="03">
      <CharPanel src={IMG.sentor} tint="radial-gradient(circle at 50% 70%, #1f7fb0 0%, #0c2a4d 60%, #070d1f 100%)" className="left-[22px] right-[22px] top-[22px] h-[430px]" />
      <div className="absolute inset-x-[26px] bottom-[44px] top-[470px]">
        <Caption name="Sentor" text="An enemy of Avatarman with technological and semi magical skills, equally powerful. His cube is his power." />
      </div>
    </Paper>
  ),
};
const P_ROYALS: Face = {
  side: "right",
  node: (
    <Paper side="right" num="04">
      <CharPanel src={IMG.merlyn} tint="radial-gradient(circle at 50% 70%, #8a5a1c 0%, #3b1f0b 65%, #14080a 100%)" className="left-[22px] top-[22px] h-[390px] w-[205px]" />
      <CharPanel src={IMG.petra} tint="radial-gradient(circle at 50% 70%, #a02a62 0%, #4b0f3a 65%, #14040d 100%)" className="right-[22px] top-[22px] h-[390px] w-[205px]" />
      <Caption name="Merlyn Meronius" text="An emperor and father of Avatarman. Regal and modest." className="absolute left-[24px] top-[428px] w-[205px]" />
      <Caption name="Petra Meronius" text="A Queen and mother of Avatarman." className="absolute right-[24px] top-[428px] w-[205px]" />
    </Paper>
  ),
};
const P_ALLIES: Face = {
  side: "left",
  node: (
    <Paper side="left" num="05">
      <CharPanel src={IMG.doctor} tint="radial-gradient(circle at 50% 70%, #1d5aa0 0%, #0c2347 65%, #070d1f 100%)" className="left-[22px] top-[22px] h-[390px] w-[205px]" />
      <CharPanel src={IMG.ange} tint="radial-gradient(circle at 50% 70%, #1f8f7a 0%, #0b3a3a 65%, #06141a 100%)" className="right-[22px] top-[22px] h-[390px] w-[205px]" />
      <Caption name="Doctor Handel Von Neumann" text="Stylish, intelligent and very professional." className="absolute left-[24px] top-[428px] w-[205px]" />
      <Caption name="Ange Apollo" text="Avatarman's advisor cum Guru." className="absolute right-[24px] top-[428px] w-[205px]" />
    </Paper>
  ),
};
const P_SOON: Face = {
  side: "right",
  node: (
    <Paper side="right" num="06" tone="crimson">
      <Swords className="absolute -right-8 top-24 h-[300px] w-[300px] rotate-[10deg] text-white/[0.07]" />
      <div className="absolute inset-0 flex flex-col p-9">
        <p style={DISPLAY} className="m-0 text-[14px] tracking-[0.35em] text-[#ffd23f]">CHAPTER ONE</p>
        <h3 style={DISPLAY} className="m-0 mt-4 text-[44px] uppercase leading-[1.02] text-white">Brand new characters and thrilling stories!</h3>
        <p className="mb-0 mt-5 text-[14px] leading-relaxed text-white/85">Whom will they be fighting and what would be their purpose? Answers will be provided in the comic one by one.</p>
        <div className="mt-auto flex flex-col items-start gap-5 pb-7">
          <div style={DISPLAY} className="-rotate-[5deg] border-4 border-white bg-[#d41f2f] px-5 py-1 text-[30px] tracking-[0.16em] text-white shadow-[5px_5px_0_rgba(0,0,0,0.5)]">COMING SOON</div>
          <a href="/signup" style={DISPLAY} className="inline-block border-[3px] border-black bg-[#ffd23f] px-6 py-2 text-[18px] uppercase tracking-[0.14em] text-black no-underline shadow-[4px_4px_0_#000]">Notify me</a>
        </div>
      </div>
    </Paper>
  ),
};
const P_BACK: Face = {
  side: "back",
  node: (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "linear-gradient(180deg,#14040d 0%,#4b0f3a 55%,#a3203d 90%)" }}>
      <div className="absolute inset-0" style={STARS_BG} />
      <div className="absolute inset-0" style={RAYS} />
      <div className="absolute inset-0" style={HALFTONE_LIGHT} />
      <div className="absolute left-1/2 top-[34%] h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(circle, rgba(255,214,130,0.35) 0%, transparent 68%)" }} />
      <Swords className="absolute -left-10 top-[44%] h-[260px] w-[260px] -rotate-[12deg] text-white/[0.06]" />

      <div className="absolute inset-0 flex flex-col items-center px-10 pt-16 text-center text-white">
        <div className="border-[3px] border-[#ffd23f]/70 bg-black/40 p-3">
          <img src={LOGO} alt="Warrior Comics" draggable={false} className="h-14 w-auto object-contain" />
        </div>
        <p style={{ ...DISPLAY, textShadow: "4px 4px 0 #d41f2f" }} className="m-0 mt-8 text-[42px] uppercase leading-[1.03] tracking-wide">Respecting creativity</p>
        <div className="mt-4 flex items-center gap-3 text-[#ffd23f]"><span className="h-px w-14 bg-[#ffd23f]/60" /><Swords className="h-6 w-6" /><span className="h-px w-14 bg-[#ffd23f]/60" /></div>
        <p className="mb-0 mt-4 max-w-[300px] text-[15px] leading-relaxed text-white/85">Participate in token sale. Track our ICO here.</p>
        <a href={ICO_HREF} target="_blank" rel="noreferrer" style={DISPLAY} className="mt-7 inline-block border-[3px] border-black bg-[#ffd23f] px-9 py-2.5 text-[20px] uppercase tracking-[0.16em] text-black no-underline shadow-[5px_5px_0_#000]">Our ICO</a>
        <p style={DISPLAY} className="m-0 mt-6 -rotate-[3deg] border-2 border-white/70 px-4 py-0.5 text-[14px] tracking-[0.3em] text-white/80">ISSUE #02 — COMING</p>
      </div>

      {/* barcode box */}
      <div className="absolute bottom-[18%] right-6 bg-white px-3 pb-1 pt-2 text-black">
        <div className="h-9 w-24" style={{ backgroundImage: "repeating-linear-gradient(90deg,#000 0 2px,#fff 2px 4px,#000 4px 5px,#fff 5px 8px,#000 8px 11px,#fff 11px 12px)" }} />
        <p style={DISPLAY} className="m-0 mt-0.5 text-center text-[9px] tracking-[0.2em]">WC-0001</p>
      </div>
      <p className="absolute bottom-[18%] left-6 m-0 text-[10px] leading-snug text-white/60">© 2026 Warrior Comics Inc.<br />All rights reserved.</p>

      <Grass d={GRASS_BACK} fill="#1a0a14" className="absolute inset-x-0 bottom-0 h-[16%] w-full" />
      <Grass d={GRASS_FRONT} fill="#07030a" className="absolute inset-x-0 bottom-0 h-[10%] w-full" />
    </div>
  ),
};
const P_BLANK: Face = { side: "blank", node: <Paper side="left" /> };
const PAGES: Face[] = [P_COVER, P_INTRO, P_AVATAR, P_SENTOR, P_ROYALS, P_ALLIES, P_SOON, P_BACK];

/* Rounded outer corners + rim + paper depth, per face */
function FaceView({ face }: { face: Face }) {
  const onLeft = face.side === "left" || face.side === "back" || face.side === "blank";
  const hard = face.side === "cover" || face.side === "back";
  const r = hard ? 10 : 4;
  const radius = onLeft ? `${r}px 0 0 ${r}px` : `0 ${r}px ${r}px 0`;
  const dir = onLeft ? "to left" : "to right";
  return (
    <div style={{ position: "relative", width: PW, height: PH, overflow: "hidden", borderRadius: radius }}>
      {face.node}
      {/* gutter shadow next to the spine */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: `linear-gradient(${dir}, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.14) 5%, transparent 13%)` }} />
      {/* rim / paper depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: radius,
          boxShadow: hard
            ? "inset 0 0 0 3px rgba(0,0,0,0.45), inset 0 0 0 5px rgba(255,210,63,0.35), inset 0 0 40px rgba(0,0,0,0.35)"
            : "inset 0 0 0 1px rgba(0,0,0,0.18), inset 0 0 36px rgba(90,60,20,0.16)",
        }}
      />
    </div>
  );
}

/* ---------------- Leaf ---------------- */
type LeafDef = { front: Face; back: Face };
type ApplyFn = (p: number) => void;
const SHADE: React.CSSProperties = { position: "absolute", inset: 0, background: "#000", opacity: 0, pointerEvents: "none" };
type StripRefs = {
  strips: React.MutableRefObject<(HTMLDivElement | null)[]>;
  shF: React.MutableRefObject<(HTMLDivElement | null)[]>;
  shB: React.MutableRefObject<(HTMLDivElement | null)[]>;
};
function StripNode({ j, front, back, refs }: { j: number; front: React.ReactNode; back: React.ReactNode; refs: StripRefs }) {
  const last = j === STRIPS - 1;
  const fw = last ? SW : SW + 1;
  return (
    <div ref={(el) => { refs.strips.current[j] = el; }} style={{ position: "absolute", top: 0, left: j === 0 ? 0 : SW, width: fw, height: PH, transformOrigin: "0 50%", transformStyle: "preserve-3d" }}>
      <div style={{ ...HIDE_BACK, position: "absolute", inset: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: -j * SW, top: 0, width: PW, height: PH }}>{front}</div>
        <div ref={(el) => { refs.shF.current[j] = el; }} style={SHADE} />
      </div>
      <div style={{ ...HIDE_BACK, position: "absolute", inset: 0, overflow: "hidden", transform: "rotateY(180deg)" }}>
        <div style={{ position: "absolute", left: -(PW - (j * SW + fw)), top: 0, width: PW, height: PH }}>{back}</div>
        <div ref={(el) => { refs.shB.current[j] = el; }} style={SHADE} />
      </div>
      {!last && <StripNode j={j + 1} front={front} back={back} refs={refs} />}
    </div>
  );
}
function Leaf({ index, total, def, curl, double, register, getP }: { index: number; total: number; def: LeafDef; curl: boolean; double: boolean; register: (i: number, fn: ApplyFn | undefined) => void; getP: () => number }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const strips = useRef<(HTMLDivElement | null)[]>([]);
  const shF = useRef<(HTMLDivElement | null)[]>([]);
  const shB = useRef<(HTMLDivElement | null)[]>([]);
  const front = useMemo(() => <FaceView face={def.front} />, [def.front]);
  const back = useMemo(() => <FaceView face={def.back} />, [def.back]);

  const apply: ApplyFn = (p) => {
    const root = rootRef.current;
    if (!root) return;
    const theta = -180 * p;
    root.style.transform = `rotateY(${theta}deg)`;
    root.style.zIndex = String(p <= 0.0005 ? total - index : p >= 0.9995 ? index : 200);
    root.style.visibility = !double && p >= 0.9995 ? "hidden" : "visible";
    const n = curl ? STRIPS : 1;
    const d = curl ? -(BEND * Math.pow(Math.sin(Math.PI * p), 0.85)) / STRIPS : 0;
    let cum = theta;
    for (let j = 0; j < n; j++) {
      if (j > 0) { cum += d; const s = strips.current[j]; if (s) s.style.transform = `rotateY(${d}deg)`; }
      const dark = 0.5 * Math.pow(1 - Math.abs(Math.cos((cum * Math.PI) / 180)), 1.1);
      const f = shF.current[j]; const b = shB.current[j];
      if (f) f.style.opacity = dark.toFixed(3);
      if (b) b.style.opacity = dark.toFixed(3);
    }
  };
  useIsoLayoutEffect(() => { register(index, apply); apply(getP()); return () => register(index, undefined); });

  return (
    <div ref={rootRef} style={{ position: "absolute", left: 0, top: -PH / 2, width: PW, height: PH, transformOrigin: "0 50%", transformStyle: "preserve-3d" }}>
      {curl ? (
        <StripNode j={0} front={front} back={back} refs={{ strips, shF, shB }} />
      ) : (
        <>
          <div style={{ ...HIDE_BACK, position: "absolute", inset: 0, overflow: "hidden" }}>
            {front}<div ref={(el) => { shF.current[0] = el; }} style={SHADE} />
          </div>
          <div style={{ ...HIDE_BACK, position: "absolute", inset: 0, overflow: "hidden", transform: "rotateY(180deg)" }}>
            {back}<div ref={(el) => { shB.current[0] = el; }} style={SHADE} />
          </div>
        </>
      )}
    </div>
  );
}
function Corner({ side, on }: { side: "L" | "R"; on: boolean }) {
  const R = side === "R";
  const s = on ? 110 : 0;
  return (
    <div
      style={{
        position: "absolute", bottom: 0, [R ? "right" : "left"]: 0, width: s, height: s,
        transition: on
          ? "width 650ms cubic-bezier(0.4,0,0.2,1), height 650ms cubic-bezier(0.4,0,0.2,1)"
          : "width 160ms ease-in, height 160ms ease-in",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#b9ae96 0%,#8d846f 100%)", clipPath: R ? "polygon(100% 0, 100% 100%, 0 100%)" : "polygon(0 0, 100% 100%, 0 100%)" }} />
      <div style={{ position: "absolute", inset: 0, filter: `drop-shadow(${R ? "-4px" : "4px"} -4px 6px rgba(0,0,0,0.45))` }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#fffaf0 0%,#e8dfca 55%,#c4b99f 100%)", clipPath: R ? "polygon(0 0, 100% 0, 0 100%)" : "polygon(0 0, 100% 0, 100% 100%)" }} />
      </div>
    </div>
  );
}

/* ================================================================== */
export default function Comic() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const shadeR = useRef<HTMLDivElement>(null);
  const shadeL = useRef<HTMLDivElement>(null);
  const edgeR = useRef<HTMLDivElement>(null);
  const edgeL = useRef<HTMLDivElement>(null);
  const spineRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  const [double, setDouble] = useState(true);
  const [index, setIndex] = useState(0);
  const [curl, setCurl] = useState<boolean[]>(() => Array(MAX_LEAVES).fill(false));
  const [inView, setInView] = useState(false);
  const [hint, setHint] = useState<"" | "L" | "R">(""); // which corner is lifted

  const cur = useRef<number[]>(Array(MAX_LEAVES).fill(0));
  const tgt = useRef<number[]>(Array(MAX_LEAVES).fill(0));
  const vel = useRef<number[]>(Array(MAX_LEAVES).fill(0));
  const applied = useRef<number[]>(Array(MAX_LEAVES).fill(-1));
  const curlFlags = useRef<boolean[]>(Array(MAX_LEAVES).fill(false));
  const apis = useRef<(ApplyFn | undefined)[]>([]);
  const idxRef = useRef(0);
  const scaleS = useRef(1);
  const scaleD = useRef(1);
  const dblRef = useRef(true);
  const lastAct = useRef(0); // last user interaction time
  const gesture = useRef<{ x0: number; y0: number; lastX: number; lastT: number; vx: number; leaf: number; dir: 1 | -1; moved: number } | null>(null);

  const L = double ? 4 : MAX_LEAVES;
  const maxI = double ? 4 : MAX_LEAVES - 1;
  dblRef.current = double;

  const leaves: LeafDef[] = useMemo(
    () => (double ? Array.from({ length: 4 }, (_, i) => ({ front: PAGES[2 * i], back: PAGES[2 * i + 1] })) : PAGES.map((p) => ({ front: p, back: P_BLANK }))),
    [double]
  );
  const register = useCallback((i: number, fn: ApplyFn | undefined) => { apis.current[i] = fn; }, []);

  /* ---------------- FIT: whole book visible with a little breathing room ---------------- */
  useIsoLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      const aw = el.clientWidth * 0.94;
      const ah = el.clientHeight * 0.94;
      const dbl = el.clientWidth >= 760;
      scaleS.current = Math.min(aw / PW, ah / PH);
      scaleD.current = Math.min(aw / (dbl ? PW * 2 : PW), ah / PH);
      setDouble(dbl);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    cur.current.fill(0); tgt.current.fill(0); vel.current.fill(0);
    applied.current.fill(-1); curlFlags.current.fill(false);
    idxRef.current = 0; setIndex(0); setCurl(Array(MAX_LEAVES).fill(false));
  }, [double]);

  useEffect(() => {
    const el = sectionRef.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.15 });
    io.observe(el); return () => io.disconnect();
  }, []);

  /* ---------------- Animation loop ---------------- */
  useEffect(() => {
    if (!inView) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, last = performance.now(), lastTransform = "", lastR = -1, lastL = -1;

    const tick = (now: number) => {
      const dt = Math.min(0.04, (now - last) / 1000); last = now;
      const n = dblRef.current ? 4 : MAX_LEAVES;
      const c = cur.current, t = tgt.current, v = vel.current;
      let curlChanged = false;

      for (let i = 0; i < n; i++) {
        const dragging = gesture.current && gesture.current.leaf === i;
        if (!dragging) {
          const diff = t[i] - c[i];
          if (reduce) { c[i] = t[i]; v[i] = 0; }
          else if (Math.abs(diff) > 0.0005 || Math.abs(v[i]) > 0.002) {
            v[i] += (diff * SPRING_K - v[i] * SPRING_D) * dt;
            c[i] = clamp(c[i] + v[i] * dt);
            if ((c[i] === 0 || c[i] === 1) && Math.abs(t[i] - c[i]) < 0.001) v[i] = 0;
            if (Math.abs(t[i] - c[i]) < 0.0008 && Math.abs(v[i]) < 0.02) { c[i] = t[i]; v[i] = 0; }
          }
        }
        if (c[i] !== applied.current[i]) { applied.current[i] = c[i]; apis.current[i]?.(c[i]); }
        const wantCurl = c[i] > 0.002 && c[i] < 0.998;
        if (wantCurl !== curlFlags.current[i]) { curlFlags.current[i] = wantCurl; curlChanged = true; }
      }
      if (curlChanged) setCurl(curlFlags.current.slice());

      const dbl = dblRef.current;
      const shift = dbl ? -(PW / 2) * (1 - c[0]) + (PW / 2) * c[n - 1] : -PW / 2;
      const spread = dbl ? c[0] * (1 - c[n - 1]) : 1;
      const sc = scaleS.current + (scaleD.current - scaleS.current) * spread;
      const tf = `scale(${sc.toFixed(4)}) translateX(${shift.toFixed(2)}px)`;
      if (tf !== lastTransform && bookRef.current) { bookRef.current.style.transform = tf; lastTransform = tf; }

      /* spine crease + ground shadow follow the open/closed state */
      if (spineRef.current) spineRef.current.style.opacity = (dbl ? spread : 0.45).toFixed(3);
      if (shadowRef.current) {
        const left = dbl ? -PW * c[0] : 0;
        const right = dbl ? PW * (1 - c[n - 1]) : PW;
        shadowRef.current.style.left = `${left.toFixed(1)}px`;
        shadowRef.current.style.width = `${(right - left).toFixed(1)}px`;
      }

      let sR = 0, sL = 0, rightPile = 0, leftPile = 0;
      for (let i = 0; i < n; i++) {
        const p = c[i], k = Math.sin(Math.PI * p) * 0.5, toLeft = smooth(0.35, 0.65, p);
        if (i < n - 1) sR = Math.max(sR, k * (1 - toLeft));
        if (i > 0 && dbl) sL = Math.max(sL, k * toLeft);
        if (p < 0.5) rightPile++; else leftPile++;
      }
      if (shadeR.current) shadeR.current.style.opacity = sR.toFixed(3);
      if (shadeL.current) shadeL.current.style.opacity = sL.toFixed(3);
      if (rightPile !== lastR && edgeR.current) { edgeR.current.style.width = `${Math.max(0, rightPile - 1) * (dbl ? 1.8 : 1.1)}px`; lastR = rightPile; }
      if (leftPile !== lastL && edgeL.current) {
        const w = dbl ? Math.max(0, leftPile - 1) * 1.8 : 0;
        edgeL.current.style.width = `${w}px`; edgeL.current.style.left = `${-PW - w}px`; lastL = leftPile;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  const goNext = useCallback(() => {
    const i = idxRef.current;
    const max = dblRef.current ? 4 : MAX_LEAVES - 1;
    if (i >= max) return;
    tgt.current[i] = 1; idxRef.current = i + 1; setIndex(i + 1);
  }, []);
  const goPrev = useCallback(() => {
    const i = idxRef.current; if (i <= 0) return;
    tgt.current[i - 1] = 0; idxRef.current = i - 1; setIndex(i - 1);
  }, []);

/* ---------------- CORNER HINTS (no auto flip) ---------------- */
useEffect(() => {
  if (!inView) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let alive = true;
  let side: "L" | "R" = "R";
  const ids: number[] = [];
  const later = (fn: () => void, ms: number) => {
    ids.push(window.setTimeout(() => { if (alive) fn(); }, ms));
  };
  const busy = () => !!gesture.current || Date.now() - lastAct.current < HINT_IDLE;

  const step = () => {
    if (busy()) { setHint(""); later(step, 800); return; }
    const canR = idxRef.current < (dblRef.current ? 4 : MAX_LEAVES - 1);
    const canL = dblRef.current && idxRef.current > 0;
    let s = side;
    if (s === "R" && !canR) s = "L";
    if (s === "L" && !canL) s = "R";
    if ((s === "R" && canR) || (s === "L" && canL)) {
      setHint(s);
      later(() => setHint(""), HINT_LIFT);
    }
    side = s === "R" ? "L" : "R";
    later(step, HINT_EVERY);
  };
  later(step, 1200);
  return () => { alive = false; ids.forEach(clearTimeout); setHint(""); };
}, [inView]);
  useEffect(() => {
    if (!inView) return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
      if (e.key === "ArrowRight") { lastAct.current = Date.now(); goNext(); }
      if (e.key === "ArrowLeft") { lastAct.current = Date.now(); goPrev(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inView, goNext, goPrev]);

  /* ---------------- Pointer / drag ---------------- */
  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as Element).closest("a,button")) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    lastAct.current = Date.now();
    setHint("");
    gesture.current = { x0: e.clientX, y0: e.clientY, lastX: e.clientX, lastT: e.timeStamp, vx: 0, leaf: -1, dir: 1, moved: 0 };
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current; if (!g) return;
    lastAct.current = Date.now();
    const dx = e.clientX - g.x0, dy = e.clientY - g.y0;
    g.moved = Math.max(g.moved, Math.abs(dx) + Math.abs(dy));
    const dt = Math.max(8, e.timeStamp - g.lastT);
    g.vx = g.vx * 0.5 + ((e.clientX - g.lastX) / dt) * 0.5;
    g.lastX = e.clientX; g.lastT = e.timeStamp;
    if (g.leaf < 0) {
      if (Math.abs(dx) < 10 || Math.abs(dx) < Math.abs(dy)) return;
      const max = dblRef.current ? 4 : MAX_LEAVES - 1;
      if (dx < 0 && idxRef.current < max) { g.leaf = idxRef.current; g.dir = 1; }
      else if (dx > 0 && idxRef.current > 0) { g.leaf = idxRef.current - 1; g.dir = -1; }
      else return;
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    }
    const span = PW * scaleD.current * 1.4;
    const p = g.dir === 1 ? clamp(-dx / span) : clamp(1 - dx / span);
    cur.current[g.leaf] = p; tgt.current[g.leaf] = p; vel.current[g.leaf] = 0;
  };
  const finish = (e: React.PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const g = gesture.current; gesture.current = null; if (!g) return;
    lastAct.current = Date.now();
    if (g.leaf >= 0) {
      const p = cur.current[g.leaf];
      if (g.dir === 1) {
        const go = !cancelled && (p > 0.32 || g.vx < -0.5) && !(g.vx > 0.5);
        tgt.current[g.leaf] = go ? 1 : 0;
        if (go) { idxRef.current = g.leaf + 1; setIndex(g.leaf + 1); }
      } else {
        const go = !cancelled && (p < 0.68 || g.vx > 0.5) && !(g.vx < -0.5);
        tgt.current[g.leaf] = go ? 0 : 1;
        if (go) { idxRef.current = g.leaf; setIndex(g.leaf); }
      }
      return;
    }
    if (!cancelled && g.moved < 8) {
      const r = e.currentTarget.getBoundingClientRect();
      if (e.clientX > r.left + r.width / 2) goNext(); else goPrev();
    }
  };

/* Background war scene index — always wraps, never out of bounds */
const bgIndex = WAR_SCENES.length > 0 ? index % WAR_SCENES.length : 0;
  const showR = index < maxI;
const showL = double && index > 0;

  /* ================================================================ */
  return (
    <section
      ref={sectionRef}
      id="comics"
      aria-label="Warrior Comics flipbook"
      className="relative isolate mt-16 h-[calc(100svh-64px)] w-full overflow-hidden bg-[#05020a] [container-type:size] sm:mt-[76px] sm:h-[calc(100svh-76px)]"
    >
      {/* ---------- BACKGROUND WAR SCENES ---------- */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {WAR_SCENES.map((s, i) => (
          <div
            key={s.src}
            className="absolute inset-0 will-change-[opacity,transform]"
            style={{
              opacity: i === bgIndex ? 1 : 0,
              transform: i === bgIndex ? "scale(1.08)" : "scale(1.14)",
              transition: "opacity 1100ms ease, transform 1600ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            {s.rot ? (
              <div
                className="absolute left-1/2 top-1/2 h-[100cqw] w-[100cqh]"
                style={{ transform: `translate(-50%,-50%) rotate(${s.rot}deg)` }}
              >
                <img
                  src={s.src}
                  alt=""
                  draggable={false}
                  className="block h-full w-full max-w-none object-cover"
                />
              </div>
            ) : (
              <img
                src={s.src}
                alt=""
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
          </div>
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0.55)_45%,rgba(0,0,0,0.8)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_50%,transparent_40%,rgba(0,0,0,0.75)_100%)]" />
        <div className="absolute inset-0 animate-[comic-scan_8s_linear_infinite] opacity-[0.06] [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.6)_0_1px,transparent_1px_3px)]" />
      </div>

      <style>{`
        @keyframes comic-scan {
          0%   { transform: translateY(0); }
          100% { transform: translateY(6px); }
        }
      `}</style>

      {/* ---------- BOOK STAGE ---------- */}
      <div
        ref={stageRef}
        role="group"
        aria-roledescription="flipbook"
        aria-label="Warrior Comics issue one. Use arrow keys, drag, or tap to turn pages."
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={(e) => finish(e, false)}
        onPointerCancel={(e) => finish(e, true)}
        className="relative z-[5] h-full w-full cursor-grab touch-pan-y select-none active:cursor-grabbing"
      >
        <div
          ref={bookRef}
          className="absolute left-1/2 top-1/2 h-0 w-0 [perspective:2200px] [transform-origin:0_0] [will-change:transform]"
        >
          {/* ground shadow */}
          <div
            ref={shadowRef}
            aria-hidden
            className="pointer-events-none absolute left-0 top-[330px] z-0 h-10 w-[480px] blur-[10px] [background:radial-gradient(ellipse_at_50%_30%,rgba(0,0,0,0.75),transparent_70%)]"
          />
          <div
            ref={edgeR}
            aria-hidden
            className="absolute -top-[337px] left-[480px] z-0 h-[674px] w-0 [background:repeating-linear-gradient(to_right,#efe7d4_0_1px,#bfb59c_1px_2px)] shadow-[2px_0_6px_rgba(0,0,0,0.4)]"
          />
          <div
            ref={edgeL}
            aria-hidden
            className="absolute -top-[337px] left-[-480px] z-0 h-[674px] w-0 [background:repeating-linear-gradient(to_left,#efe7d4_0_1px,#bfb59c_1px_2px)] shadow-[-2px_0_6px_rgba(0,0,0,0.4)]"
          />

          {leaves.map((def, i) => (
            <Leaf
              key={`${double ? "d" : "s"}-${i}`}
              index={i}
              total={L}
              def={def}
              curl={curl[i] ?? false}
              double={double}
              register={register}
              getP={() => cur.current[i]}
            />
          ))}

          {/* spine crease */}
          <div
            ref={spineRef}
            aria-hidden
            className="pointer-events-none absolute -top-[340px] left-[-16px] z-[140] h-[680px] w-8 opacity-0 [background:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.12)_30%,rgba(0,0,0,0.38)_50%,rgba(0,0,0,0.12)_70%,transparent_100%)]"
          />

          <div
            ref={shadeR}
            aria-hidden
            className="pointer-events-none absolute -top-[340px] left-0 z-[150] h-[680px] w-[480px] opacity-0 [background:linear-gradient(to_right,rgba(0,0,0,0.85),transparent_85%)]"
          />
          <div
            ref={shadeL}
            aria-hidden
            className="pointer-events-none absolute -top-[340px] left-[-480px] z-[150] h-[680px] w-[480px] opacity-0 [background:linear-gradient(to_left,rgba(0,0,0,0.85),transparent_85%)]"
          />

          {/* right page, bottom corner */}
          <div
            aria-hidden
            className={`pointer-events-none absolute -top-[340px] left-0 z-[160] h-[680px] w-[480px] transition-opacity duration-300 ${
              showR ? "opacity-100" : "opacity-0"
            }`}
          >
            <Corner side="R" on={hint === "R"} />
          </div>
          {/* left page, bottom corner */}
          <div
            aria-hidden
            className={`pointer-events-none absolute -top-[340px] left-[-480px] z-[160] h-[680px] w-[480px] transition-opacity duration-300 ${
              showL ? "opacity-100" : "opacity-0"
            }`}
          >
            <Corner side="L" on={hint === "L"} />
          </div>
        </div>
      </div>
    </section>
  );
}