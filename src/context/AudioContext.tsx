"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type AudioContextType = {
  muted: boolean;
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMutedState] = useState(false);

  useEffect(() => {
    // Load muted state from localStorage on mount (client-side only)
    if (typeof window !== "undefined") {
      const savedMuted = localStorage.getItem("videoMuted");
      if (savedMuted !== null) {
        setMutedState(savedMuted === "true");
      }
    }
  }, []);

  const setMuted = (muted: boolean) => {
    setMutedState(muted);
    if (typeof window !== "undefined") {
      localStorage.setItem("videoMuted", String(muted));
    }
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  return (
    <AudioContext.Provider value={{ muted, toggleMute, setMuted }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    // Return default values for SSR/build time
    return {
      muted: false,
      toggleMute: () => {},
      setMuted: () => {},
    };
  }
  return context;
}
