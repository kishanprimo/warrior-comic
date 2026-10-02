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
    // Load muted state from localStorage on mount
    const savedMuted = localStorage.getItem("videoMuted");
    if (savedMuted !== null) {
      setMutedState(savedMuted === "true");
    }
  }, []);

  const setMuted = (muted: boolean) => {
    setMutedState(muted);
    localStorage.setItem("videoMuted", String(muted));
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
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
