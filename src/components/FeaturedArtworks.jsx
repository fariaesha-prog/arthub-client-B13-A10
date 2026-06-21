"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@heroui/react";

export default function FeaturedArtworks() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/artworks/public");
        const data = await res.json();
        // Shuffle and take 6
        const shuffled = [...data].sort(() => 0.5 - Math.random()).slice(0, 6);
        setArtworks(shuffled);
      } catch (err) {
        console.error("Failed to fetch featured artworks", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtworks();
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

        {/* Loading skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#111625] border border-white/5 rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-white/5" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-white/5 rounded-lg w-3/4" />
                  <div className="h-3 bg-white/5 rounded-lg w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : artworks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <p className="text-gray-400 text-sm">No artworks yet.</p>
            <Link href="/browse" className="mt-2 text-xs text-purple-400 hover:text-purple-300">Browse all →</Link>
          </div>
        ) : (
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
                <Link href={`/artworks/${art._id}`} className="block h-full">
                  <Card className="bg-[#111625] border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 h-full flex flex-col group text-white cursor-pointer active:scale-[0.98]">

                    {/* Artwork Image */}
                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-white/5">
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111625]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#0b0f1a]/70 border border-white/10 text-gray-300 backdrop-blur-sm">
                        {art.category}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex flex-col flex-1 justify-between gap-4 bg-transparent">
                      <div className="space-y-1">
                        <h3 className="font-bold text-base tracking-tight text-gray-100 group-hover:text-white transition-colors truncate">
                          {art.title}
                        </h3>
                        <p className="text-xs text-gray-500">
                          by <span className="text-gray-400">{art.artist?.name || "Unknown"}</span>
                        </p>
                        {art.description && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{art.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-5 pb-5 pt-3 border-t border-white/5 mt-auto flex items-center justify-between bg-transparent">
                      <span className="text-base font-bold text-orange-500">
                        ${Number(art.price).toFixed(2)}
                      </span>
                      <span className="text-xs text-purple-400 group-hover:text-purple-300 transition-colors">
                        View details →
                      </span>
                    </div>

                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}