import React, { ReactNode } from 'react'
import "../dashboards.css";


interface Props{
    children : ReactNode;
}

const layout = ({children} : Props) => {
  return (
    <div className="flex h-full">
        <main className="flex-1 overflow-y-auto dashboard">
            {children}
        </main>
    </div>
  )
}

export default layout
