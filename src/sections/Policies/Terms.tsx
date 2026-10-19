"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  CONTENT                                                            */
/* ------------------------------------------------------------------ */
const SECTIONS = [
  {
    n: "1",
    title: "Acceptance of Terms",
    body: (
      <p>
        By accessing and using Warrior Comics (&ldquo;the Platform&rdquo;), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services. Warrior Comics reserves the right to modify these terms at any time without prior notice.
      </p>
    ),
  },
  {
    n: "2",
    title: "About Warrior Comics",
    body: (
      <p>
        Warrior Comics is a decentralized platform for comic and animation enthusiasts. Our platform enables creators to upload and showcase their digital artwork including animations, 2D and 3D digital art. The platform operates on blockchain technology to ensure security, transparency, and protection against piracy.
      </p>
    ),
  },
  {
    n: "3",
    title: "User Accounts",
    body: (
      <>
        <p className="mb-3">
          <strong>3.1 Registration:</strong> To access certain features, you must create an account. You agree to provide accurate, complete, and current information during registration.
        </p>
        <p className="mb-3">
          <strong>3.2 Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.
        </p>
        <p>
          <strong>3.3 Account Termination:</strong> Warrior Comics reserves the right to suspend or terminate accounts that violate these terms or engage in fraudulent activities.
        </p>
      </>
    ),
  },
  {
    n: "4",
    title: "Creator Guidelines",
    body: (
      <>
        <p className="mb-3">
          <strong>4.1 Content Upload:</strong> Creators may upload original artwork including animations, 2D and 3D digital art. All content must comply with our community guidelines.
        </p>
        <p className="mb-3">
          <strong>4.2 Ownership:</strong> Creators retain ownership of their original work. By uploading content, you grant Warrior Comics a non-exclusive license to display and distribute your content on the platform.
        </p>
        <p className="mb-3">
          <strong>4.3 Paid Content:</strong> Creators may choose to offer content for free or as paid content. Paid content must follow our pricing guidelines and quality standards.
        </p>
        <p>
          <strong>4.4 Royalties:</strong> Popular creators may receive royalties in WRT (Warrior Token) based on content popularity and engagement metrics.
        </p>
      </>
    ),
  },
  {
    n: "5",
    title: "Content Licensing & Character Leasing",
    body: (
      <>
        <p className="mb-3">
          <strong>5.1 WC Originals:</strong> Content launched under &ldquo;WC Originals&rdquo; banner is owned by Warrior Comics and licensed according to our commercial terms.
        </p>
        <p className="mb-3">
          <strong>5.2 User Generated Content:</strong> User-created content is timestamped on the blockchain for copyright protection. Creators maintain ownership but grant usage rights as specified.
        </p>
        <p>
          <strong>5.3 Character Leasing:</strong> Filmmakers and industry professionals may lease characters from the platform for their projects. All leases must follow our commercial licensing guidelines.
        </p>
      </>
    ),
  },
  {
    n: "6",
    title: "Blockchain & WRT Tokens",
    body: (
      <>
        <p className="mb-3">
          <strong>6.1 WRT Tokens:</strong> Warrior Token (WRT) is our internal digital token used for royalty payments, content purchases, and platform transactions.
        </p>
        <p className="mb-3">
          <strong>6.2 Timestamping:</strong> All user-generated content is timestamped on the blockchain to establish ownership and prevent manipulation.
        </p>
        <p>
          <strong>6.3 Anti-Piracy:</strong> The blockchain-based system provides transparent ownership records to combat piracy and copyright infringement.
        </p>
      </>
    ),
  },
  {
    n: "7",
    title: "Prohibited Activities",
    body: (
      <>
        <p className="mb-3">Users must not:</p>
        <ul className="mb-3 list-inside list-disc space-y-1">
          <li>Upload content that infringes on intellectual property rights</li>
          <li>Engage in plagiarism or unauthorized content copying</li>
          <li>Use the platform for illegal activities</li>
          <li>Attempt to manipulate blockchain records or timestamps</li>
          <li>Exploit vulnerabilities or compromise platform security</li>
          <li>Harass other users or creators</li>
        </ul>
      </>
    ),
  },
  {
    n: "8",
    title: "Intellectual Property",
    body: (
      <>
        <p className="mb-3">
          <strong>8.1 Platform IP:</strong> Warrior Comics name, logo, and platform design are our intellectual property.
        </p>
        <p>
          <strong>8.2 User IP:</strong> Users retain rights to their original content. By uploading, you grant Warrior Comics the necessary rights to operate the platform.
        </p>
      </>
    ),
  },
  {
    n: "9",
    title: "Limitation of Liability",
    body: (
      <p>
        Warrior Comics is not liable for any damages arising from use of the platform, including but not limited to lost content, financial losses, or third-party actions. The platform is provided &ldquo;as is&rdquo; without warranties of any kind.
      </p>
    ),
  },
  {
    n: "10",
    title: "Dispute Resolution",
    body: (
      <p>
        Any disputes arising from these terms shall be resolved through binding arbitration in accordance with the laws of Nevada, USA. The arbitration shall be conducted in English.
      </p>
    ),
  },
  {
    n: "11",
    title: "Contact Information",
    body: (
      <p>
        For questions about these Terms &amp; Conditions, please contact us at:
        <br />
        <a
          href="mailto:info@warriorcomics.com"
          className="text-accent underline-offset-2 transition-colors hover:text-accent/80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
        >
          info@warriorcomics.com
        </a>
        <br />
        Warrior Comics Inc.
        <br />
        PO BOX 230610, Las Vegas, Nevada
      </p>
    ),
  },
];

