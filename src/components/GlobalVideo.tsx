"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAudio } from "@/context/AudioContext";

const MOTION_VIDEO = "/images/Imgs/warrior-comic-motion-logo.mp4";

export default function GlobalVideo() {
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { muted } = useAudio();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !mounted) return;

    let unlocked = false;

    const attemptUnmuted = () => {
      if (!muted) {
        v.muted = false;
        v.play().catch(() => {
          v.muted = true;
          v.play().catch(() => {});
        });
      }
    };

    const unlock = () => {
      if (unlocked) return;
      unlocked = true;
      if (!muted) {
        v.muted = false;
        v.volume = 1;
        v.play().catch(() => {});
      }
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("scroll", unlock);
      window.removeEventListener("wheel", unlock);
    };

    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("keydown", unlock);
    window.addEventListener("touchstart", unlock, { passive: true });
    window.addEventListener("scroll", unlock, { passive: true });
    window.addEventListener("wheel", unlock, { passive: true });

    if (v.readyState >= 2) attemptUnmuted();
    else v.addEventListener("loadeddata", attemptUnmuted, { once: true });

    return () => {
      v.removeEventListener("loadeddata", attemptUnmuted);
      cleanup();
    };
  }, [muted, mounted]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
  }, [muted]);

  if (!mounted) {
    return null;
  }

  return (
    <video
      ref={videoRef}
      className="fixed inset-0 h-full w-full object-cover pointer-events-none -z-10 opacity-0"
      src={MOTION_VIDEO}
      autoPlay
      muted={muted}
      loop
      playsInline
      preload="auto"
    />
  );
}
