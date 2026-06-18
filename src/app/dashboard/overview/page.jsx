// app/dashboard/overview/page.jsx
export default function OverviewPage() {
  const stats = [
    { label: "Total earnings", value: "$12,480", trend: "+24% this month" },
    { label: "Total sales", value: "142", trend: "+12 this month" },
    { label: "Profile views", value: "28.4K", trend: "+18% this month" },
    { label: "Published works", value: "18", trend: "" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Artist Studio</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#161B22] p-6 rounded-xl border border-gray-800">
            <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-green-500 text-xs">{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* Main Graph/Chart Area Placeholder */}
      <div className="bg-[#161B22] p-8 rounded-xl border border-gray-800 h-64 flex items-center justify-center">
        <p className="text-gray-500">Monthly Revenue Chart Component</p>
      </div>
    </div>
  );
}