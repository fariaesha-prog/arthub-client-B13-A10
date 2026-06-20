"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function UserDashboardSidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          setUser({ name: "Guest", role: "user" });
        }
      } else {
        setUser({ name: "Guest", role: "user" });
      }
      setLoading(false);
    };
    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  const getInitials = (name) => {
    if (!name || name === "Guest") return "??";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getLinkClass = (path) =>
    `flex items-center gap-3 p-3 rounded-lg transition-colors ${pathname === path ? "bg-purple-900/30 text-purple-400" : "text-gray-400 hover:text-white"}`;

  if (loading) return <aside className="w-64 h-screen bg-[#0B0E14] border-r border-gray-800 p-6" />;

  return (
    <aside className="w-64 h-screen bg-[#0B0E14] border-r border-gray-800 p-6 flex flex-col">
      <div className="mb-8">
        <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold mb-3">
          {getInitials(user?.name)}
        </div>
        <h2 className="text-white font-bold">{user?.name || "Guest"}</h2>
        <p className="text-gray-400 text-sm capitalize">{user?.role || "User"} · Verified ✓</p>
      </div>

      <div className="space-y-6 flex-1">
        <div>
          <p className="text-gray-500 text-xs font-bold uppercase mb-2 px-2">My Collection</p>
          <nav className="space-y-1">
            <Link href="/dashboard/user/overview" className={getLinkClass("/dashboard/user/overview")}>Overview</Link>
            <Link href="/dashboard/user/purchases" className={getLinkClass("/dashboard/user/purchases")}>Purchase History</Link>
            <Link href="/dashboard/user/collection" className={getLinkClass("/dashboard/user/collection")}>Bought Artworks</Link>
          </nav>
        </div>

        <div>
          <p className="text-gray-500 text-xs font-bold uppercase mb-2 px-2">Account</p>
          <nav className="space-y-1">
            <Link href="/dashboard/user/subscription" className={getLinkClass("/dashboard/user/subscription")}>Subscription</Link>
            <Link href="/dashboard/user/settings" className={getLinkClass("/dashboard/user/settings")}>Settings</Link>
          </nav>
        </div>
      </div>
    </aside>
  );
}