/* The three key clauses people look for first */
const SUMMARY = [
  {
    to: "4",
    title: "You keep your rights",
    text: "Creators retain ownership of their original work.",
  },
  {
    to: "6",
    title: "Blockchain protects your work",
    text: "Content is timestamped to prevent piracy and tampering.",
  },
  {
    to: "9",
    title: "Fair, honest liability",
    text: "The platform is provided as-is with clear limits.",
  },
];

const sid = (n: string) => `tc-s${n}`;
const pad = (n: string) => n.padStart(2, "0");
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const RING = 2 * Math.PI * 20;

const CSS = `
.tc-root{--pp:0;--nav-h:56px}

@keyframes tcRise{from{transform:translateY(105%)}to{transform:translateY(0)}}
@keyframes tcFade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes tcAurora{0%,100%{transform:translate3d(-4%,-2%,0) scale(1);opacity:.5}50%{transform:translate3d(4%,2%,0) scale(1.08);opacity:.8}}
@keyframes tcSpin{to{transform:rotate(360deg)}}
@keyframes tcSpinRev{to{transform:rotate(-360deg)}}
@keyframes tcPulse{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.5)}}

.tc-rise{transform:translateY(105%);animation:tcRise .95s cubic-bezier(.22,1,.36,1) forwards;animation-delay:var(--d,0s)}
.tc-fade{opacity:0;animation:tcFade .9s cubic-bezier(.22,1,.36,1) forwards;animation-delay:var(--d,0s)}
.tc-aurora{animation:tcAurora 18s ease-in-out infinite}
.tc-spin{animation:tcSpin 70s linear infinite}
.tc-spin-rev{animation:tcSpinRev 46s linear infinite}
.tc-pulse{animation:tcPulse 2.4s ease-in-out infinite}

.tc-ready .tc-rule{transform:scaleX(0);transform-origin:left;transition:transform 1.1s cubic-bezier(.22,1,.36,1)}
.tc-ready .tc-body{opacity:0;transition:opacity .9s ease .2s}
.tc-ready .tc-sec.tc-in .tc-rule{transform:scaleX(1)}
.tc-ready .tc-sec.tc-in .tc-body{opacity:1}

.tc-body strong{color:var(--foreground);font-weight:700}
.tc-scroll{scrollbar-width:thin;scrollbar-color:var(--accent) transparent}

@media (prefers-reduced-motion:reduce){
  .tc-rise,.tc-fade{animation:none!important;transform:none!important;opacity:1!important}
  .tc-aurora,.tc-spin,.tc-spin-rev,.tc-pulse{animation:none!important}
  .tc-ready .tc-rule,.tc-ready .tc-body{transition:none!important;opacity:1!important;transform:none!important}
}
`;

