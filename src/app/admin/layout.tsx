import React, { ReactNode } from 'react'
import AdminNavigation from '../dashboardComponents/AdminNavigation';
import "../dashboards.css";

interface Props{
    children : ReactNode;
}

const layout = ({children} : Props) => {
  return (
    <div className="flex h-screen bg-gray-100">
        <AdminNavigation />
        <main className="flex-1 overflow-y-auto">
            {children}
        </main>
    </div>
  )
}

export default layout
