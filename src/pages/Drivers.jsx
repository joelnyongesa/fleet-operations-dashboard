// src/pages/Drivers.jsx
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { FaDownload } from "react-icons/fa6";
import LoadingSpinner from '../components/LoadingSpinner';

function Drivers({ sidebarOpen, setSidebarOpen, onLogout, drivers = [], vehicles = [] }) {
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const DRIVERS_PER_PAGE = 10;

  useEffect(() => {
    let filtered = (drivers || []).filter(d => d.id && !d.error);
    if (statusFilter) {
      filtered = filtered.filter(d => d.status === statusFilter);
    }
    if (searchTerm) {
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    filtered.sort((a, b) => {
      const valA = a[sortKey]?.toLowerCase?.() || '';
      const valB = b[sortKey]?.toLowerCase?.() || '';
      return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
    setFilteredDrivers(filtered);
    setCurrentPage(1);
  }, [drivers, searchTerm, statusFilter, sortKey, sortOrder]);

  const pageCount = Math.ceil(filteredDrivers.length / DRIVERS_PER_PAGE);
  const currentDrivers = filteredDrivers.slice(
    (currentPage - 1) * DRIVERS_PER_PAGE,
    currentPage * DRIVERS_PER_PAGE
  );

  function getVehicleForDriver(driverId) {
    return (vehicles || []).find(v => Array.isArray(v.driver) && v.driver.some(d => d.id === driverId));
  }

  function handleExportCSV() {
    const headers = ['Name', 'Email', 'Status', 'Vehicle'];
    const rows = filteredDrivers.map(driver => {
      const vehicle = getVehicleForDriver(driver.id);
      return [driver.name, driver.email, driver.status, vehicle ? vehicle.number_plate : 'Unassigned'];
    });
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'drivers.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden text-black'>
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onLogout={onLogout} />
      <main className="grow">
        <div className="px-4 sm:px-6 lg:py-8 w-full max-w-9xl mx-auto">
          <div className="sm:flex sm:justify-between sm:items-center mb-4">
            <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">Drivers</h1>
            <div className="flex gap-3">
              <input
                type="text"
                className="border rounded px-3 py-1 text-sm shadow-sm"
                placeholder="Search drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                onClick={handleExportCSV}
                className="px-3 py-1.5 bg-slate-800 text-white text-sm rounded hover:bg-slate-700"
              >
                Export CSV
              </button>
            </div>
          </div>

          <div className="flex gap-6 flex-wrap mb-6">
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-slate-700 mb-1">Status Filter</label>
              <select
                className="form-select w-48"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-slate-700 mb-1">Sort By</label>
              <select
                className="form-select w-48"
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="status">Status</option>
              </select>
            </div>
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-slate-700 mb-1">Order</label>
              <select
                className="form-select w-32"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {drivers.length === 0 ? (
              <LoadingSpinner text="Loading drivers..." />
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-100 text-xs uppercase text-gray-700">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Assigned Vehicle</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDrivers.length === 0 ? (
                    <tr>
                      <td className="px-6 py-4 text-center" colSpan="4">No drivers found.</td>
                    </tr>
                  ) : (
                    currentDrivers.map(driver => {
                      const vehicle = getVehicleForDriver(driver.id);
                      return (
                        <tr key={driver.id} className="bg-white border-b hover:bg-slate-50">
                          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{driver.name}</td>
                          <td className="px-6 py-4">{driver.email}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
                              driver.status === 'active' ? 'bg-green-100 text-green-800' :
                              driver.status === 'inactive' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>{driver.status || 'unknown'}</span>
                          </td>
                          <td className="px-6 py-4">{vehicle ? vehicle.number_plate : 'Unassigned'}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
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

export default Drivers;
