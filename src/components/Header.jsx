import React from 'react';
import { Bars3Icon } from '@heroicons/react/24/solid'

function Header({ sidebarOpen, setSidebarOpen, onLogout, }) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    async function handleLogout(){
        try {
            const response = await fetch(`${baseUrl}/logout`, {
                method: "DELETE",
                credentials: "include",
            });
            if(response.ok){
                onLogout();
            }
        }
        catch(err){
            console.log(err);
        }
    }
  return (
    <header className='sticky top-0 border-b border-slate-200 z-30 bg-white'>
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 -mb-px">
                {/* Header Left Side */}
                <div className="flex">
                    <button className="text-slate-500 hover:text-slate-600 lg:hidden" aria-controls='sidebar' aria-expanded={sidebarOpen} onClick={(e) =>{
                        e.stopPropagation();
                        setSidebarOpen(!sidebarOpen);
                    }}>
                        <span className='sr-only'>Open Sidebar</span>
                        <Bars3Icon className="h-6 w-6 fill-current" aria-hidden="true" />
                    </button>
                </div>
                {/* Header Right Side */}
                <div className="flex items-center space-x-3">
                    <button className="inline-flex justify-center items-center group">
                        <img className='w-8 h-8 rounded-full' src="https://ui-avatars.com/api/?name=D&color=7F9CF5&background=EBF4FF" alt="Demo" width={32} height={32} />
                        <div className="flex items-center truncate">
                            <span className="truncate ml-2 text-sm font-medium">Demo</span>
                        </div>
                    </button>
                    <span className="truncate text-sm font-medium bg-indigo-500 text-white whitespace-nowrap ml-3 px-3 py-2 rounded hover:bg-indigo-600 hover:cursor-pointer" onClick={handleLogout}>Log Out</span>
                </div>
            </div>
        </div>
    </header>
  )
}

export default Header