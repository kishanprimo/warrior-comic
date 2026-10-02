"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/common/Navbar";
import Footer from "@/common/Footer";
import Loader from "@/components/Loader";
import BottomToTop from "@/components/Bottomtotop";
import GlobalVideo from "@/components/GlobalVideo";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    // Only show loader on first visit (check sessionStorage)
    const hasSeenLoader = sessionStorage.getItem("hasSeenLoader");
    if (!hasSeenLoader) {
      setShowLoader(true);
      sessionStorage.setItem("hasSeenLoader", "true");
    }
  }, []);

  return (
    <>
      {showLoader && <Loader />}
      <GlobalVideo />
      <Navbar />
      {children}
      <Footer />
      <BottomToTop />
    </>
  );
}
