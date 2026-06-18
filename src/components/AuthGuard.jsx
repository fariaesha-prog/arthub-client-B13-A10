"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // 1. Check if token exists in localStorage (or cookies depending on where you save it)
    const token = localStorage.getItem("token"); 

    if (!token) {
      // 2. If no token, bounce them to login instantly
      router.push("/login"); 
    } else {
      // 3. If token exists, let them pass
      setAuthorized(true);
    }
  }, [router]);

  // Show a blank screen or a loading spinner while checking credentials
  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-xs text-gray-500">
        Verifying authorization status...
      </div>
    );
  }

  return children;
}