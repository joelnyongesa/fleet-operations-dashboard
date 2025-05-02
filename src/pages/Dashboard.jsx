import React from 'react';
import Header from '../components/Header';

function Dashboard({ sidebarOpen, setSidebarOpen }) {
  return (
    <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden text-black' x-ref='contentarea'>
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    </div>
  )
}

export default Dashboard