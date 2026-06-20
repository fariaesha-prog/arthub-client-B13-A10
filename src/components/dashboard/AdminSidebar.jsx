"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try { setUser(JSON.parse(savedUser)); }
        catch (e) { setUser({ name: "Admin", role: "admin" }); }
      }
      setLoading(false);
    };
    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  const getInitials = (name) => {
    if (!name) return "A";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const getLinkClass = (path) =>
    `flex items-center gap-3 p-3 rounded-lg transition-colors text-sm ${pathname === path ? "bg-purple-900/30 text-purple-400" : "text-gray-400 hover:text-white"}`;

  if (loading) return <aside className="w-64 h-screen bg-[#0B0E14] border-r border-gray-800 p-6" />;

  return (
    <aside className="w-64 h-screen bg-[#0B0E14] border-r border-gray-800 p-6 flex flex-col">
      <div className="mb-8">
        <div className="w-12 h-12 rounded-full bg-rose-600 flex items-center justify-center text-white font-bold mb-3">
          {getInitials(user?.name)}
        </div>
        <h2 className="text-white font-bold">{user?.name || "Admin"}</h2>
        <p className="text-gray-400 text-sm">Admin · Super User</p>
      </div>

      <div className="space-y-6 flex-1">
        <div>
          <p className="text-gray-500 text-xs font-bold uppercase mb-2 px-2">Overview</p>
          <nav className="space-y-1">
            <Link href="/dashboard/admin/overview" className={getLinkClass("/dashboard/admin/overview")}>Analytics</Link>
          </nav>
        </div>
        <div>
          <p className="text-gray-500 text-xs font-bold uppercase mb-2 px-2">Management</p>
          <nav className="space-y-1">
            <Link href="/dashboard/admin/users" className={getLinkClass("/dashboard/admin/users")}>Manage Users</Link>
            <Link href="/dashboard/admin/artworks" className={getLinkClass("/dashboard/admin/artworks")}>Manage Artworks</Link>
            <Link href="/dashboard/admin/transactions" className={getLinkClass("/dashboard/admin/transactions")}>Transactions</Link>
          </nav>
        </div>
      </div>
    </aside>
  );
}