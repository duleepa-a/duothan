'use client';

import AdminDashboardHeader from '../dashboardComponents/AdminDashboardHeader';
import AdminDashboardStats from '../dashboardComponents/AdminDashboardStats';
import AdminDashboardCharts from '../dashboardComponents/AdminDashboardCharts';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboardHeader />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">Welcome to OASIS Protocol Control Center</h2>
            <p className="text-amber-100">
              Monitor team progress, manage challenges, and oversee the competition in real-time.
            </p>
          </div>

          {/* Dashboard Statistics */}
          <AdminDashboardStats />

          {/* Dashboard Charts */}
          <AdminDashboardCharts />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;