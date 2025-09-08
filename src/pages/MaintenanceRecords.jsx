// src/pages/Maintenance.jsx
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';

function Maintenance({ sidebarOpen, setSidebarOpen, onLogout, vehicles = [] }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetch(`${baseUrl}/maintenance-records`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        const validVehicles = vehicles.filter(v => v && v.id);
        const filtered = data.filter(record =>
          record.id &&
          record.vehicle_id &&
          validVehicles.some(v => v.id === record.vehicle_id)
        );
        setRecords(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch maintenance records:', err);
        setLoading(false);
      });
  }, [baseUrl, vehicles]);

  function getVehicleNumberPlate(vehicleId) {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? vehicle.number_plate : 'Unknown';
  }

  return (
    <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden text-black'>
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onLogout={onLogout} />
      <main className="grow">
        <div className="px-4 sm:px-6 lg:py-8 w-full max-w-9xl mx-auto">
          <h1 className="text-2xl md:text-3xl text-slate-800 font-bold mb-6">Maintenance Records</h1>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <svg className="animate-spin h-8 w-8 text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span className="ml-3 text-slate-600 font-medium">Loading maintenance records...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {records.map(record => (
                <div
                  key={record.id}
                  className="bg-white shadow rounded-lg p-4 border border-slate-200 hover:shadow-md transition"
                >
                  <h2 className="text-lg font-semibold text-slate-800 mb-2">{record.description}</h2>
                  <p className="text-sm text-slate-600">Vehicle: <span className="font-medium">{getVehicleNumberPlate(record.vehicle_id)}</span></p>
                  <p className="text-sm text-slate-600">Recorded on: {new Date(record.record_date).toLocaleString()}</p>
                  <p className="text-sm mt-1">
                    Status: <span className={`font-semibold ${record.resolved ? 'text-green-600' : 'text-red-600'}`}>{record.resolved ? 'Resolved' : 'Pending'}</span>
                  </p>
                  {record.resolved_date && (
                    <p className="text-sm text-slate-600">Resolved on: {new Date(record.resolved_date).toLocaleString()}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Maintenance;
