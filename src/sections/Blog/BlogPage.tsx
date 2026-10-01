"use client";

import React, { memo, useEffect, useRef, useState } from "react";

declare global {
    interface Window {
        YT?: any;
        onYouTubeIframeAPIReady?: () => void;
    }
}

type BlogCardItem = {
    id: string;
    number: string;
    badge: string;
    badgeBg: string;
    image: string;
    title: string;
    description: string;
    tags: string[];
    points: string[];
    neonColor: string;
    borderColor: string;
};

const BLOG_ITEMS: BlogCardItem[] = [
    {
        id: "card-1",
        number: "NO. 01",
        badge: "BEHIND THE ART",
        badgeBg: "bg-[#ff3b30]",
        image: "/Images/Imgs/blog-1.jpg",
        title: "FINALLY, SOMEONE COMES UP WITH END OF PIRACY!",
        description:
            "Illegal hosting of content is a massive challenge in the comic industry. Discover how Warrior Comics is building a revolutionary decentralized protection for comic creators.",
        tags: ["DISTANCE", "TIME", "FRICTION"],
        points: [
            "Decentralized protection for every comic page",
            "Stops illegal hosting at the source",
            "Built to back creators, not pirates",
        ],
        neonColor: "#ff3b30",
        borderColor: "hover:border-[#ff3b30]",
    },
    {
        id: "card-2",
        number: "NO. 02",
        badge: "CHARACTERS",
        badgeBg: "bg-[#0099ff]",
        image: "/Images/Imgs/blog-2.jpg",
        title: "WARRIOR COMICS IS A WAY OUT IN THIS ILLEGAL WORLD",
        description:
            "Reading newspaper is frustrating when encountering ongoing internet scams. Uncover how our decentralized vault provides absolute security for artists and collectors.",
        tags: ["EQUIPMENT", "QUALITY", "STANDARDS"],
        points: [
            "Absolute security for artists and collectors",
            "A decentralized vault for your work",
            "A safer way through online scams",
        ],
        neonColor: "#00e5ff",
        borderColor: "hover:border-[#00e5ff]",
    },
    {
        id: "card-3",
        number: "NO. 03",
        badge: "STORY",
        badgeBg: "bg-[#00cc66]",
        image: "/Images/Imgs/blog-3.jpg",
        title: "MONETIZE YOUR COMIC ART GLOBALLY",
        description:
            "When we talk about creativity, webcomics are the bold new frontier. Empowering global comic artists with transparent royalties and worldwide fan distribution.",
        tags: ["CONSISTENCY", "STRUCTURE", "HABIT"],
        points: [
            "Transparent royalties on every sale",
            "Worldwide fan distribution",
            "Webcomics as the new creative frontier",
        ],
        neonColor: "#00ff88",
        borderColor: "hover:border-[#00ff88]",
    },
    {
        id: "card-4",
        number: "NO. 04",
        badge: "INTERVIEWS",
        badgeBg: "bg-[#f59e0b]",
        image: "/Images/Imgs/blog-4.jpg",
        title: "JOIN US AT OLD AGE HOME & COMMUNITY SESSIONS",
        description:
            "Warrior Comics team is continuously contributing to society. Bringing bright memories, creative workshops, and inspiring storytelling to local communities.",
        tags: ["COMMUNITY", "MENTORSHIP", "IMPACT"],
        points: [
            "Creative workshops for local communities",
            "Inspiring storytelling sessions",
            "Bright memories, shared together",
        ],
        neonColor: "#ffb703",
        borderColor: "hover:border-[#ffb703]",
    },
];

/* Placeholder numbers — replace with your real stats */
const STATS = [
    { to: 10, suffix: "K+", label: "Readers Reached" },
    { to: 250, suffix: "+", label: "Comic Creators" },
    { to: 40, suffix: "+", label: "Countries & Territories" },
];

const HEADING = "Let's blog";
const SUB = "We love to share creative and entertaining stories";
const STATS_CAPTION = "Join thousands of comic creators who protect and earn from their art with Warrior Comics";

const VIDEO_ID = "wNSudTF1EAI";
const TRIM_END = 10; // seconds cut from the end of the video on every loop

