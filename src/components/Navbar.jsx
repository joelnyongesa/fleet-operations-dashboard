import { useState, useEffect, useRef } from 'react';

import { HomeIcon, WrenchScrewdriverIcon, DocumentChartBarIcon } from '@heroicons/react/24/solid';
import { FaBus } from "react-icons/fa";
import { TbSteeringWheelFilled } from "react-icons/tb";
import { TfiShiftLeft, TfiShiftRight } from 'react-icons/tfi';


function Navbar({ sidebarOpen, setSidebarOpen}) {
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    // const trigger = useRef(null);
    const sidebar = useRef(null);

    useEffect(() => {
        const clickHandler = ({ target}) => {
            if (!sidebar.current) return;
            if (!sidebarOpen || sidebar.current.contains(target)){
                return;
            }
            setSidebarOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    }, [sidebarOpen, setSidebarOpen, sidebar]);

    // Closing the sidebar using ESC key
    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (!sidebarOpen || keyCode !== 27) return;
            setSidebarOpen(false);
        };
        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    }, [sidebarOpen, setSidebarOpen]);
  return (
    <div className='min-w-fit'>
        {/* Overlay */}
        <div 
            className={`fixed inset-0 bg-slate-400 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} `} 
            aria-hidden="true"
            onClick={()=>{setSidebarOpen(false)}}
        ></div>

        {/* Sidebar */}
        <div 
            ref={sidebar} 
            id="sidebar" 
            className={`flex flex-col absolute z-40 left-0 top-0 shrink-0 bg-slate-800 p-4 transition-all duration-200 ease-in-out overflow-y-scroll no-scrollbar h-[100dvh] lg:static lg:left-auto lg:top-auto lg:overflow-y-auto 2xl:!w-64 lg:z-auto ${sidebarExpanded ? 'lg:w-64' : 'lg:w-20'} max-lg:-translate-x-64 ${sidebarOpen ? 'max-lg:translate-x-0' : ''}`}
        >
        <div 
            className="flex justify-between mb-10 pr-3 sm:px-2 shrink-0"
        >
            {/* Placeholder - Will insert logo here */}
            <span></span>
            <div className="lg:hidden text-slate-500 hover:text-slate-400">
                <div className="px-3 py-2">
                    <button onClick={()=>{setSidebarOpen(false)}}>
                        <span className="sr-only">Close sidebar</span>
                        <TfiShiftLeft className='w-[24px] h-[24px]' />
                    </button>
                </div>
            </div>
        </div>
            <div className='text-gray-50 flex-grow'>
                <h3 className="text-xl uppercase text-slate-500 font-bold pl-3">
                    <span
                            className={`hidden text-center w-3 ${
                                !sidebarExpanded ? 'lg:block' : 'lg:hidden'
                            } 2xl:hidden`}
                            aria-hidden="true"
                        >
                            ...
                        </span>
                        <span
                            className={` ${
                                !sidebarExpanded ? 'lg:hidden' : 'lg:block'
                            } 2xl:block`}
                        >
                            Menu
                        </span>
                </h3>
                <ul className="mt-3 space-y-3">
                    <li className="px-3 py-2 rounded-sm mb-0 5 last:mb-0">
                        <a href="#" className="block text-slate-200 hover:text-white truncate transition duration-150">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <HomeIcon className='w-[24px] h-[24px] shrink-0' />
                                    <span className={`text-sm font-medium ml-3 transition-opacity duration-200 ${sidebarExpanded ? 'lg:opacity-100' : 'lg-opacity-0'} 2xl:opacity-100`}>Dashboard</span>
                                </div>
                            </div>
                        </a>
                    </li>
                    <li className="px-3 py-2 rounded-sm mb-0 5 last:mb-0">
                        <a href="#" className="block text-slate-200 hover:text-white truncate transition duration-150">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <FaBus className='w-[24px] h-[24px]' />
                                    <span className={`text-sm font-medium ml-3 transition-opacity duration-200 ${sidebarExpanded ? 'lg:opacity-100' : 'lg-opacity-0'} 2xl:opacity-100`}>Vehicles</span>
                                </div>
                            </div>
                        </a>
                    </li>
                    <li className="px-3 py-2 rounded-sm mb-0 5 last:mb-0">
                        <a href="#" className="block text-slate-200 hover:text-white truncate transition duration-150">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <TbSteeringWheelFilled className='w-[24px] h-[24px]' />
                                    <span className={`text-sm font-medium ml-3 transition-opacity duration-200 ${sidebarExpanded ? 'lg:opacity-100' : 'lg-opacity-0'} 2xl:opacity-100`}>Drivers</span>
                                </div>
                            </div>
                        </a>
                    </li>
                    <li className="px-3 py-2 rounded-sm mb-0 5 last:mb-0">
                        <a href="#" className="block text-slate-200 hover:text-white truncate transition duration-150">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <WrenchScrewdriverIcon className='w-[24px] h-[24px]' />
                                    <span className={`text-sm font-medium ml-3 transition-opacity duration-200 ${sidebarExpanded ? 'lg:opacity-100' : 'lg-opacity-0'} 2xl:opacity-100`}>Maintenance</span>
                                </div>
                            </div>
                        </a>
                    </li>
                    <li className="px-3 py-2 rounded-sm mb-0 5 last:mb-0">
                        <a href="#" className="block text-slate-200 hover:text-white truncate transition duration-150">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <DocumentChartBarIcon className='w-[24px] h-[24px]' />
                                    <span className={`text-sm font-medium ml-3 transition-opacity duration-200 ${sidebarExpanded ? 'lg:opacity-100' : 'lg-opacity-0'} 2xl:opacity-100`}>Reports</span>
                                </div>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
            {/* Expand/Collapse Button*/}
            <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto shrink-0">
                <div className="px-3 py-2 text-slate-500 hover:text-slate-400">
                    <button onClick={()=>{setSidebarExpanded(!sidebarExpanded)}}>
                        <span className="sr-only">Expand / Collapse sidebar</span>
                        {sidebarExpanded ? <TfiShiftLeft className='w-[24px] h-[24px]' /> : <TfiShiftRight className='w-[24px] h-[24px]' />}
                        </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar