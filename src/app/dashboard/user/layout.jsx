import AuthGuard from '@/components/AuthGuard';
import UserDashboardSidebar from '@/components/dashboard/UserDashboardSidebar';

export default function UserDashboardLayout({ children }) {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-[#0B0E14] text-white">
        <div className="flex-shrink-0">
          <UserDashboardSidebar />
        </div>
        <main className="flex-1 overflow-y-auto p-0">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}