/* ------------------------------------------------------------------ */
export default function TermsPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLElement>(null);

  const [active, setActive] = useState(SECTIONS[0].n);
  const [open, setOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    rootRef.current?.classList.add("tc-ready");
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const art = articleRef.current;
      if (!art) return;
      const r = art.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = clamp((vh * 0.4 - r.top) / r.height);
      root.style.setProperty("--pp", p.toFixed(4));
      setShowTop(window.scrollY > vh * 0.6);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const secs = root.querySelectorAll<HTMLElement>(".tc-sec");

    const reveal = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("tc-in");
            reveal.unobserve(e.target);
          }
        }),
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
    );

    const spy = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive((e.target as HTMLElement).dataset.n || "1");
        }),
      { rootMargin: "-30% 0px -60% 0px" }
    );

    secs.forEach((el) => {
      reveal.observe(el);
      spy.observe(el);
    });
    return () => {
      reveal.disconnect();
      spy.disconnect();
    };
  }, []);

  const go = useCallback((n: string) => {
    const el = document.getElementById(sid(n));
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    setActive(n);
    setOpen(false);
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  const current = SECTIONS.find((s) => s.n === active) ?? SECTIONS[0];

  return (
    <div
      ref={rootRef}
      className="tc-root relative isolate min-h-screen overflow-x-clip bg-background text-foreground transition-colors duration-500"
    >
      <style>{CSS}</style>

      {/* themed backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="tc-aurora absolute -left-1/4 top-[-10%] h-[70vh] w-[70vw] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_22%,transparent)_0%,transparent_65%)] blur-3xl" />
        <div className="tc-aurora absolute right-[-15%] top-[30%] h-[60vh] w-[55vw] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--nav-left-band)_45%,transparent)_0%,transparent_65%)] blur-3xl [animation-delay:-6s]" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-40 [background-image:radial-gradient(var(--nav-left-line)_1px,transparent_1.6px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_at_50%_30%,#000_0%,transparent_70%)]"
      />

      <div className="mx-auto w-full max-w-6xl px-5 pb-24 sm:px-8 lg:px-10">
        {/* ============================================================
            HERO
        ============================================================ */}
        <header className="relative pb-12 pt-[calc(var(--nav-h)_+_3rem)] sm:pt-[calc(var(--nav-h)_+_4rem)] md:pb-16">
          {/* signature ring */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 top-1/2 hidden aspect-square w-[min(46vw,440px)] -translate-y-1/2 opacity-70 md:block"
          >
            <div className="absolute inset-0" style={{ transform: "rotate(calc(var(--pp) * 240deg))" }}>
              <div className="tc-spin absolute inset-0 rounded-full border border-dashed border-foreground/20">
                <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_14px_3px_var(--accent)]" />
              </div>
            </div>
            <div className="absolute inset-[14%]" style={{ transform: "rotate(calc(var(--pp) * -320deg))" }}>
              <div className="tc-spin-rev absolute inset-0 rounded-full border border-foreground/10">
                <span className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-foreground/60" />
              </div>
            </div>
            <div className="absolute inset-[34%] rounded-full bg-accent/15 blur-2xl" />
          </div>

          <h1 className="relative font-serif text-[clamp(2.4rem,8vw,5.5rem)] font-black uppercase leading-[0.95] tracking-wider text-foreground">
            {["Terms", "& Conditions"].map((w, i) => (
              <span key={w} className="block overflow-hidden pb-1">
                <span className="tc-rise block" style={{ ["--d" as string]: `${0.1 + i * 0.12}s` }}>
                  {w}
                </span>
              </span>
            ))}
          </h1>

          <p
            className="tc-fade relative mt-6 max-w-xl text-sm leading-relaxed text-foreground/70 sm:text-base"
            style={{ ["--d" as string]: "0.45s" }}
          >
            The rules that keep Warrior Comics fair, transparent, and safe for creators and readers alike.
          </p>
          <p
            className="tc-fade relative mt-3 text-xs text-foreground/50"
            style={{ ["--d" as string]: "0.55s" }}
          >
            Last updated October 2026
          </p>

          {/* key points */}
          <ul className="relative mt-10 grid gap-5 sm:grid-cols-3 sm:gap-6">
            {SUMMARY.map((s, i) => (
              <li key={s.to} className="tc-fade" style={{ ["--d" as string]: `${0.7 + i * 0.12}s` }}>
                <button
                  type="button"
                  onClick={() => go(s.to)}
                  className="group h-full w-full border-l-2 border-accent/50 py-1 pl-4 text-left transition-all duration-300 hover:border-accent hover:pl-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
                >
                  <span className="block text-sm font-bold text-foreground">{s.title}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-foreground/65">{s.text}</span>
                  <span className="mt-2 inline-block text-xs font-semibold text-accent transition-transform duration-300 group-hover:translate-x-1">
                    Read section {s.to} →
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <span
            aria-hidden
            className="tc-fade relative mt-12 block h-px w-full bg-gradient-to-r from-accent/70 via-foreground/15 to-transparent"
            style={{ ["--d" as string]: "1.1s" }}
          />
        </header>

        {/* ============================================================
            BODY: contents (left) + terms (right)
        ============================================================ */}
        <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
          {/* mobile / tablet jump bar */}
          <div className="sticky top-[var(--nav-h)] z-30 -mx-5 mb-8 border-b border-foreground/10 bg-background/85 px-5 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:hidden">
            <button
              type="button"
              aria-expanded={open}
              aria-controls="tc-mobile-toc"
              onClick={() => setOpen((o) => !o)}
              className="flex w-full items-center justify-between gap-3 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
            >
              <span className="flex min-w-0 items-baseline gap-2">
                <span className="text-xs font-bold tabular-nums text-accent">{pad(current.n)}</span>
                <span className="truncate text-sm font-semibold text-foreground">{current.title}</span>
              </span>
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`h-4 w-4 shrink-0 text-foreground/60 transition-transform duration-300 ${
                  open ? "rotate-180" : ""
                }`}
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div
              id="tc-mobile-toc"
              className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <ol className="tc-scroll max-h-[55vh] overflow-y-auto pb-3">
                  {SECTIONS.map((s) => (
                    <li key={s.n}>
                      <button
                        type="button"
                        onClick={() => go(s.n)}
                        tabIndex={open ? 0 : -1}
                        className={`flex w-full items-baseline gap-3 py-2 text-left text-sm transition-colors ${
                          active === s.n ? "font-semibold text-foreground" : "text-foreground/60"
                        }`}
                      >
                        <span className={`text-xs tabular-nums ${active === s.n ? "text-accent" : "text-foreground/30"}`}>
                          {pad(s.n)}
                        </span>
                        {s.title}
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <span
              aria-hidden
              className="absolute bottom-[-1px] left-0 h-[2px] w-full origin-left bg-accent shadow-[0_0_8px_var(--accent)]"
              style={{ transform: "scaleX(var(--pp))" }}
            />
          </div>

          {/* desktop contents + blade progress */}
          <aside className="hidden lg:block">
            <nav
              aria-label="Terms and conditions contents"
              className="sticky top-[calc(var(--nav-h)_+_2rem)]"
            >
              <p className="mb-4 text-sm font-bold text-foreground">On this page</p>
              <div className="flex gap-4">
                <div aria-hidden className="flex flex-col items-center">
                  <span className="h-1 w-6 rounded-full bg-accent/80" />
                  <span className="h-3 w-[3px] bg-foreground/30" />
                  <div
                    className="relative w-[9px] flex-1 bg-foreground/10"
                    style={{ clipPath: "polygon(0 0,100% 0,100% calc(100% - 12px),50% 100%,0 calc(100% - 12px))" }}
                  >
                    <div
                      className="absolute inset-x-0 top-0 bg-gradient-to-b from-accent via-accent to-orange-300"
                      style={{ height: "calc(var(--pp) * 100%)" }}
                    />
                  </div>
                </div>

                <ol className="tc-scroll max-h-[calc(100vh_-_var(--nav-h)_-_9rem)] flex-1 space-y-0.5 overflow-y-auto pr-1">
                  {SECTIONS.map((s) => {
                    const on = active === s.n;
                    return (
                      <li key={s.n}>
                        <button
                          type="button"
                          onClick={() => go(s.n)}
                          aria-current={on ? "true" : undefined}
                          className={`flex w-full items-baseline gap-2.5 rounded py-1.5 text-left text-[13px] leading-snug transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 ${
                            on
                              ? "translate-x-1 font-semibold text-foreground"
                              : "text-foreground/55 hover:text-foreground"
                          }`}
                        >
                          <span className={`w-5 shrink-0 text-[11px] tabular-nums transition-colors ${on ? "text-accent" : "text-foreground/30"}`}>
                            {pad(s.n)}
                          </span>
                          <span>{s.title}</span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </nav>
          </aside>

          {/* the terms */}
          <article ref={articleRef} className="min-w-0">
            {SECTIONS.map((s) => {
              const on = active === s.n;
              return (
                <section
                  key={s.n}
                  id={sid(s.n)}
                  data-n={s.n}
                  aria-labelledby={`${sid(s.n)}-h`}
                  className="tc-sec scroll-mt-[calc(var(--nav-h)_+_4.5rem)] pb-10 lg:scroll-mt-[calc(var(--nav-h)_+_2rem)] md:pb-14"
                >
                  <span
                    aria-hidden
                    className="tc-rule block h-px w-full bg-gradient-to-r from-accent/70 via-foreground/15 to-transparent"
                  />
                  <h2
                    id={`${sid(s.n)}-h`}
                    className="mb-4 mt-6 flex items-baseline gap-3 font-serif text-xl font-bold uppercase tracking-wide text-foreground sm:text-2xl"
                  >
                    <span
                      className={`text-base tabular-nums transition-colors duration-500 sm:text-lg ${
                        on ? "text-accent" : "text-foreground/30"
                      }`}
                    >
                      {pad(s.n)}
                    </span>
                    <span className="relative">
                      {s.title}
                      <span
                        aria-hidden
                        className={`absolute -bottom-1.5 left-0 h-[2px] bg-accent transition-all duration-700 ease-out ${
                          on ? "w-full" : "w-0"
                        }`}
                      />
                    </span>
                  </h2>
                  <div className="tc-body max-w-prose space-y-1 text-sm leading-relaxed text-foreground/80 sm:pl-10 sm:text-[15px] sm:leading-7">
                    {s.body}
                  </div>
                </section>
              );
            })}
          </article>
        </div>
      </div>

      {/* back to top with progress ring */}
      <button
        type="button"
        onClick={toTop}
        aria-label="Back to top"
        className={`fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-foreground/15 bg-background/80 text-foreground shadow-lg backdrop-blur-md transition-all duration-500 hover:border-accent hover:shadow-[0_0_24px_-4px_var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 sm:bottom-8 sm:right-8 ${
          showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
        }`}
      >
        <svg aria-hidden viewBox="0 0 48 48" className="absolute inset-0 -rotate-90">
          <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="2" />
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={RING}
            style={{ strokeDashoffset: `calc(${RING} * (1 - var(--pp)))` }}
          />
        </svg>
        <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="relative h-4 w-4">
          <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}