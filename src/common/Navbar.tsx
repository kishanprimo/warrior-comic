"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

// Logo: local file first, falls back to the Warrior Comics URL if the local file is missing.
const LOGO_LOCAL = "/Images/Imgs/Logo.png";
const LOGO_REMOTE = "/Images/Imgs/Logo.png";

const NAV_LINKS = [
  { label: "Home", href: "/", num: "一", word: "家" },
  { label: "Character", href: "/character", num: "二", word: "英雄" },
  { label: "Comics", href: "/comics", num: "三", word: "漫画" },
  { label: "Videos", href: "/videos", num: "四", word: "映像" },
  { label: "Blogs", href: "/blog", num: "五", word: "記事" },
  { label: "Login", href: "/login", num: "六", word: "入" },
  { label: "Signup", href: "/signup", num: "七", word: "登録" },
];

const SOCIALS = [
  { label: "Facebook", href: "https://www.facebook.com/Warriorcomics/" },
  { label: "Twitter", href: "https://twitter.com/WarriorComics" },
  { label: "YouTube", href: "https://www.youtube.com/channel/UCkshim4H3St0L0YrksRKa5Q" },
  { label: "Reddit", href: "https://www.reddit.com/user/WarriorComics" },
  { label: "Medium", href: "https://medium.com/@warriorcomics99" },
];

const LEGAL = [
  { label: "Terms & Conditions", href: "#" },
  { label: "Privacy Policy", href: "#" },
];