const N = BLOG_ITEMS.length;
const GAP = 48; // px gap between cards
const SIDE = 0.88; // side card scale
const TILT = 5; // deg (3D tilt)
const ROLL = 2; // deg (flat tilt, like the reference)
const ASPECT_DESKTOP = 0.62;
const ASPECT_2XL = 0.58; // slightly shorter than desktop, but taller than before
const ASPECT_MOBILE = 1.1;
const BOTTOM = 24; // same as the card's bottom-6 (24px)

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const wrap = (i: number) => ((i % N) + N) % N;
const circDist = (a: number, b: number) => {
    let d = (((a - b) % N) + N) % N;
    if (d >= N / 2) d -= N;
    return d;
};
const damp = (c: number, t: number, l: number, dt: number) => c + (t - c) * (1 - Math.exp(-l * dt));

/* ------------------------------------------------------------------ */
/* Background video — plays 0 → (duration − 10s), then loops           */
/* Memoized: blog changes never re-render or restart it                */
/* ------------------------------------------------------------------ */
const VideoBg = memo(function VideoBg() {
    const hostRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let player: any = null;
        let timer = 0;
        let dead = false;

        const init = () => {
            const host = hostRef.current;
            if (dead || !host || !window.YT?.Player) return;
            const mount = document.createElement("div");
            host.appendChild(mount);

            player = new window.YT.Player(mount, {
                videoId: VIDEO_ID,
                playerVars: {
                    autoplay: 1,
                    mute: 1,
                    controls: 0,
                    modestbranding: 1,
                    playsinline: 1,
                    rel: 0,
                    disablekb: 1,
                    iv_load_policy: 3,
                    fs: 0,
                },
                events: {
                    onReady: (e: any) => {
                        e.target.mute();
                        e.target.playVideo();
                    },
                    onStateChange: (e: any) => {
                        if (e.data === window.YT.PlayerState.ENDED) {
                            e.target.seekTo(0, true);
                            e.target.playVideo();
                        }
                    },
                },
            });

            timer = window.setInterval(() => {
                try {
                    const d = player?.getDuration?.() ?? 0;
                    const t = player?.getCurrentTime?.() ?? 0;
                    if (d > TRIM_END + 1 && t >= d - TRIM_END) player.seekTo(0, true);
                } catch {
                    /* player not ready yet */
                }
            }, 250);
        };

        if (window.YT?.Player) {
            init();
        } else {
            const prev = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = () => {
                prev?.();
                init();
            };
            if (!document.getElementById("yt-iframe-api")) {
                const s = document.createElement("script");
                s.id = "yt-iframe-api";
                s.src = "https://www.youtube.com/iframe_api";
                document.head.appendChild(s);
            }
        }

        return () => {
            dead = true;
            window.clearInterval(timer);
            try {
                player?.destroy?.();
            } catch {
                /* noop */
            }
        };
    }, []);

    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-black">
            <div
                ref={hostRef}
                className="wb-yt absolute left-1/2 top-1/2"
                style={{
                    width: "max(100vw, 177.78vh)",
                    height: "max(56.25vw, 100vh)",
                    transform: "translate(-50%, -50%) scale(1.2)",
                }}
            />
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "linear-gradient(180deg, rgba(0,0,0,.5) 0%, rgba(0,0,0,.2) 40%, rgba(0,0,0,.35) 70%, rgba(0,0,0,.7) 100%)",
                }}
            />
        </div>
    );
});

