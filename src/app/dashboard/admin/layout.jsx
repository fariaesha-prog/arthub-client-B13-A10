"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read the logged-in user from localStorage
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.role?.toLowerCase() === "admin") {
          setIsAdmin(true);
        } else {
          // If logged in but not an admin, boot them to the homepage
          router.push("/");
        }
      } catch (e) {
        console.error("Error parsing user data:", e);
        router.push("/login");
      }
    } else {
      // Not logged in at all
      router.push("/login");
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0E14]">
        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Render nothing while redirecting unauthorized users
  if (!isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-[#0B0E14] text-white">
      {/* Admin navigation layout can go here if you build a custom admin sidebar */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}