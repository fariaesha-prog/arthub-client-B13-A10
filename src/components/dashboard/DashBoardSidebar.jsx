// components/DashboardSidebar.jsx
import Link from 'next/link';

export default function DashboardSidebar() {
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
            <Link href="/dashboard/overview" className="flex items-center gap-3 p-3 bg-purple-900/30 text-purple-400 rounded-lg">
              Overview
            </Link>
            <Link href="/dashboard/upload" className="flex items-center gap-3 p-3 text-gray-400 hover:text-white rounded-lg">
              Upload artwork
            </Link>
            <Link href="/dashboard/artworks" className="flex items-center gap-3 p-3 text-gray-400 hover:text-white rounded-lg">
              My artworks
            </Link>
            <Link href="/dashboard/sales" className="flex items-center gap-3 p-3 text-gray-400 hover:text-white rounded-lg">
              Sales
            </Link>
          </nav>
        </div>

        {/* ACCOUNT Group */}
        <div>
          <p className="text-gray-500 text-xs font-bold uppercase mb-2 px-2">Account</p>
          <nav className="space-y-1">
            <Link href="/dashboard/payouts" className="flex items-center gap-3 p-3 text-gray-400 hover:text-white rounded-lg">
              Payouts
            </Link>
            <Link href="/dashboard/settings" className="flex items-center gap-3 p-3 text-gray-400 hover:text-white rounded-lg">
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </aside>
  );
}