/* ------------------------------------------------------------------ */
/* Count-up stat                                                       */
/* ------------------------------------------------------------------ */
function Stat({
    to,
    suffix = "",
    label,
    run,
}: {
    to: number;
    suffix?: string;
    label: string;
    run: boolean;
}) {
    const [n, setN] = useState(0);

    useEffect(() => {
        if (!run) {
            setN(0);
            return;
        }
        let raf = 0;
        const t0 = performance.now();
        const dur = 2000;
        const f = (now: number) => {
            const p = clamp((now - t0) / dur);
            setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
            if (p < 1) raf = requestAnimationFrame(f);
        };
        raf = requestAnimationFrame(f);
        return () => cancelAnimationFrame(raf);
    }, [run, to]);

    return (
        <div className="text-center">
            <div className="text-5xl font-light tracking-tight tabular-nums md:text-7xl">
                {n}
                {suffix}
            </div>
            <div className="mt-3 text-[10px] font-medium uppercase tracking-[0.2em] text-white/80 md:text-xs">{label}</div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */
export default function BlogPage() {
    const bannerRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLElement | null)[]>([]);
    const pillRef = useRef<HTMLDivElement>(null);
    const pillTextRef = useRef<HTMLSpanElement>(null);

    const activeRef = useRef(0);
    const targetRef = useRef(0); // unbounded → seamless loop
    const visibleRef = useRef(false);
    const lockRef = useRef(false);
    const swipeRef = useRef<number | null>(null);

    const [active, setActive] = useState(0);
    const [runStats, setRunStats] = useState(false);

    const lock = () => {
        lockRef.current = true;
        window.setTimeout(() => (lockRef.current = false), 6000);
    };

    const step = (dir: 1 | -1, user = true) => {
        if (user) lock();
        targetRef.current = Math.round(targetRef.current) + dir;
    };

    const goTo = (i: number) => {
        lock();
        targetRef.current = Math.round(targetRef.current) + circDist(i, Math.round(targetRef.current));
    };

    useEffect(() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const fine = window.matchMedia("(pointer: fine)").matches;

        let raf = 0;
        let last = performance.now();
        let v = 0;
        let cw = 800;
        let ch = 500;
        let px = -200,
            py = -200,
            mx = -200,
            my = -200;

        const layout = () => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const mobile = vw < 768;
            const aspect = mobile ? ASPECT_MOBILE : vw >= 1536 ? ASPECT_2XL : ASPECT_DESKTOP;

            // top space reserved for navbar + heading + subtitle + button
            // smaller on mobile so the card has more room
            const top = mobile ? 200 : vw >= 1536 ? 320 : 280;
            const bottom = mobile ? 12 : BOTTOM;

            // how tall the card can be before it runs off the screen
            const availH = Math.max(320, vh - top - bottom);
            const fitW = availH / aspect;

            if (mobile) {
                // on phones: never wider than 88vw, never taller than what fits
                cw = Math.max(240, Math.min(vw * 0.88, fitW));
            } else {
                cw = Math.max(420, Math.min(vw * 0.56, 1200, fitW));
            }
            ch = cw * aspect;

            if (bannerRef.current) bannerRef.current.style.height = `${top + ch + bottom}px`;
            if (stageRef.current) stageRef.current.style.height = `${ch + bottom}px`;

            cardRefs.current.forEach((el) => {
                if (!el) return;
                el.style.width = `${cw}px`;
                el.style.height = `${ch}px`;
            });
        };

        const tick = (now: number) => {
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            v = damp(v, targetRef.current, reduce ? 100 : 5.5, dt);

            const inner = (cw * (1 + SIDE)) / 2 + GAP;

            cardRefs.current.forEach((el, i) => {
                if (!el) return;
                const d = circDist(i, v);
                const ad = Math.abs(d);
                const k = Math.min(1, ad);
                const x = Math.sign(d) * (ad <= 1 ? ad * inner : inner + (ad - 1) * (cw * SIDE + GAP));
                const sc = 1 - (1 - SIDE) * k;
                const ry = clamp(d, -1, 1) * TILT;
                const rz = clamp(d, -1, 1) * ROLL;

                el.style.transform = `translate3d(calc(-50% + ${x}px),0,0) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})`;
                el.style.filter = `brightness(${(1 - 0.42 * k).toFixed(3)})`;
                el.style.visibility = ad > 1.7 ? "hidden" : "visible";
                el.style.zIndex = String(10 - Math.round(ad * 3));
                el.dataset.side = ad > 0.5 ? "true" : "false";
            });

            const idx = wrap(Math.round(v));
            if (idx !== activeRef.current) {
                activeRef.current = idx;
                setActive(idx);
            }

            if (fine && pillRef.current) {
                px += (mx - px) * 0.25;
                py += (my - py) * 0.25;
                pillRef.current.style.transform = `translate3d(${px}px,${py}px,0) translate(-50%,-50%)`;
            }

            raf = requestAnimationFrame(tick);
        };

        const onMove = (e: PointerEvent) => {
            if (!fine) return;
            mx = e.clientX;
            my = e.clientY;
            const t = e.target as Element | null;
            const card = t?.closest?.("[data-card]") as HTMLElement | null;
            const text = pillTextRef.current;
            if (!text) return;

            if (card) {
                const d = circDist(Number(card.dataset.card), v);
                if (Math.abs(d) > 0.5) {
                    text.textContent = d < 0 ? "Previous" : "Next";
                    text.dataset.on = "true";
                    return;
                }
            }
            text.dataset.on = "false";
        };

        const hidePill = () => {
            if (pillTextRef.current) pillTextRef.current.dataset.on = "false";
        };

        /* auto carousel */
        const auto = window.setInterval(() => {
            if (!visibleRef.current || lockRef.current || reduce) return;
            step(1, false);
        }, 4000);

        const io = new IntersectionObserver(
            ([en]) => {
                visibleRef.current = en.isIntersecting;
            },
            { threshold: 0.3 }
        );
        if (bannerRef.current) io.observe(bannerRef.current);

        const io2 = new IntersectionObserver(([en]) => setRunStats(en.isIntersecting), { threshold: 0.4 });
        if (statsRef.current) io2.observe(statsRef.current);

        layout();
        window.addEventListener("resize", layout);
        window.addEventListener("pointermove", onMove, { passive: true });
        bannerRef.current?.addEventListener("pointerleave", hidePill);
        raf = requestAnimationFrame(tick);

        const banner = bannerRef.current;
        return () => {
            cancelAnimationFrame(raf);
            window.clearInterval(auto);
            io.disconnect();
            io2.disconnect();
            window.removeEventListener("resize", layout);
            window.removeEventListener("pointermove", onMove);
            banner?.removeEventListener("pointerleave", hidePill);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onCardClick = (i: number) => {
        if (i !== activeRef.current) goTo(i);
    };

return (
    <section id="blog" className="relative bg-background text-foreground font-sans transition-colors duration-500">
        <style>{`
      .wb-yt iframe { width:100%; height:100%; border:0; pointer-events:none; }
      .wb-points { display: none; }
      @media (min-width: 1024px) and (min-height: 800px) { .wb-points { display: flex; } }
      .wb-pill { transform: scale(0); opacity: 0; transition: transform .25s cubic-bezier(.2,.8,.2,1), opacity .2s; }
      .wb-pill[data-on="true"] { transform: scale(1); opacity: 1; }
      .wb-card[data-side="true"] { cursor: none; }
      @media (pointer: coarse) { .wb-pill-wrap { display:none !important; } .wb-card[data-side="true"] { cursor: pointer; } }
    `}</style>

        {/* ---------------- Banner ---------------- */}
        <div ref={bannerRef} className="relative w-full overflow-hidden h-[700px]">
            <VideoBg />

            <header className="absolute inset-x-0 top-[92px] z-20 flex flex-col items-center px-6 text-center sm:top-[116px] md:top-[128px]">
                <h2 className="m-0 text-2xl font-medium leading-[1.05] tracking-tight sm:text-4xl md:text-5xl">
                    {HEADING}
                </h2>
                <p className="mb-0 mt-2 max-w-md text-xs text-foreground/85 sm:mt-3 sm:text-sm">{SUB}</p>
                <button
                    type="button"
                    onClick={() => step(1)}
                    className="mt-4 cursor-pointer bg-foreground px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-background transition-opacity hover:opacity-80 sm:mt-6 sm:px-6 sm:py-2.5"
                >
                    Explore Stories
                </button>
            </header>

            {/* Carousel — flush to the bottom */}
            <div
                ref={stageRef}
                className="absolute inset-x-0 bottom-0 z-10 [perspective:1800px] [touch-action:pan-y]"
                onPointerDown={(e) => (swipeRef.current = e.clientX)}
                onPointerUp={(e) => {
                    if (swipeRef.current === null) return;
                    const dx = e.clientX - swipeRef.current;
                    swipeRef.current = null;
                    if (Math.abs(dx) > 60) step(dx < 0 ? 1 : -1);
                }}
            >
                {BLOG_ITEMS.map((b, i) => {
                    const on = active === i;
                    return (
                        <article
                            key={b.id}
                            ref={(el) => {
                                cardRefs.current[i] = el;
                            }}
                            data-card={i}
                            data-side="false"
                            onClick={() => onCardClick(i)}
                            className={`wb-card absolute bottom-3 left-1/2 flex select-none flex-col overflow-hidden rounded-xl border bg-background will-change-transform [transform-origin:50%_100%] transition-[border-color,box-shadow,background-color] duration-[400ms] md:bottom-6 md:flex-row ${b.borderColor}`}
                            style={{
                                /* per-card neon color comes from BLOG_ITEMS data */
                                borderColor: on ? b.neonColor : "color-mix(in srgb, var(--foreground) 12%, transparent)",
                                boxShadow: on ? `0 0 40px -8px ${b.neonColor}88` : "none",
                            }}
                        >
                            {/* image */}
                            <div className="relative h-[36%] w-full shrink-0 overflow-hidden md:h-full md:w-[45%] lg:w-1/2">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={b.image} alt={b.title} draggable={false} className="h-full w-full object-cover" />
                                <div
                                    aria-hidden
                                    className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.5),transparent_55%)]"
                                />
                                {/* <span
                  className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white ${b.badgeBg}`}
                >
                  {b.badge}
                </span> */}
                            </div>

                            {/* text */}
                            <div className="flex min-h-0 flex-1 flex-col justify-center gap-3 p-4 sm:gap-4 sm:p-5 md:gap-4 md:p-6 lg:p-7 xl:p-8 2xl:p-10">
                                <div>
                                    {/* <p className="m-0 text-[11px] font-semibold tracking-[0.35em]" style={{ color: b.neonColor }}>
                    {b.number}
                  </p> */}
                                    <h3 className="mb-0 mt-2 text-sm font-bold leading-tight tracking-tight sm:mt-3 sm:text-base md:text-lg lg:text-xl xl:text-2xl">{b.title}</h3>
                                    <p className="mb-0 mt-2 line-clamp-3 text-[11px] leading-relaxed text-foreground/65 sm:mt-3 sm:line-clamp-4 sm:text-xs md:text-[12px] lg:text-[13px] xl:text-sm">
                                        {b.description}
                                    </p>
                                </div>
                                <ul className="wb-points m-0 list-none flex-col gap-2.5 border-t border-foreground/10 p-0 pt-4 text-xs text-foreground/80 md:text-sm">
                                    {b.points.map((p) => (
                                        <li key={p} className="flex items-start gap-3">
                                            <span
                                                aria-hidden
                                                className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full"
                                                style={{ background: b.neonColor }}
                                            />
                                            <span>{p}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    {b.tags.map((t) => (
                                        <span
                                            key={t}
                                            className="rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] md:px-3 md:text-[10px]"
                                            style={{ borderColor: `${b.neonColor}66`, color: b.neonColor }}
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>

    {/* ---------------- Stats (count-up) ---------------- */}
<div
  ref={statsRef}
  className="bg-[#05070d] text-foreground px-6 py-16 transition-colors duration-500 [html[data-theme=light]_&]:bg-[#e6ecf7]"
>
  <div className="mx-auto grid max-w-4xl grid-cols-1 gap-10 sm:grid-cols-3">
    {STATS.map((s) => (
      <Stat key={s.label} to={s.to} suffix={s.suffix} label={s.label} run={runStats} />
    ))}
  </div>
</div>

        {/* Previous / Next hover pill */}
        <div ref={pillRef} aria-hidden className="wb-pill-wrap pointer-events-none fixed left-0 top-0 z-[9999]">
            <span
                ref={pillTextRef}
                data-on="false"
                className="wb-pill block rounded-full bg-foreground px-4 py-2 text-[11px] font-medium text-background shadow-lg"
            >
                Next
            </span>
        </div>
    </section>
);
}