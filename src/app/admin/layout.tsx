'use client';

import React, { ReactNode, useEffect, useState } from 'react'
import AdminNavigation from '../dashboardComponents/AdminNavigation';
import "../dashboards.css";
import { useRouter } from 'next/navigation';

interface Props{
    children : ReactNode;
}

const AdminLayout = ({children} : Props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/me');
      const result = await response.json();
      
      if (result.success) {
        setIsAuthenticated(true);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
        <AdminNavigation />
        <main className="flex-1 overflow-y-auto">
            {children}
        </main>
    </div>
  )
}

export default AdminLayout
