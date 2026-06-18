"use client";
import { Card } from "@heroui/react";

export default function StatCard({ label, value, trend }) {
  return (
    <Card className="bg-[#161B22] border border-gray-800 shadow-none gap-1 p-6">
      <p className="text-small text-default-500">{label}</p>
      <h3 className="text-3xl font-bold text-white">{value}</h3>
      {trend && (
        <p className="text-small text-success">{trend}</p>
      )}
    </Card>
  );
}