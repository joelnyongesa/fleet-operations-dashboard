// src/pages/Reports.jsx
import React, { useMemo, useState } from 'react';
import Header from '../components/Header';
import CardTemplate from '../cards/CardTemplate';
import LineChartTemplate from '../cards/LineChartTemplate';
import BarChartTemplate from '../cards/BarChartTemplate';
import { exportToCSV } from '../utils/exportHelpers';

const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

function Reports({ sidebarOpen, setSidebarOpen, onLogout, vehicles = [], drivers = [], trips = [] }) {
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const reportData = useMemo(() => {
    const validVehicles = Array.isArray(vehicles) ? vehicles.filter(v => v && !v.error && v.id) : [];
    const validDrivers = Array.isArray(drivers) ? drivers.filter(d => d && !d.error && d.id) : [];
    const validTrips = Array.isArray(trips) ? trips.filter(t => t && !t.error && t.id && t.start_time) : [];

    const filteredDrivers = validDrivers.filter(driver => {
      const matchesStatus = statusFilter ? (driver.is_available ? 'Available' : 'Unavailable') === statusFilter : true;
      const matchesSearch = driver.name?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });

    const driverTripsMap = {};
    validTrips.forEach(t => {
      if (t.driver_id) {
        driverTripsMap[t.driver_id] = (driverTripsMap[t.driver_id] || 0) + 1;
      }
    });

    const tripsPerDriver = filteredDrivers.map(d => ({
      name: d.name || `Driver ${d.id}`,
      trips: driverTripsMap[d.id] || 0,
    })).sort((a, b) => b.trips - a.trips);

    const maintenanceTrends = {};
    const maintenanceCountByVehicle = [];
    const unresolvedMaintenance = [];

    validVehicles.forEach(v => {
      let maintenanceCount = 0;
      (v.maintenance_records || []).forEach(r => {
        if (r && r.record_date) {
          maintenanceCount++;
          const date = formatDate(r.record_date);
          maintenanceTrends[date] = maintenanceTrends[date] || { resolved: 0, unresolved: 0 };
          if (r.resolved) maintenanceTrends[date].resolved++;
          else maintenanceTrends[date].unresolved++;

          if (!r.resolved) {
            unresolvedMaintenance.push({
              vehicle: v.number_plate || `Vehicle ${v.id}`,
              issue: r.description || 'Unspecified Issue',
              date: formatDate(r.record_date)
            });
          }
        }
      });
      maintenanceCountByVehicle.push({
        name: v.number_plate || `Vehicle ${v.id}`,
        count: maintenanceCount
      });
    });

    const maintenanceChartData = Object.keys(maintenanceTrends).sort().map(date => ({
      date,
      resolved: maintenanceTrends[date].resolved,
      unresolved: maintenanceTrends[date].unresolved
    }));

    const tripActivity = {};
    validTrips.forEach(t => {
      const date = formatDate(t.start_time);
      tripActivity[date] = (tripActivity[date] || 0) + 1;
    });
    const tripChartData = Object.keys(tripActivity).sort().map(date => ({
      date,
      trips: tripActivity[date]
    }));

    const underutilizedVehicles = validVehicles.filter(v => {
      const recentTrips = (v.trips || []).filter(trip => {
        const startDate = new Date(trip.start_time);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return startDate >= sevenDaysAgo;
      });
      return v.current_status === 'idle' && recentTrips.length === 0;
    }).map(v => v.number_plate || `Vehicle ${v.id}`);

    return {
      tripsPerDriver,
      maintenanceChartData,
      maintenanceCountByVehicle,
      tripChartData,
      unresolvedMaintenance,
      underutilizedVehicles,
    };
  }, [vehicles, drivers, trips, statusFilter, searchTerm]);

  return (
    <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden text-black'>
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onLogout={onLogout} />
      <main className="grow">
        <div className="px-4 sm:px-6 lg:py-8 w-full max-w-9xl mx-auto">
          <div className="sm:flex sm:justify-between sm:items-center mb-6">
            <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">Reports & Insights 📊</h1>
            <button
              onClick={() => exportToCSV(reportData.tripsPerDriver, 'trips_per_driver')}
              className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700"
            >
              Export Trips Data
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <input
              type="text"
              placeholder="Search driver name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border px-3 py-2 rounded w-1/3"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border px-3 py-2 rounded"
            >
              <option value="">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>

          <div className="grid grid-cols-12 gap-3 mb-4">
            <CardTemplate header={"Underutilized Vehicles (7d)"} content={reportData.underutilizedVehicles.length} />
            <CardTemplate header={"Unresolved Maintenances"} content={reportData.unresolvedMaintenance.length} />
          </div>

          <div className="bg-white shadow rounded-lg p-4 border border-slate-200 mb-6">
            <BarChartTemplate
              chartData={reportData.tripsPerDriver}
              xKey="name"
              yKey="trips"
              title="Trips Per Driver"
            />
          </div>

          <div className="bg-white shadow rounded-lg p-4 border border-slate-200 mb-6">
            <LineChartTemplate
              chartData={reportData.maintenanceChartData}
              title="Maintenance Trends Over Time"
              xKey="date"
              yKeys={["resolved", "unresolved"]}
              colors={["#10B981", "#EF4444"]}
              stacked={false}
            />
          </div>

          <div className="bg-white shadow rounded-lg p-4 border border-slate-200 mb-6">
            <BarChartTemplate
              chartData={reportData.maintenanceCountByVehicle}
              xKey="name"
              yKey="count"
              title="Maintenance Events per Vehicle"
            />
          </div>


          {reportData.underutilizedVehicles.length > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-4 mb-6">
              <strong>Note:</strong> The following vehicles have not been used in the past 7 days:
              <ul className="list-disc list-inside mt-2">
                {reportData.underutilizedVehicles.map((v, index) => (
                  <li key={index}>{v}</li>
                ))}
              </ul>
            </div>
          )}

          {reportData.unresolvedMaintenance.length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4">
              <strong>Alert:</strong> These maintenance issues are still unresolved:
              <ul className="list-disc list-inside mt-2">
                {reportData.unresolvedMaintenance.map((item, idx) => (
                  <li key={idx}>{item.vehicle} - {item.issue} on {item.date}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Reports;
