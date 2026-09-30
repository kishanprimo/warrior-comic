"use client";

import React, { useEffect, useState } from "react";

const CIRC = 2 * Math.PI * 20; // circumference of the progress ring

export default function BottomToTop() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;


    const read = () => {
      // Show button when we start scrolling down from the top
      const scrollThreshold = 20; // Show button as soon as scrolling starts
      const hasScrolled = window.scrollY > scrollThreshold;

      setVisible(hasScrolled);

      // Calculate scroll progress
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
    };

    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    read(); // run once on load, in case the page opens already scrolled
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
      cancelAnimationFrame(raf);
    };
  }, []);

  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`group fixed bottom-8 right-4 z-9999 grid h-12 w-12 cursor-pointer place-items-center rounded-full border-none bg-nav-overlay p-0 text-nav-right-heading shadow-[0_10px_30px_-8px_rgba(0,0,0,0.7)] transition-all duration-500 hover:-translate-y-1 hover:scale-105 sm:right-8 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-6 opacity-0"
      }`}
      id="bottom-to-top"
    >
      <svg
        aria-hidden
        viewBox="0 0 48 48"
        className="absolute inset-0 h-full w-full -rotate-90"
      >
        <circle cx="24" cy="24" r="20" fill="none" stroke="var(--nav-right-line)" strokeWidth="2" />
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC * (1 - progress)}
        />
      </svg>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5"
      >
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
