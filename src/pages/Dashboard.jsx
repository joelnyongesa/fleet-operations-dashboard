import React from 'react';
import Header from '../components/Header';
import CardTemplate from '../cards/CardTemplate';
import LineChartTemplate from '../cards/LineChartTemplate';
import LocationCardTemplate from '../cards/LocationCardTemplate';

function Dashboard({ sidebarOpen, setSidebarOpen }) {
  return (
    <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden text-black' x-ref='contentarea'>
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
            <div className="px-4 sm:px-6 lg:py-8 w-full max-w-9xl mx-auto">
                {/* Page header */}
                <div className="sm:flex sm:justify-between sm:items-center">
                    <div className="mb-4 sm:mb-0">
                        <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">Dashboard ✨</h1>
                    </div>
                </div>
                {/* KPIs */}
                <div className="grid grid-cols-12 gap-3 mb-4">
                    <div className="grid grid-cols-12 gap-3 col-span-full">
                    {/* Total Vehicles (Count of the vehicles) */}
                        {<CardTemplate header={"Total Vehicles"} content={"24"} />}
                        {<CardTemplate header={"Vehicles Status"} content={"24"} />}
                        {<CardTemplate header={"Total Drivers"} content={"24"} />}
                        {<CardTemplate header={"Driver Status"} content={"24"} />}
                        {<CardTemplate header={"Ongoing Charging Sessions"} content={"24"} />}
                        {<CardTemplate header={"Upcoming Maintenance"} content={"24"} />}
                    </div>
                </div>

                {/* Line Graph */}
                <div className="flex flex-col col-span-12 bg-white shadow-sm rounded-lg border border-slate-200 mb-4">
                    {<LineChartTemplate />}
                </div>

                {/* Map - Bus Locator and Ongoing Trips */}
                <div className="flex flex-col col-span-12 bg-white shadow-sm rounded-lg border border-slate-200 mb-4">
                    {<LocationCardTemplate />}
                </div>
            </div>
        </main>
    </div>    
  )
}

export default Dashboard