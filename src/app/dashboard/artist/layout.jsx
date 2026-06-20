// src/app/dashboard/artist/layout.jsx
import AuthGuard from '@/components/AuthGuard';
import DashboardSidebar from '@/components/dashboard/DashBoardSidebar';



export default function DashboardLayout({ children }) {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-[#0B0E14] text-white">
        {/* Sidebar */}
        <div className="flex-shrink-0">
          <DashboardSidebar />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-0">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}