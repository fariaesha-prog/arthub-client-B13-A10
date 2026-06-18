import DashboardSidebar from '@/components/dashboard/DashBoardSidebar';
import React from 'react';

const DashboardLayout = ({children}) => {
    return (
        // Added 'flex h-screen' to make the container a flexbox
        <div className="flex h-screen">
            {/* The Sidebar */}
            <DashboardSidebar />
            
            {/* The Main Content area */}
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;