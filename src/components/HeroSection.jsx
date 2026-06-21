"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@heroui/react";

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1920&auto=format&fit=crop",
    align: "bg-center",
    badge: "The premium art marketplace",
    headline: "Discover & collect extraordinary art",
    highlight: "extraordinary art",
    description: "A curated marketplace for independent artists and art collectors — where creativity meets commerce."
  },
  {
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1920&auto=format&fit=crop",
    align: "bg-bottom",
    badge: "Empowering Global Creators",
    headline: "Connect with talented independent artists",
    highlight: "independent artists",
    description: "Showcase your portfolio, manage your digital creations, and scale your personal brand globally."
  },
  {
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop",
    align: "bg-center",
    badge: "Curated Collections",
    headline: "Invest in original masterpieces",
    highlight: "original masterpieces",
    description: "Explore handpicked fine art, structured styles, and verified creations curated by worldwide critics."
  }
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { value: "12K+", label: "Original artworks" },
    { value: "3.4K+", label: "Verified artists" },
    { value: "$2.1M", label: "Artist earnings" },
    { value: "98%", label: "Buyer satisfaction" },
  ];

  const renderTitle = (text, highlight) => {
    if (!highlight) return text;
    const parts = text.split(highlight);
    return (
      <>
        {parts[0]}
        <span className="block sm:inline bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-500 bg-clip-text text-transparent">
          {highlight}
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <section className="relative w-full min-h-[85vh] lg:min-h-[90vh] bg-[#0b0f1a] text-white flex flex-col items-center justify-center px-4 md:px-8 overflow-hidden py-16">
      
      {/* Background Media Slideshow Layer */}
      <div className="absolute inset-0 w-full h-full z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.22 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className={`absolute inset-0 w-full h-full bg-no-repeat bg-cover ${SLIDES[currentSlide].align}`}
            style={{ backgroundImage: `url('${SLIDES[currentSlide].image}')` }}
          />
        </AnimatePresence>
        
        {/* Ambient Dark Theme Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f1a]/90 via-[#0b0f1a]/70 to-[#0b0f1a]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#0b0f1a_85%)]" />
      </div>

      {/* Main Center Content Wrapper */}
      <div className="w-full max-w-4xl mx-auto text-center flex flex-col items-center justify-center z-10 flex-1">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {/* HeroUI Chip Component Replacement */}
           <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-950/40 border border-purple-500/20 text-purple-400 text-xs sm:text-sm font-medium mb-6 backdrop-blur-sm">
  <svg className="w-3.5 h-3.5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/>
  </svg>
  {SLIDES[currentSlide].badge}
</div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] max-w-3xl mb-5">
              {renderTitle(SLIDES[currentSlide].headline, SLIDES[currentSlide].highlight)}
            </h1>

            <p className="text-gray-400 text-sm sm:text-lg font-normal max-w-2xl leading-relaxed mb-8 min-h-[3.5rem] sm:min-h-[3rem]">
              {SLIDES[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Action Controls Group (HeroUI Custom Wrapped CTA Buttons) */}
     <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 w-full sm:w-auto">
  <Link
    href="/browse"
    className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm transition-all duration-300 shadow-lg shadow-purple-900/20 rounded-xl text-center"
  >
    Discover & Buy Original Art
  </Link>
  <Link
    href="/register?role=artist"
    className="w-full sm:w-auto px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium text-sm transition-all duration-300 backdrop-blur-sm rounded-xl text-center"
  >
    Sell your art
  </Link>
</div>
     

        {/* Interactive Indicator Navigation Dots */}
        <div className="flex items-center gap-2 mb-10">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === index ? "w-6 bg-purple-500" : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Switch to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Platform Metric Footer Grid */}
        <div className="w-full max-w-3xl border-t border-white/5 pt-8 mt-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center text-center px-2">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-1">
                  {stat.value}
                </span>
                <span className="text-[11px] sm:text-xs text-gray-500 font-medium uppercase tracking-wider whitespace-nowrap">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}