const EASE_CLASS = "ease-[cubic-bezier(0.77,0,0.175,1)]";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [logoSrc, setLogoSrc] = useState(LOGO_LOCAL);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  const rise = (delay: number) =>
    `transition-[opacity,transform] duration-700 ease-out ${
      open
        ? `opacity-100 translate-y-0 [transition-delay:${delay}s]`
        : "opacity-0 translate-y-[14px] [transition-delay:0s]"
    }`;

  return (
    <>
      {/* ------------------------------------------------ */}
      {/* HEADER BAR                                        */}
      {/* ------------------------------------------------ */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          !open
            ? "bg-[var(--background)] text-[var(--foreground)]"
            : "bg-transparent text-foreground"
        }`}
      >
        <div className="relative flex h-16 items-center justify-between px-4 sm:h-[76px] sm:px-8 md:px-10">
          <Link
            href="/"
            aria-label="Warrior Comics home"
            className="flex items-center animate-wc-nav-fade wc-delay-intro"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              onError={() => {
                if (logoSrc !== LOGO_REMOTE) setLogoSrc(LOGO_REMOTE);
              }}
              alt="Warrior Comics"
              className="h-8 w-auto object-contain sm:h-11"
            />
          </Link>

          <span className="absolute left-1/2 hidden -translate-x-1/2 text-xs sm:text-sm tracking-[0.3em] sm:block animate-wc-nav-fade wc-delay-intro-1">
            WC-Universe
          </span>

          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer animate-wc-nav-fade wc-delay-intro-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="group flex h-10 w-10 flex-col items-end justify-center gap-[6px] cursor-pointer"
            >
              <span className="h-px w-6 bg-current transition-all duration-300 group-hover:w-4" />
              <span className="h-px w-4 bg-current transition-all duration-300 group-hover:w-6" />
              <span className="h-px w-6 bg-current transition-all duration-300 group-hover:w-4" />
            </button>
          </div>

          <span
            aria-hidden
            className={`absolute bottom-0 left-0 h-px w-full origin-left animate-wc-nav-line wc-delay-intro ${
              !open ? "bg-[#f5efe6]/20" : "bg-header-line"
            }`}
          />
        </div>
      </header>

      {/* ------------------------------------------------ */}
      {/* FULLSCREEN MENU OVERLAY                           */}
      {/* ------------------------------------------------ */}
      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-[60] bg-nav-overlay transition-opacity duration-[400ms] ease-out ${
          open
            ? "opacity-100 visible pointer-events-auto [transition-delay:0s,0s]"
            : "opacity-0 invisible pointer-events-none [transition-delay:0s,1.1s]"
        }`}
      >
        {/* Theme toggle + CLOSE pill */}
        <div
          className={`absolute right-4 top-4 z-20 flex items-center gap-2 sm:right-5 sm:top-5 md:right-8 md:top-7 transition-opacity duration-[600ms] ease-out ${
            open ? "opacity-100 [transition-delay:0.9s]" : "opacity-0 [transition-delay:0s]"
          }`}
        >
          <ThemeToggle className="text-nav-left-fg md:text-nav-right-fg" />
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="rounded-full bg-accent px-3 py-1.5 font-serif text-[10px] uppercase tracking-[0.2em] text-accent-fg transition-opacity hover:opacity-80 cursor-pointer sm:px-4 sm:text-[11px]"
          >
            Close
          </button>
        </div>

        {/* ---------------- LEFT: LINK LIST ---------------- */}
        <nav
          className={`absolute inset-y-0 left-0 flex w-full flex-col bg-nav-left pt-16 text-nav-left-fg md:w-1/2 md:pt-0 transition-[clip-path] duration-[900ms] ${EASE_CLASS} ${
            open
              ? "[clip-path:inset(0_0_0_0)] [transition-delay:0.05s]"
              : "[clip-path:inset(0_100%_0_0)] [transition-delay:0.1s]"
          }`}
        >
          <ul className="flex min-h-0 flex-1 flex-col">
            {NAV_LINKS.map((link, i) => {
              const d = 0.55 + i * 0.07;
              return (
                <li key={link.label} className="relative min-h-0 flex-1">
                  <Link
                    href={link.href}
                    onClick={close}
                    className="group relative flex h-full items-center overflow-hidden px-4 sm:px-6 md:px-10"
                  >
                    {/* Hover band */}
                    <span
                      aria-hidden
                      className="absolute inset-0 origin-bottom scale-y-0 bg-nav-band transition-transform duration-500 ease-out group-hover:origin-top group-hover:scale-y-100"
                    />

                    {/* Hover loading line */}
                    <span
                      aria-hidden
                      className="absolute bottom-0 left-0 z-10 h-[2px] w-full origin-right scale-x-0 bg-accent transition-transform duration-700 ease-out group-hover:origin-left group-hover:scale-x-100"
                    />

                    {/* ---- MAIN ROW: number+title on same line, kanji right ---- */}
                    <span className="relative z-10 flex w-full items-center gap-2 sm:gap-3">
                      {/* LEFT GROUP: (1) + TITLE — kept on the same line */}
                      <span className="flex min-w-0 flex-1 items-baseline gap-1.5 sm:gap-2 transition-transform duration-500 ease-out group-hover:translate-x-2 md:group-hover:translate-x-4">
                        <sup className="shrink-0 font-serif text-[10px] leading-none sm:text-xs md:text-sm">
                          ({i + 1})
                        </sup>
                        <span className="block min-w-0 overflow-hidden py-1 pr-2">
                          <span
                            className={`block whitespace-nowrap font-serif text-[clamp(1.1rem,5vw,3.75rem)] uppercase leading-none tracking-wide transition-transform duration-[900ms] ${EASE_CLASS} ${
                              open
                                ? `translate-y-0 [transition-delay:${d}s]`
                                : "translate-y-[115%] [transition-delay:0s]"
                            }`}
                          >
                            {link.label}
                          </span>
                        </span>
                      </span>

                      {/* RIGHT: Kanji circle */}
                      <span
                        className={`block shrink-0 transition-transform duration-[600ms] ${EASE_CLASS} ${
                          open
                            ? `scale-100 [transition-delay:${d + 0.2}s]`
                            : "scale-0 [transition-delay:0s]"
                        }`}
                      >
                        <span className="relative grid h-8 w-8 place-items-center rounded-full bg-accent text-accent-fg transition-colors duration-500 group-hover:!bg-transparent sm:h-9 sm:w-9 md:h-11 md:w-11">
                          <span className="font-serif text-xs transition-opacity duration-300 group-hover:opacity-0 sm:text-sm md:text-lg">
                            {link.num}
                          </span>
                          <span className="absolute whitespace-nowrap font-serif text-xs text-nav-left-fg opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:text-sm md:text-lg">
                            {link.word}
                          </span>
                        </span>
                      </span>
                    </span>
                  </Link>

                  {/* Divider line */}
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left bg-nav-left-line transition-transform duration-[1000ms] ${EASE_CLASS} ${
                      open
                        ? `scale-x-100 [transition-delay:${d + 0.1}s]`
                        : "scale-x-0 [transition-delay:0s]"
                    }`}
                  />
                </li>
              );
            })}
          </ul>

          {/* Mobile-only contact strip */}
          <div className="flex items-center justify-between gap-2 bg-nav-overlay px-4 py-3 font-serif text-[9px] uppercase tracking-[0.1em] text-nav-right-fg sm:px-6 sm:text-[10px] sm:tracking-[0.15em] md:hidden">
            <a href="mailto:info@warriorcomics.com" className="truncate">
              info@warriorcomics.com
            </a>
            <a href="tel:+17026746666" className="shrink-0">
              +1 702-674-6666
            </a>
          </div>
        </nav>

        {/* ---------------- RIGHT: INFO PANEL (desktop) ---------------- */}
        <aside
          className="absolute inset-y-0 right-0 hidden w-1/2 flex-col justify-between overflow-y-auto px-8 py-10 text-nav-right-fg md:flex lg:px-12 xl:px-16 bg-[radial-gradient(120%_80%_at_50%_0%,var(--nav-right-from)_0%,var(--nav-right-to)_60%)]"
        >
          <div className="flex flex-col items-center justify-center pb-4 pt-8">
            <div className="relative grid place-items-center">
              <div
                className={`absolute inset-0 rounded-full border border-nav-right-ring/40 transition-all duration-1000 ${
                  open ? "scale-110 animate-wc-ping opacity-100" : "scale-50 opacity-0"
                }`}
              />
              <div
                className={`relative grid place-items-center rounded-full border border-nav-right-ring text-nav-right-heading transition-all duration-1000 ease-out w-[clamp(180px,16vw,240px)] h-[clamp(180px,16vw,240px)] shadow-[0_0_30px_var(--nav-right-glow)] ${
                  open
                    ? "opacity-100 scale-100 [transition-delay:0.7s]"
                    : "opacity-0 scale-[0.6] [transition-delay:0s]"
                }`}
              >
                <span className="select-none font-serif text-[clamp(4.5rem,8vw,7rem)] leading-none transition-transform duration-500 hover:scale-105">
                  WC
                </span>
              </div>
            </div>
          </div>

          <div className="my-auto flex w-full justify-center py-6">
            <div className="grid w-full max-w-[620px] grid-cols-2 gap-x-10 gap-y-8 lg:gap-x-16 lg:gap-y-10">
              <div className={rise(0.85)}>
                <h4 className="mb-2 font-serif text-base font-semibold uppercase tracking-[0.2em] text-nav-right-heading lg:text-lg">
                  Email
                </h4>
                <a
                  href="mailto:info@warriorcomics.com"
                  className="group inline-block font-serif text-sm uppercase tracking-[0.12em] text-nav-right-text transition-colors duration-300 hover:text-nav-right-heading lg:text-base"
                >
                  <span className="relative">
                    info@warriorcomics.com
                    <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-accent transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" />
                  </span>
                </a>
              </div>

              <div className={rise(0.9)}>
                <h4 className="mb-2 font-serif text-base font-semibold uppercase tracking-[0.2em] text-nav-right-heading lg:text-lg">
                  Office
                </h4>
                <p className="font-serif text-sm uppercase leading-relaxed tracking-[0.12em] text-nav-right-text lg:text-base">
                  PO Box 230610, Las Vegas, Nevada
                  <br />
                  Warrior Comics Inc.
                </p>
              </div>

              <div className={rise(0.95)}>
                <h4 className="mb-2 font-serif text-base font-semibold uppercase tracking-[0.2em] text-nav-right-heading lg:text-lg">
                  Phone
                </h4>
                <a
                  href="tel:+17026746666"
                  className="group inline-block font-serif text-sm uppercase tracking-[0.12em] text-nav-right-text transition-colors duration-300 hover:text-nav-right-heading lg:text-base"
                >
                  <span className="relative">
                    +1 702-674-6666
                    <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-accent transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" />
                  </span>
                </a>
              </div>

              <div className={rise(1.0)}>
                <h4 className="mb-2 font-serif text-base font-semibold uppercase tracking-[0.2em] text-nav-right-heading lg:text-lg">
                  ICO
                </h4>
                <a
                  href="https://warriortoken.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-block font-serif text-sm uppercase tracking-[0.12em] text-nav-right-text transition-colors duration-300 hover:text-nav-right-heading lg:text-base"
                >
                  <span className="relative">
                    Presale starting soon
                    <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-accent transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" />
                  </span>
                </a>
              </div>

              <div className={rise(1.05)}>
                <h4 className="mb-3 font-serif text-base font-semibold uppercase tracking-[0.2em] text-nav-right-heading lg:text-lg">
                  Social
                </h4>
                <div className="flex flex-col gap-1.5">
                  {SOCIALS.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group w-max font-serif text-xs uppercase tracking-[0.14em] text-nav-right-text transition-colors duration-300 hover:text-nav-right-heading lg:text-sm"
                    >
                      <span className="relative">
                        {s.label}
                        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-accent transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" />
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              <div className={rise(1.1)}>
                <h4 className="mb-3 font-serif text-base font-semibold uppercase tracking-[0.2em] text-nav-right-heading lg:text-lg">
                  Legal
                </h4>
                <div className="flex flex-col gap-1.5">
                  {LEGAL.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      className="group w-max font-serif text-xs uppercase tracking-[0.14em] text-nav-right-text transition-colors duration-300 hover:text-nav-right-heading lg:text-sm"
                    >
                      <span className="relative">
                        {l.label}
                        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-accent transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" />
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="relative pt-6">
            <span
              aria-hidden
              className={`absolute left-0 top-0 h-px w-full origin-left bg-nav-right-line transition-transform duration-[1200ms] ${EASE_CLASS} ${
                open
                  ? "scale-x-100 [transition-delay:0.9s]"
                  : "scale-x-0 [transition-delay:0s]"
              }`}
            />
            <div
              className={`mx-auto grid w-full max-w-[620px] grid-cols-2 gap-x-10 font-serif text-xs uppercase tracking-[0.18em] lg:text-sm ${rise(
                1.15
              )}`}
            >
              <a
                href="https://warriortoken.com/"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 transition-opacity hover:opacity-80"
              >
                <span className="inline-block text-accent transition-transform duration-300 group-hover:rotate-45">
                  ✳
                </span>{" "}
                Our ICO
              </a>
              <span className="font-semibold text-nav-right-heading">
                ©2026 – Warrior Comics
              </span>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}