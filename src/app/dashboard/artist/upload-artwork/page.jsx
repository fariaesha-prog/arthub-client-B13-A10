"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ArtworkForm from "@/app/dashboard/artist/components/ArtworkForm";

export default function UploadArtworkPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddArtwork = async (formData) => {
    setIsSubmitting(true);
    try {
      // Your ExpressJS backend API target endpoint
      const response = await fetch("http://localhost:5000/api/artworks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // If you have your JWT token saved somewhere (e.g., localStorage or cookies)
          // "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Artwork published successfully!");
        // Cleanly routes them directly to their personalized collections management layout
        router.push("/dashboard/artist/my-artworks"); 
      } else {
        alert("Failed to save artwork to backend database.");
      }
    } catch (error) {
      console.error("Backend submission error:", error);
      alert("Could not connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Create New Release</h1>
        <p className="text-xs text-gray-400">Fill in the details below to upload your artwork to the platform.</p>
      </div>
      
      <ArtworkForm onSubmit={handleAddArtwork} isSubmitting={isSubmitting} />
    </div>
  );
}