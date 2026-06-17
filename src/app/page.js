import ArtCategories from "@/components/ArtCategories";
import FeaturedArtworks from "@/components/FeaturedArtworks";
import HeroSection from "@/components/HeroSection";
import TopArtists from "@/components/TopArtists";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
     <HeroSection />
     <ArtCategories />
     <FeaturedArtworks />
     <TopArtists />
    </div>
  );
}
