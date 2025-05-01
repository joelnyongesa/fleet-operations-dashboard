import { useState } from 'react';

import { HomeIcon, WrenchScrewdriverIcon, DocumentChartBarIcon } from '@heroicons/react/24/solid';
import { FaBus } from "react-icons/fa";
import { TbSteeringWheelFilled } from "react-icons/tb";
import { TfiShiftLeft } from 'react-icons/tfi';


function Navbar() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    // console.log(sidebarOpen);
  return (
    <div className='min-w-fit'>
        <div className='fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 opacity-100'></div>
        <div id="sidebar" className='flex flex-col absolute z-40 w-64 left-0 top-0 shrink-0 bg-slate-800 p-4 transition-all duration-200 ease-in-out overflow-y-scroll no-scrollbar lg:static lg:left-auto lg:top-auto max-lg:-translate-x-64 h-[100dvh] lg:overflow-y-auto lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 max-lg:translate-x-0'>
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
            <span></span>
            <div className="lg:hidden text-slate-500 hover:text-slate-400">
                <div className="px-3 py-2">
                    <button onClick={()=>{setSidebarOpen(!sidebarOpen)}}>
                        <TfiShiftLeft className='w-[24px] h-[24px]' />
                    </button>
                </div>
            </div>
        </div>
            <div className="space-y-8">
                <div className='text-gray-50'>
                    <ul className="mt-3">
                        <li className="px-3 py-2 rounded-sm mb-0 5 last:mb-0">
                            <a href="#" className="block text-slate-200 hover:text-white truncate transition duration-150">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <HomeIcon className='w-[24px] h-[24px]' />
                                        <span className="text-sm font-medium ml-3 lg:opacity-0 2xl:opacity-100 duration-200">Dashboard</span>
                                    </div>
                                </div>
                            </a>
                        </li>
                        <li className="px-3 py-2 rounded-sm mb-0 5 last:mb-0">
                            <a href="#" className="block text-slate-200 hover:text-white truncate transition duration-150">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <FaBus className='w-[24px] h-[24px]' />
                                        <span className="text-sm font-medium ml-3 lg:opacity-0 2xl:opacity-100 duration-200">Vehicles</span>
                                    </div>
                                </div>
                            </a>
                        </li>
                        <li className="px-3 py-2 rounded-sm mb-0 5 last:mb-0">
                            <a href="#" className="block text-slate-200 hover:text-white truncate transition duration-150">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <TbSteeringWheelFilled className='w-[24px] h-[24px]' />
                                        <span className="text-sm font-medium ml-3 lg:opacity-0 2xl:opacity-100 duration-200">Drivers</span>
                                    </div>
                                </div>
                            </a>
                        </li>
                        <li className="px-3 py-2 rounded-sm mb-0 5 last:mb-0">
                            <a href="#" className="block text-slate-200 hover:text-white truncate transition duration-150">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <WrenchScrewdriverIcon className='w-[24px] h-[24px]' />
                                        <span className="text-sm font-medium ml-3 lg:opacity-0 2xl:opacity-100 duration-200">Maintenance</span>
                                    </div>
                                </div>
                            </a>
                        </li>
                        <li className="px-3 py-2 rounded-sm mb-0 5 last:mb-0">
                            <a href="#" className="block text-slate-200 hover:text-white truncate transition duration-150">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <DocumentChartBarIcon className='w-[24px] h-[24px]' />
                                        <span className="text-sm font-medium ml-3 lg:opacity-0 2xl:opacity-100 duration-200">Reports</span>
                                    </div>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar