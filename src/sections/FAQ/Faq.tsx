"use client";

import React, { useMemo, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  EDIT YOUR QUESTIONS HERE (placeholder copy — replace with real     */
/*  Warrior Comics policies before launch)                             */
/* ------------------------------------------------------------------ */
export type FaqItem = { q: string; a: string; category: string };

export const FAQ_ITEMS: FaqItem[] = [
  {
    category: "About",
    q: "What is Warrior Comics?",
    a: "Warrior Comics is a decentralized platform for the Comic and Animation lovers. With WC artists can freely upload creations (Animation, 2D, 3D digital art) to showcase their talent and consumers will watch and follow their favorite segments. Not just the creator and viewer but this portal will also benefit the advertisers in future.",
  },
  {
    category: "Creators",
    q: "How the creators will be benefited from this platform?",
    a: "With a simple SignUp process creator will be able to maintain their profiles, upload their artwork to the portal with capability to keep it free or sell it as paid content (will have to follow the guidelines T&C). Based on the popularity the selected artist will get the royalty for their work in WRT (Internal Digital Tokens). They can sell their art to the entertainment industry professionals or to the interested people. Artists can also participate in the contests and win rewards.",
  },
  {
    category: "Industry",
    q: "How is this platform beneficial for the entertainment and film industry?",
    a: "The interested people or the film-makers can lease out the characters from the portal and use in their projects. The characters that will have a prebuilt fanbase among animation lovers. That will have to follow the guidelines to purchase characters for their project.",
  },
  {
    category: "About",
    q: "Why Warrior Comics?",
    a: "As we all know the fact that animation world is full of piracy. People don’t bother about the copyright infringement. Stealing of animations and other digital art is very common. So, to put the piracy to an end, we really need a decentralized platform like Warrior Comics.",
  },
  {
    category: "Technology",
    q: "How will Warrior Comics stop the piracy?",
    a: "The whole platform is based on the blockchain technology, which makes it more secure and transparent with timestamp feature of blockchain. All the characters and animations will be launched under the banner WC Originals or user generated content, For the paid content viewer will have to pay a certain amount in order to use the art uploaded by the creators. And user creation will be timestamped with blockchain technology (no one can manipulate). This will, ultimately, reduce piracy.",
  },
  {
    category: "Technology",
    q: "“Warrior Comics is the first ever decentralized animation tube.” What does that mean?",
    a: "WC platform will act like a comic art studio and animation tube for the artists. They can create their own channel and upload their creations. It will be the first ever blockchain based Animation & Comic industry tube for artists.",
  },
  {
    category: "Technology",
    q: "What is unique about Warrior Comics?",
    a: "We are working to bring the AI enabled characters to the light. These 2D, 3D AI enabled characters will work on the human voice commands. To provide ease for the animation creators our team is constantly working on new scopes within AI and Animation.",
  },
];
/* ------------------------------------------------------------------ */
const CSS = `
@keyframes faqUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes faqBar{from{transform:scaleY(0)}to{transform:scaleY(1)}}
.faq-up{animation:faqUp .7s cubic-bezier(.22,1,.36,1) both}
.faq-bar{animation:faqBar .4s ease-out both;transform-origin:top}
.faq-noscroll{scrollbar-width:none}
.faq-noscroll::-webkit-scrollbar{display:none}
.faq-scroll{scrollbar-width:thin;scrollbar-color:var(--accent) transparent}
.faq-scroll::-webkit-scrollbar{width:6px}
.faq-scroll::-webkit-scrollbar-track{background:transparent}
.faq-scroll::-webkit-scrollbar-thumb{background:var(--accent);border-radius:9999px;opacity:.6}
@media (prefers-reduced-motion:reduce){.faq-up,.faq-bar{animation:none!important}}
`;

export default function Faq({
  active = true,
  items = FAQ_ITEMS,
}: {
  /** when true the items animate in (staggered). AuthUI flips this on "Enter the Universe" */
  active?: boolean;
  items?: FaqItem[];
}) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<number | null>(0);
  const listRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((i) => i.category)))],
    [items]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .map((it, id) => ({ ...it, id }))
      .filter(
        (it) =>
          (category === "All" || it.category === category) &&
          (!q || it.q.toLowerCase().includes(q) || it.a.toLowerCase().includes(q))
      );
  }, [items, category, query]);

  /* Arrow / Home / End keyboard navigation between questions */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
    const btns = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>("[data-faq-btn]") ?? []
    );
    const i = btns.indexOf(document.activeElement as HTMLButtonElement);
    if (i < 0 || !btns.length) return;
    e.preventDefault();
    let n = i;
    if (e.key === "ArrowDown") n = (i + 1) % btns.length;
    if (e.key === "ArrowUp") n = (i - 1 + btns.length) % btns.length;
    if (e.key === "Home") n = 0;
    if (e.key === "End") n = btns.length - 1;
    btns[n].focus();
  };

  return (
    <div className="flex h-full w-full flex-col">
      <style>{CSS}</style>

      {/* ---------- header ---------- */}
      <div className="mb-5 flex shrink-0 items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Help Center</p>
          <h3 className="mt-1 font-serif text-2xl font-extrabold uppercase tracking-wide text-nav-right-heading sm:text-3xl">
            Frequently Asked Questions
          </h3>
        </div>
      </div>

      {/* ---------- search ---------- */}
      <div className="group relative mb-4 shrink-0 overflow-hidden rounded-xl border border-nav-right-line bg-black/40 backdrop-blur-md transition-all duration-300 focus-within:border-accent focus-within:shadow-[0_0_22px_-4px_var(--accent)] hover:border-nav-right-ring">
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-nav-right-text/60 transition-colors group-focus-within:text-accent"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions…"
          aria-label="Search frequently asked questions"
          className="w-full bg-transparent py-3 pl-11 pr-10 text-sm text-nav-right-heading outline-none placeholder:text-nav-right-text/50 [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-nav-right-text/60 transition-colors hover:bg-white/10 hover:text-accent"
          >
            ✕
          </button>
        )}
      </div>

      {/* ---------- categories ---------- */}
      <div className="faq-noscroll mb-5 flex shrink-0 gap-2 overflow-x-auto pb-1" role="tablist" aria-label="FAQ categories">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={category === c}
            onClick={() => setCategory(c)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-300 active:scale-95 ${category === c
                ? "border-accent bg-accent text-accent-fg shadow-[0_0_16px_-2px_var(--accent)]"
                : "border-nav-right-line bg-black/30 text-nav-right-text/80 hover:border-accent/60 hover:text-nav-right-heading"
              }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* ---------- accordion ---------- */}
      <div
        ref={listRef}
        onKeyDown={onKeyDown}
        className="faq-scroll min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain pr-2"
      >
        {filtered.map((it, idx) => {
          const open = openId === it.id;
          const btnId = `faq-btn-${it.id}`;
          const panelId = `faq-panel-${it.id}`;
          return (
            <div
              key={it.id}
              className={`relative overflow-hidden rounded-xl border backdrop-blur-md transition-all duration-500 ${open
                  ? "border-accent/50 bg-gradient-to-br from-accent/10 via-black/50 to-black/40 shadow-[0_10px_40px_-15px_var(--accent)]"
                  : "border-nav-right-line/70 bg-black/40 hover:border-nav-right-ring"
                } ${active ? "faq-up" : ""}`}
              style={active ? { animationDelay: `${200 + idx * 70}ms` } : { opacity: 0 }}
            >
              {open && <span aria-hidden className="faq-bar absolute bottom-0 left-0 top-0 w-[3px] bg-accent" />}

              <h4>
                <button
                  id={btnId}
                  data-faq-btn
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenId(open ? null : it.id)}
                  className="group flex w-full items-center gap-4 px-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 sm:px-5"
                >
                  <span
                    className={`font-serif text-xs font-bold tabular-nums transition-colors duration-300 ${open ? "text-accent" : "text-nav-right-text/40"
                      }`}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`flex-1 text-sm font-semibold leading-snug transition-colors duration-300 sm:text-[15px] ${open ? "text-nav-right-heading" : "text-nav-right-heading/90 group-hover:text-nav-right-heading"
                      }`}
                  >
                    {it.q}
                  </span>
                  <span
                    aria-hidden
                    className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${open
                        ? "rotate-180 border-accent bg-accent text-accent-fg"
                        : "border-nav-right-line text-nav-right-text/80 group-hover:border-accent/60"
                      }`}
                  >
                    <span className="absolute h-[2px] w-3 rounded bg-current" />
                    <span
                      className={`absolute h-3 w-[2px] rounded bg-current transition-transform duration-300 ${open ? "scale-y-0" : "scale-y-100"
                        }`}
                    />
                  </span>
                </button>
              </h4>

              <div
                id={panelId}
                role="region"
                aria-labelledby={btnId}
                aria-hidden={!open}
                className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
              >
                <div className="overflow-hidden">
                  <div className="px-4 pb-5 pl-[3.25rem] pr-5 sm:pl-[3.75rem]">
                    <p className="text-sm leading-relaxed text-nav-right-text/85">{it.a}</p>
                    <span className="mt-3 inline-block rounded-full border border-nav-right-line/70 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-nav-right-text/60">
                      {it.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-nav-right-line/70 bg-black/30 px-6 py-10 text-center">
            <p className="text-sm font-semibold text-nav-right-heading">No matching questions</p>
            <p className="mt-1 text-xs text-nav-right-text/70">
              Try a different keyword or browse another category.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
              className="mt-4 text-xs font-bold uppercase tracking-wider text-accent hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}