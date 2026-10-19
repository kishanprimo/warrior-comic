"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  CONTENT — unchanged from your original policy                      */
/* ------------------------------------------------------------------ */
const SECTIONS = [
  {
    n: "1",
    title: "Introduction",
    body: (
      <p>
        Warrior Comics (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our decentralized comic and animation platform. Our approach combines traditional data protection with blockchain transparency.
      </p>
    ),
  },
  {
    n: "2",
    title: "Information We Collect",
    body: (
      <>
        <p className="mb-3">
          <strong>2.1 Account Information:</strong> When you create an account, we collect your email address, username (hero alias), and password (encrypted). We may also collect optional profile information.
        </p>
        <p className="mb-3">
          <strong>2.2 Content Data:</strong> Information about content you upload, including titles, descriptions, and timestamps recorded on the blockchain.
        </p>
        <p className="mb-3">
          <strong>2.3 Transaction Data:</strong> Records of WRT token transactions, content purchases, and royalty payments stored on the blockchain.
        </p>
        <p className="mb-3">
          <strong>2.4 Usage Data:</strong> Information about how you interact with the platform, including pages visited, content viewed, and engagement metrics.
        </p>
        <p>
          <strong>2.5 Device Information:</strong> IP address, browser type, device information, and operating system for security and analytics purposes.
        </p>
      </>
    ),
  },
  {
    n: "3",
    title: "How We Use Your Information",
    body: (
      <>
        <p className="mb-3">
          <strong>3.1 Platform Operations:</strong> To provide, maintain, and improve our services, including content delivery and user authentication.
        </p>
        <p className="mb-3">
          <strong>3.2 Blockchain Transactions:</strong> To record content ownership, timestamps, and WRT token transactions transparently on the blockchain.
        </p>
        <p className="mb-3">
          <strong>3.3 Royalty Calculations:</strong> To calculate and distribute royalties to creators based on content popularity and engagement.
        </p>
        <p className="mb-3">
          <strong>3.4 Security:</strong> To detect, prevent, and address fraud, unauthorized access, and security threats.
        </p>
        <p className="mb-3">
          <strong>3.5 Communications:</strong> To send you important updates about your account, platform changes, and promotional content (with your consent).
        </p>
        <p>
          <strong>3.6 Analytics:</strong> To analyze usage patterns and improve our platform features and user experience.
        </p>
      </>
    ),
  },
  {
    n: "4",
    title: "Blockchain Transparency",
    body: (
      <>
        <p className="mb-3">
          <strong>4.1 Public Records:</strong> Certain information, including content timestamps, ownership records, and WRT token transactions, are recorded on the blockchain and are publicly visible. This ensures transparency and prevents piracy.
        </p>
        <p className="mb-3">
          <strong>4.2 Wallet Addresses:</strong> Blockchain wallet addresses used for transactions are public. However, personal identity information is not directly linked to these addresses on the blockchain.
        </p>
        <p>
          <strong>4.3 Immutable Records:</strong> Once recorded on the blockchain, data cannot be altered or deleted. This feature protects creators&apos; rights and content ownership.
        </p>
      </>
    ),
  },
  {
    n: "5",
    title: "Data Sharing & Disclosure",
    body: (
      <>
        <p className="mb-3">
          <strong>5.1 No Sale of Personal Data:</strong> We do not sell your personal information to third parties for marketing purposes.
        </p>
        <p className="mb-3">
          <strong>5.2 Service Providers:</strong> We may share data with trusted third-party service providers who assist in operating our platform (e.g., hosting, analytics).
        </p>
        <p className="mb-3">
          <strong>5.3 Legal Requirements:</strong> We may disclose information if required by law or to protect our rights, property, or safety.
        </p>
        <p className="mb-3">
          <strong>5.4 Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, user data may be transferred as part of the transaction.
        </p>
        <p>
          <strong>5.5 Character Licensing:</strong> When characters are leased to industry professionals, necessary licensing information may be shared according to our commercial terms.
        </p>
      </>
    ),
  },
  {
    n: "6",
    title: "Data Security",
    body: (
      <>
        <p className="mb-3">
          <strong>6.1 Encryption:</strong> We use industry-standard encryption to protect your personal data and account credentials.
        </p>
        <p className="mb-3">
          <strong>6.2 Blockchain Security:</strong> The decentralized nature of blockchain technology provides additional security for content ownership and transaction records.
        </p>
        <p className="mb-3">
          <strong>6.3 Access Controls:</strong> We implement strict access controls to limit who can access your personal information.
        </p>
        <p>
          <strong>6.4 Regular Audits:</strong> We conduct regular security audits to identify and address potential vulnerabilities.
        </p>
      </>
    ),
  },
  {
    n: "7",
    title: "Your Rights & Choices",
    body: (
      <>
        <p className="mb-3">
          <strong>7.1 Access:</strong> You can request access to your personal information we hold.
        </p>
        <p className="mb-3">
          <strong>7.2 Correction:</strong> You can request correction of inaccurate or incomplete personal information.
        </p>
        <p className="mb-3">
          <strong>7.3 Deletion:</strong> You can request deletion of your account and personal information, subject to legal and blockchain record-keeping requirements.
        </p>
        <p className="mb-3">
          <strong>7.4 Data Portability:</strong> You can request a copy of your personal data in a structured format.
        </p>
        <p>
          <strong>7.5 Opt-Out:</strong> You can opt out of promotional communications at any time.
        </p>
      </>
    ),
  },
  {
    n: "8",
    title: "Cookies & Tracking",
    body: (
      <>
        <p className="mb-3">
          <strong>8.1 Essential Cookies:</strong> Required for basic platform functionality and security.
        </p>
        <p className="mb-3">
          <strong>8.2 Analytics Cookies:</strong> Help us understand how users interact with our platform to improve our services.
        </p>
        <p>
          <strong>8.3 Preferences:</strong> You can manage cookie preferences through your browser settings.
        </p>
      </>
    ),
  },
  {
    n: "9",
    title: "Children's Privacy",
    body: (
      <p>
        Our platform is not intended for children under 13 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected such information, we will take steps to delete it.
      </p>
    ),
  },
  {
    n: "10",
    title: "International Data Transfers",
    body: (
      <p>
        Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
      </p>
    ),
  },
  {
    n: "11",
    title: "Changes to This Policy",
    body: (
      <p>
        We may update this Privacy Policy from time to time. We will notify users of significant changes by posting the new policy on our platform and updating the &ldquo;Last updated&rdquo; date.
      </p>
    ),
  },
  {
    n: "12",
    title: "Contact Information",
    body: (
      <p>
        For questions about this Privacy Policy or to exercise your rights, please contact us at:
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

/* The three things people most want to know, each jumps to its section */
const SUMMARY = [
  {
    to: "5",
    title: "We never sell your personal data",
    text: "Your information isn't sold to third parties for marketing.",
  },
  {
    to: "4",
    title: "Blockchain records are public",
    text: "Timestamps, ownership and WRT transactions are visible and can't be altered.",
  },
  {
    to: "7",
    title: "You stay in control",
    text: "Ask to access, correct, delete or export your data.",
  },
];

const sid = (n: string) => `pp-s${n}`;
const pad = (n: string) => n.padStart(2, "0");
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const RING = 2 * Math.PI * 20; // back-to-top ring circumference

/* ------------------------------------------------------------------ */
/*  Styles. --pp = reading progress 0→1 (set by the scroll handler)    */
/*  --nav-h = height of your fixed navbar — adjust if yours differs    */
/* ------------------------------------------------------------------ */
const CSS = `
.pp-root{--pp:0;--nav-h:56px}

@keyframes ppRise{from{transform:translateY(105%)}to{transform:translateY(0)}}
@keyframes ppFade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes ppAurora{0%,100%{transform:translate3d(-4%,-2%,0) scale(1);opacity:.5}50%{transform:translate3d(4%,2%,0) scale(1.08);opacity:.8}}
@keyframes ppSpin{to{transform:rotate(360deg)}}
@keyframes ppSpinRev{to{transform:rotate(-360deg)}}
@keyframes ppPulse{0%,100%{opacity:.5;transform:scale(1)}50%{opacity:1;transform:scale(1.5)}}

.pp-rise{transform:translateY(105%);animation:ppRise .95s cubic-bezier(.22,1,.36,1) forwards;animation-delay:var(--d,0s)}
.pp-fade{opacity:0;animation:ppFade .9s cubic-bezier(.22,1,.36,1) forwards;animation-delay:var(--d,0s)}
.pp-aurora{animation:ppAurora 18s ease-in-out infinite}
.pp-spin{animation:ppSpin 70s linear infinite}
.pp-spin-rev{animation:ppSpinRev 46s linear infinite}
.pp-pulse{animation:ppPulse 2.4s ease-in-out infinite}

/* section reveal: the top rule draws across, the text fades in.
   Only active once JS has mounted, so the page never renders blank. */
.pp-ready .pp-rule{transform:scaleX(0);transform-origin:left;transition:transform 1.1s cubic-bezier(.22,1,.36,1)}
.pp-ready .pp-body{opacity:0;transition:opacity .9s ease .2s}
.pp-ready .pp-sec.pp-in .pp-rule{transform:scaleX(1)}
.pp-ready .pp-sec.pp-in .pp-body{opacity:1}

.pp-body strong{color:var(--foreground);font-weight:700}
.pp-scroll{scrollbar-width:thin;scrollbar-color:var(--accent) transparent}

@media (prefers-reduced-motion:reduce){
  .pp-rise,.pp-fade{animation:none!important;transform:none!important;opacity:1!important}
  .pp-aurora,.pp-spin,.pp-spin-rev,.pp-pulse{animation:none!important}
  .pp-ready .pp-rule,.pp-ready .pp-body{transition:none!important;opacity:1!important;transform:none!important}
}
`;

/* ------------------------------------------------------------------ */
export default function PrivacyPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLElement>(null);

  const [active, setActive] = useState(SECTIONS[0].n);
  const [open, setOpen] = useState(false); // mobile "jump to" list
  const [showTop, setShowTop] = useState(false);

  /* mark mounted → enables the reveal styles */
  useEffect(() => {
    rootRef.current?.classList.add("pp-ready");
  }, []);

  /* reading progress → --pp  (+ back-to-top visibility) */
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

  /* section reveal + scroll-spy */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const secs = root.querySelectorAll<HTMLElement>(".pp-sec");

    const reveal = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("pp-in");
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
      className="pp-root relative isolate min-h-screen overflow-x-clip bg-background text-foreground transition-colors duration-500"
    >
      <style>{CSS}</style>

      {/* ---------- themed backdrop ---------- */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="pp-aurora absolute -left-1/4 top-[-10%] h-[70vh] w-[70vw] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_22%,transparent)_0%,transparent_65%)] blur-3xl" />
        <div className="pp-aurora absolute right-[-15%] top-[30%] h-[60vh] w-[55vw] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--nav-left-band)_45%,transparent)_0%,transparent_65%)] blur-3xl [animation-delay:-6s]" />
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
          {/* signature ring: turns as you read */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 top-1/2 hidden aspect-square w-[min(46vw,440px)] -translate-y-1/2 opacity-70 md:block"
          >
            <div className="absolute inset-0" style={{ transform: "rotate(calc(var(--pp) * 240deg))" }}>
              <div className="pp-spin absolute inset-0 rounded-full border border-dashed border-foreground/20">
                <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_14px_3px_var(--accent)]" />
              </div>
            </div>
            <div className="absolute inset-[14%]" style={{ transform: "rotate(calc(var(--pp) * -320deg))" }}>
              <div className="pp-spin-rev absolute inset-0 rounded-full border border-foreground/10">
                <span className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-foreground/60" />
              </div>
            </div>
            <div className="absolute inset-[34%] rounded-full bg-accent/15 blur-2xl" />
          </div>

          <h1 className="relative font-serif text-[clamp(2.4rem,8vw,5.5rem)] font-black uppercase leading-[0.95] tracking-wider text-foreground">
            {["Privacy", "Policy"].map((w, i) => (
              <span key={w} className="block overflow-hidden pb-1">
                <span className="pp-rise block" style={{ ["--d" as string]: `${0.1 + i * 0.12}s` }}>
                  {w}
                </span>
              </span>
            ))}
          </h1>

          <p
            className="pp-fade relative mt-6 max-w-xl text-sm leading-relaxed text-foreground/70 sm:text-base"
            style={{ ["--d" as string]: "0.45s" }}
          >
            How Warrior Comics collects, uses and protects your information, and what stays public on the
            blockchain.
          </p>
          <p
            className="pp-fade relative mt-3 text-xs text-foreground/50"
            style={{ ["--d" as string]: "0.55s" }}
          >
            Last updated October 2026
          </p>

          {/* key points — each jumps to the full clause */}
          <ul className="relative mt-10 grid gap-5 sm:grid-cols-3 sm:gap-6">
            {SUMMARY.map((s, i) => (
              <li key={s.to} className="pp-fade" style={{ ["--d" as string]: `${0.7 + i * 0.12}s` }}>
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
            className="pp-fade relative mt-12 block h-px w-full bg-gradient-to-r from-accent/70 via-foreground/15 to-transparent"
            style={{ ["--d" as string]: "1.1s" }}
          />
        </header>

        {/* ============================================================
            BODY: contents (left) + policy (right)
        ============================================================ */}
        <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
          {/* ---------- mobile / tablet jump bar ---------- */}
          <div className="sticky top-[var(--nav-h)] z-30 -mx-5 mb-8 border-b border-foreground/10 bg-background/85 px-5 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:hidden">
            <button
              type="button"
              aria-expanded={open}
              aria-controls="pp-mobile-toc"
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
              id="pp-mobile-toc"
              className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <ol className="pp-scroll max-h-[55vh] overflow-y-auto pb-3">
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

          {/* ---------- desktop contents + sword progress ---------- */}
          <aside className="hidden lg:block">
            <nav
              aria-label="Privacy policy contents"
              className="sticky top-[calc(var(--nav-h)_+_2rem)]"
            >
              <p className="mb-4 text-sm font-bold text-foreground">On this page</p>
              <div className="flex gap-4">
                {/* the blade fills as you read */}
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

                <ol className="pp-scroll max-h-[calc(100vh_-_var(--nav-h)_-_9rem)] flex-1 space-y-0.5 overflow-y-auto pr-1">
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

          {/* ---------- the policy ---------- */}
          <article ref={articleRef} className="min-w-0">
            {SECTIONS.map((s) => {
              const on = active === s.n;
              return (
                <section
                  key={s.n}
                  id={sid(s.n)}
                  data-n={s.n}
                  aria-labelledby={`${sid(s.n)}-h`}
                  className="pp-sec scroll-mt-[calc(var(--nav-h)_+_4.5rem)] pb-10 lg:scroll-mt-[calc(var(--nav-h)_+_2rem)] md:pb-14"
                >
                  <span
                    aria-hidden
                    className="pp-rule block h-px w-full bg-gradient-to-r from-accent/70 via-foreground/15 to-transparent"
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
                  <div className="pp-body max-w-prose space-y-1 text-sm leading-relaxed text-foreground/80 sm:pl-10 sm:text-[15px] sm:leading-7">
                    {s.body}
                  </div>
                </section>
              );
            })}
          </article>
        </div>
      </div>

      {/* ---------- back to top with reading-progress ring ---------- */}
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