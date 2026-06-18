"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardSidebar() {
  const pathname = usePathname();

  // Helper function to dynamically calculate active Tailwind classes
  const getLinkClass = (path) => {
    const baseClass = "flex items-center gap-3 p-3 rounded-lg transition-colors";
    const activeClass = "bg-purple-900/30 text-purple-400 font-medium";
    const inactiveClass = "text-gray-400 hover:text-white";

    return `${baseClass} ${pathname === path ? activeClass : inactiveClass}`;
  };

  return (
    <aside className="w-64 h-screen bg-[#0B0E14] border-r border-gray-800 p-6 flex flex-col">
      {/* User Profile Section */}
      <div className="mb-8">
        <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold mb-3">
          AN
        </div>
        <h2 className="text-white font-bold">Aria Nakamura</h2>
        <p className="text-gray-400 text-sm">Artist · Verified ✓</p>
      </div>

      {/* Navigation Groups */}
      <div className="space-y-6 flex-1">
        
        {/* STUDIO Group */}
        <div>
          <p className="text-gray-500 text-xs font-bold uppercase mb-2 px-2">Studio</p>
          <nav className="space-y-1">
            <Link href="/dashboard/artist/overview" className={getLinkClass("/dashboard/artist")}>
              Overview
            </Link>
            <Link href="/dashboard/artist/upload-artwork" className={getLinkClass("/dashboard/artist/upload-artwork")}>
              Upload artwork
            </Link>
            <Link href="/dashboard/artist/my-artworks" className={getLinkClass("/dashboard/artist/my-artworks")}>
              My artworks
            </Link>
            <Link href="/dashboard/sales" className={getLinkClass("/dashboard/sales")}>
              Sales
            </Link>
          </nav>
        </div>

        {/* ACCOUNT Group */}
        <div>
          <p className="text-gray-500 text-xs font-bold uppercase mb-2 px-2">Account</p>
          <nav className="space-y-1">
            <Link href="/dashboard/payouts" className={getLinkClass("/dashboard/payouts")}>
              Payouts
            </Link>
            <Link href="/dashboard/settings" className={getLinkClass("/dashboard/settings")}>
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </aside>
  );
}