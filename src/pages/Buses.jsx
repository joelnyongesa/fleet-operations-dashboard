import React from 'react';
import Header from '../components/Header';

function Buses({ sidebarOpen, setSidebarOpen, onLogout, vehicles, setVehicles }) {
  return (
    <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden text-black' x-ref='contentarea'>
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onLogout={onLogout} />
        <main className="grow">
            <div className="px-4 sm:px-6 lg:py-8 w-full max-w-9xl mx-auto">
                <div className="sm:flex sm:justify-between sm:items-center">
                    <div className="mb-4">
                        <h1 className="text-2xl m:text-3xl text-slate-800 font-bold">Vehicles</h1>
                    </div>
                </div>
                <div className="flex flex-col col-span-12 bg-white">
                    <div className="px-5 pt-2 pb-5">
                        <div className="text-sm text-slate-800 mr-2 w-full">
                            {/* Filters */}
                            <div>
                                <div className="bg-white rounded border border-slate-200 p-3 min-w-60">
                                    <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap">
                                        {/* Active Trips */}
                                        <div className="flex flex-col gap-2 w-full sm:w-auto">
                                            <div className="text-sm text-slate-800 font-semibold">Active Trips Only</div>
                                            <div className="flex items-center">
                                                <div className="form-switch">
                                                    <input type="checkbox" name="active-trips" id="active-trips" />
                                                    <label htmlFor="active-trips" className="bg-slate-400">
                                                        <span className="bg-white shadow-sm" ariahidden="true"></span>
                                                        <span className="sr-only">Active Trips Only</span>
                                                    </label>
                                                </div>
                                                <div className="text-sm text-slate-400 italic ml-2">Off</div>
                                            </div>
                                        </div>
                                        {/* Charging Status */}
                                        <div className="flex flex-col gap-2 w-full sm:w-auto">
                                            <label htmlFor="charging-status" className="text-sm text-slate-800 fnt-semibold">Charging Status</label>
                                            <select name="charging-status" id="charging-status" className="form-select w-full sm:w-52 truncate">
                                                <option value>Charging Status</option>
                                                <option value="charging">Charging</option>
                                                <option value="not-charging">Not Charging</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </main>
    </div>
  )
}

export default Buses