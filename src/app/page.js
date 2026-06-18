import HeroSection from "@/components/HeroSection";
import ArtCategories from "@/components/ArtCategories";
import FeaturedArtworks from "@/components/FeaturedArtworks";
import TopArtists from "@/components/TopArtists";

export default function Home() {
  return (
    <div className="w-full flex flex-col bg-zinc-50 dark:bg-black font-sans transition-colors duration-200">
      {/* 1. Banner Section (Tagline + Carousel Placeholder) */}
      <HeroSection />
      
      {/* 2. Extra Section 2: Art Categories Grid */}
      <ArtCategories />
      
      {/* 3. Dynamic Section: Featured Artworks (Auto-refreshes, latest 6 from DB) */}
      <FeaturedArtworks />
      
      {/* 4. Extra Section 1: Top Artists (Display 3 highest-selling artists) */}
      <TopArtists />
    </div>
  );
}