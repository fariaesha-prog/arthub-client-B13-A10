"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, Button, Avatar } from "@heroui/react";
import { TOP_ARTISTS } from "@/data/artistsData"; // Importing the mock data file

export default function TopArtists() {
  return (
    <section className="w-full bg-[#0b0f1a] text-white py-16 px-4 md:px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Top Artists
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Creators with the highest sales and global collectors this month
            </p>
          </div>
          
      <Button
  as={Link}
  href="/artists"
  variant="light"
  color="secondary"
  size="sm"
  className="text-xs sm:text-sm font-medium text-purple-400 hover:text-purple-300 p-2 min-w-0"
>
  See all creators →
</Button>
        </div>

        {/* Dynamic Grid Mapping */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TOP_ARTISTS.map((artist, idx) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="h-full relative group"
            >
              <Card
                className="w-full h-full relative flex flex-row items-center gap-4 bg-[#111625] border border-white/5 hover:border-purple-500/30 rounded-2xl p-5 transition-all duration-300 shadow-lg text-white"
              >
                
                {/* Leaderboard Position Indicator */}
                <div className="absolute top-4 right-4 flex items-center justify-center w-6 h-6 rounded-full bg-white/5 border border-white/10 group-hover:bg-purple-600/20 group-hover:border-purple-500/40 transition-all duration-300 z-20">
                  <span className="text-xs font-bold text-gray-400 group-hover:text-purple-400">
                    #{artist.rank}
                  </span>
                </div>

                {/* Optimized Avatar Component via HeroUI */}
              

                {/* Data Specifications text info */}
                <div className="space-y-1 pr-6 z-10 text-left">
                  <h3 className="font-semibold text-base sm:text-lg text-white group-hover:text-purple-300 transition-colors">
                    {artist.name}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {artist.specialty}
                  </p>
                  <div className="pt-1">
                    <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {artist.salesCount.toLocaleString()} sales
                    </span>
                  </div>
                </div>

                {/* Link referencing individual profile IDs */}
                <Link href={`/artists/${artist.id}`} className="absolute inset-0 z-30" aria-label={`View ${artist.name}`} />
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}