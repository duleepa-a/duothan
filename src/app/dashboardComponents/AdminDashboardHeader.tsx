'use client';

import { useState, useEffect } from 'react';
import { Bell, Settings, User, LogOut, Shield } from 'lucide-react';

const AdminDashboardHeader = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [adminInfo, setAdminInfo] = useState<{ username: string; fullName?: string } | null>(null);

  useEffect(() => {
    fetchAdminInfo();
  }, []);

  const fetchAdminInfo = async () => {
    try {
      const response = await fetch('/api/admin/auth/me');
      const result = await response.json();
      if (result.success) {
        setAdminInfo(result.data.user);
      }
    } catch (error) {
      console.error('Failed to fetch admin info:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/auth/logout', {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Redirect to login page
        window.location.href = '/login';
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Left side - Title */}
        <div className="flex items-center space-x-3">
          <Shield className="text-amber-500" size={28} />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">OASIS Protocol</h1>
            <p className="text-sm text-gray-600">Admin Dashboard</p>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>

          {/* Settings */}
          <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
            <Settings size={20} />
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
            >
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                <User size={18} className="text-white" />
              </div>
              <span className="text-sm font-medium">
                {adminInfo?.fullName || adminInfo?.username || 'Admin'}
              </span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHeader;
