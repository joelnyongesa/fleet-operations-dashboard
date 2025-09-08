// src/pages/Buses.jsx
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

function Buses({ sidebarOpen, setSidebarOpen, onLogout, vehicles }) {
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const VEHICLES_PER_PAGE = 10;

  useEffect(() => {
    let filtered = vehicles.filter(v => v.id && !v.error);
    if (statusFilter) {
      filtered = filtered.filter(v => v.current_status === statusFilter);
    }
    if (activeOnly) {
      filtered = filtered.filter(v => v.trips && v.trips.some(trip => !trip.completed));
    }
    if (searchTerm) {
      filtered = filtered.filter(v =>
        v.number_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredVehicles(filtered);
    setCurrentPage(1);
  }, [vehicles, statusFilter, activeOnly, searchTerm]);

  const pageCount = Math.ceil(filteredVehicles.length / VEHICLES_PER_PAGE);
  const currentVehicles = filteredVehicles.slice(
    (currentPage - 1) * VEHICLES_PER_PAGE,
    currentPage * VEHICLES_PER_PAGE
  );

  return (
    <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden text-black'>
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onLogout={onLogout} />
      <main className="grow">
        <div className="px-4 sm:px-6 lg:py-8 w-full max-w-9xl mx-auto">
          <div className="sm:flex sm:justify-between sm:items-center mb-4">
            <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">Vehicles</h1>
            <input
              type="text"
              className="border rounded px-3 py-1 text-sm shadow-sm"
              placeholder="Search by plate or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col col-span-12 bg-white rounded border border-slate-200 p-3">
            <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap">
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <div className="text-sm text-slate-800 font-semibold">Active Trips Only</div>
                <div className="flex items-center">
                  <div className="form-switch">
                    <input 
                      type="checkbox" 
                      name="active-trips" 
                      id="active-trips" 
                      checked={activeOnly} 
                      onChange={(e) => setActiveOnly(e.target.checked)} 
                    />
                    <label htmlFor="active-trips" className="bg-slate-400">
                      <span className="bg-white shadow-sm" aria-hidden="true"></span>
                      <span className="sr-only">Active Trips Only</span>
                    </label>
                  </div>
                  <div className="text-sm text-slate-400 italic ml-2">{activeOnly ? 'On' : 'Off'}</div>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <label htmlFor="charging-status" className="text-sm text-slate-800 font-semibold">Charging Status</label>
                <select 
                  id="charging-status" 
                  className="form-select w-full sm:w-52 truncate" 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">All</option>
                  <option value="charging">Charging</option>
                  <option value="active">Active</option>
                  <option value="idle">Idle</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>
          </div>

          {/* Vehicle Table */}
          <div className="overflow-x-auto mt-6">
            {vehicles.length === 0 ? (
              <LoadingSpinner text="Loading vehicles..." />
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase text-gray-700">
                  <tr>
                    <th className="px-6 py-3">Number Plate</th>
                    <th className="px-6 py-3">Model</th>
                    <th className="px-6 py-3">Capacity</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Driver</th>
                  </tr>
                </thead>
                <tbody>
                  {currentVehicles.length === 0 ? (
                    <tr>
                      <td className="px-6 py-4 text-center" colSpan="5">No vehicles found.</td>
                    </tr>
                  ) : (
                    currentVehicles.map(vehicle => (
                      <tr key={vehicle.id} className="bg-white border-b hover:bg-slate-50 cursor-pointer">
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{vehicle.number_plate}</td>
                        <td className="px-6 py-4">{vehicle.model}</td>
                        <td className="px-6 py-4">{vehicle.capacity}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
                            vehicle.current_status === 'active' ? 'bg-green-100 text-green-800' :
                            vehicle.current_status === 'charging' ? 'bg-yellow-100 text-yellow-800' :
                            vehicle.current_status === 'maintenance' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>{vehicle.current_status}</span>
                        </td>
                        <td className="px-6 py-4">{Array.isArray(vehicle.driver) && vehicle.driver.length > 0 ? vehicle.driver[0]?.name : 'Unassigned'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4 space-x-2">
            {[...Array(pageCount).keys()].map(n => (
              <button
                key={n + 1}
                className={`px-3 py-1 rounded-md text-sm ${currentPage === n + 1 ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'}`}
                onClick={() => setCurrentPage(n + 1)}
              >
                {n + 1}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Buses;
