"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, Button } from "@heroui/react";
import { FEATURED_ARTWORKS } from "@/data/artworksData";

export default function FeaturedArtworks() {
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    const shuffled = [...FEATURED_ARTWORKS]
      .sort(() => 0.5 - Math.random())
      .slice(0, 6);
    setArtworks(shuffled);
  }, []);

  return (
    <section className="w-full bg-[#0b0f1a] text-white py-16 px-4 md:px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Featured artworks
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              Hand-picked by our curation team this week
            </p>
          </div>
<Link
  href="/browse"
  className="text-xs sm:text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors"
>
  See all artworks →
</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((art, idx) => (
            <motion.div
              key={art._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="h-full"
            >
              <Card className="bg-[#111625] border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 h-full flex flex-col group text-white cursor-pointer active:scale-[0.98]">

                {/* Artwork Image Area */}
                <div className={`relative w-full aspect-[4/3] bg-gradient-to-br ${art.bgGradient} p-4 flex flex-col justify-start overflow-hidden`}>
                  {art.status && (
                    <span className={`self-start text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full ${
                      art.status === "Premium"
                        ? "bg-yellow-400 text-black"
                        : "bg-white/10 text-gray-400 backdrop-blur-sm"
                    }`}>
                      {art.status}
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-1 justify-between gap-4 bg-transparent">
                  <div className="space-y-1">
                    <h3 className="font-bold text-base tracking-tight text-gray-100 group-hover:text-white transition-colors">
                      {art.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      by <span className="text-gray-400 hover:underline cursor-pointer">{art.artist}</span>
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-5 pb-5 pt-3 border-t border-white/5 mt-auto flex items-center justify-between bg-transparent">
                  <span className="text-base font-bold text-orange-500">
                    ${art.price}
                  </span>

                  <button
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-rose-500 p-2 transition-colors group/btn"
                    aria-label={`Like ${art.title}`}
                  >
                    <svg
                      className="w-4 h-4 fill-none stroke-current stroke-2 transition-transform group-hover/btn:scale-110"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                    </svg>
                    <span>{art.likes}</span>
                  </button>
                </div>

              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}