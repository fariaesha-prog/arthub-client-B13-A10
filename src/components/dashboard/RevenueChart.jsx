"use client";

import { Card } from "@heroui/react";

export default function RevenueChart({ data = [] }) {
  // Find max value to scale bars proportionally
  const maxRevenue = Math.max(...data.map(d => d.amount), 1);

  return (
    <Card className="bg-[#111625]/40 border border-white/5 p-6 rounded-2xl text-left h-full flex flex-col justify-between">
      <div>
        <h3 className="text-base font-semibold text-white tracking-tight">Monthly revenue</h3>
        <p className="text-xs text-gray-400 mt-0.5">Last 6 months · $12,480 total</p>
      </div>

      {/* Chart Visual Area */}
      <div className="flex items-end justify-between gap-2 pt-10 pb-2 h-48 w-full">
        {data.map((item, idx) => {
          const barHeightPercentage = (item.amount / maxRevenue) * 100;
          const isCurrentMonth = item.isCurrent;

          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
              {/* Animated Interactive Bar */}
              <div 
                style={{ height: `${barHeightPercentage}%` }}
                className={`w-full rounded-t-xl transition-all duration-500 ease-out origin-bottom ${
                  isCurrentMonth 
                    ? "bg-[#9353f7] shadow-[0_0_20px_rgba(147,83,247,0.2)]" 
                    : "bg-[#332a54] hover:bg-[#43376f]"
                }`}
              />
              {/* Month Label */}
              <span className={`text-xs font-medium ${isCurrentMonth ? "text-[#9353f7]" : "text-gray-500"}`}>
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}