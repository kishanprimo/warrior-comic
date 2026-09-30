"use client";

import React from "react";
import Navbar from "@/common/Navbar";
import Footer from "@/common/Footer";
import Loader from "@/components/Loader";
import BottomToTop from "@/components/Bottomtotop";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Loader />
      <Navbar />
      {children}
      <Footer />
      <BottomToTop />
    </>
  );
}
