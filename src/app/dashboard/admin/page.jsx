"use client";

import { useState, useEffect } from "react";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({ totalUsers: 0, totalRevenue: 0 });

  // Later you can fetch real data from your server.js here
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Control Center</h1>
        <p className="text-sm text-gray-400 mt-1">Platform-wide overview and diagnostics.</p>
      </div>

      {/* Analytics Grid Placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#111625] border border-white/5 rounded-2xl p-6 shadow-xl">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Users</p>
          <p className="text-2xl font-bold mt-2">--</p>
        </div>
        <div className="bg-[#111625] border border-white/5 rounded-2xl p-6 shadow-xl">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Revenue</p>
          <p className="text-2xl font-bold text-orange-400 mt-2">$0.00</p>
        </div>
      </div>
    </div>
  );
}