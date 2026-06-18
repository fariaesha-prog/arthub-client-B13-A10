"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Card, Button} from "@heroui/react";
import { ART_CATEGORIES } from "@/data/categoriesData";

export default function ArtCategories() {
  return (
    <section className="w-full bg-[#0b0f1a] text-white py-16 px-4 md:px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading Container */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Browse by Category
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Explore curated original creations across diverse artistic mediums
            </p>
          </div>
          
          <Button
            as={Link}
            href="/categories"
            variant="light"
            color="secondary"
            size="sm"
            className="text-xs sm:text-sm font-medium text-purple-400 hover:text-purple-300 group p-2 min-w-0"
            endContent={
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            }
          >
            All mediums
          </Button>
        </div>

        {/* Categories Responsive Grid - 4-column layout mapping */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ART_CATEGORIES.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="h-56 relative group"
            >
              <Card
                className="w-full h-full rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all duration-300 shadow-lg text-white bg-transparent"
              >
                {/* Background Art Image via HeroUI Optimization Engine */}
              <Image
  src={category.image}
  alt={category.name}
  fill
  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
/>

                {/* Linear Gradient & Interactive Purple Glow Layers */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0b0f1a] via-[#0b0f1a]/50 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
                <div className="absolute inset-0 z-10 bg-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content Placement Layout */}
                <div className="absolute inset-0 p-5 flex flex-col justify-end z-20">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight transition-transform duration-300 group-hover:-translate-y-1">
                    {category.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mt-1 overflow-hidden">
                    <p className="text-xs text-gray-400 transition-transform duration-300 group-hover:-translate-y-0.5">
                      {category.count}
                    </p>
                    
                    {/* Subtle sliding explore text element on hover */}
                    <span className="text-purple-400 text-xs font-semibold opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                      Explore →
                    </span>
                  </div>
                </div>

                {/* Semantic Next.js Link Wrapper overlaying the interactive card coordinate */}
                <Link 
                  href={`/browse?category=${category.slug}`} 
                  className="absolute inset-0 z-30" 
                  aria-label={`Browse ${category.name}`} 
                />
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}