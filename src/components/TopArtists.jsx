"use client";

import { motion } from "framer-motion";
import Link from "next/link";
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
          
          <Link 
            href="/artists" 
            className="text-xs sm:text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 group"
          >
            See all creators 
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Dynamic Grid Mapping */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TOP_ARTISTS.map((artist, idx) => (
            <motion.div
              key={artist.id} // Tracking by the future DB ID string
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative flex items-center gap-4 bg-[#111625] border border-white/5 hover:border-purple-500/30 rounded-2xl p-5 transition-all duration-300 group shadow-lg"
            >
              
              {/* Leaderboard Position Indicator */}
              <div className="absolute top-4 right-4 flex items-center justify-center w-6 h-6 rounded-full bg-white/5 border border-white/10 group-hover:bg-purple-600/20 group-hover:border-purple-500/40 transition-all duration-300">
                <span className="text-xs font-bold text-gray-400 group-hover:text-purple-400">
                  #{artist.rank}
                </span>
              </div>

              {/* Avatar Container */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-purple-500/50 transition-colors duration-300 shrink-0">
                <img
                  src={artist.avatar}
                  alt={artist.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Data Specifications text info */}
              <div className="space-y-1 pr-6">
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
              <Link href={`/artists/${artist.id}`} className="absolute inset-0 z-10" aria-label={`View ${artist.name}`} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}