import React, { useMemo } from 'react';
import Header from '../components/Header';
import CardTemplate from '../cards/CardTemplate';
import LineChartTemplate from '../cards/LineChartTemplate';
import LocationCardTemplate from '../cards/LocationCardTemplate';

function Dashboard({ sidebarOpen, setSidebarOpen, onLogout, vehicles, setVehicles, drivers, setDrivers }) {
    const kpiData = useMemo(() => {
        if (!vehicles || vehicles.length === 0) {
            return {
                totalVehicles: 0,
                vehicleStatusCounts: { idle: 0, active: 0, maintenance: 0, carging: 0 },
                totalDrivers: 0,
                driverStatus: 'N/A',
                ongoingCharging: 0,
                unresolvedMaintenance: 0,
            };
        }

        // Vehicle status counts
        const statusCounts = vehicles.reduce((acc, vehicle) => {
            const status = vehicle.current_status || 'unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, { idle: 0, active: 0, maintenance: 0, charging: 0 });

        // Ongoing charging sessions.
        const ongoingChargingCount = vehicles.reduce((count, vehicle) => {
            if(Array.isArray(vehicle.charging_sessions)){
                const ongoing = vehicle.charging_sessions.some(session => session.end_time === null);
                return count + (ongoing ? 1 : 0);
            }
            return count;
        }, 0);

        // Unresolved maintenance -> As Upcoming maintenances
        const unresolvedMaintenanceCount = vehicles.reduce((count, vehicle) => {
            if (Array.isArray(vehicle.maintenance_records)) {
                const unresolved = vehicle.maintenance_records.some(record => !record.resolved);
                return count + (unresolved ? 1 : 0);
            }
            return count;
        }, 0);

        const validDrivers = Array.isArray(drivers) ? drivers.filter(d => !d.error) : [];
        const totalDriversCount = validDrivers.length;

        const driverStatusCounts = validDrivers.reduce((acc, driver) => {
            if (driver.is_available) {
                acc['Available'] = (acc['Available'] || 0) + 1;
            } else {
                acc['Unavailable'] = (acc['Unavailable'] || 0) + 1;
            }
            return acc;
        }, { Available: 0, Unavailable: 0});

        return {
            totalVehicles: vehicles.length,
            vehicleStatusCounts: statusCounts,
            totalDrivers: totalDriversCount,
            driverStatus: driverStatusCounts,
            ongoingCharging: ongoingChargingCount,
            unresolvedMaintenance: unresolvedMaintenanceCount,
        };
    }, [vehicles, drivers])
  return (
    <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden text-black' x-ref='contentarea'>
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onLogout={onLogout} />
        <main className="grow">
            <div className="px-4 sm:px-6 lg:py-8 w-full max-w-9xl mx-auto">
                {/* Page header */}
                <div className="sm:flex sm:justify-between sm:items-center">
                    <div className="mb-4">
                        <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">Dashboard ✨</h1>
                    </div>
                </div>
                {/* KPIs */}
                <div className="grid grid-cols-12 gap-3 mb-4">
                    <div className="grid grid-cols-12 gap-3 col-span-full">
                    {/* Total Vehicles (Count of the vehicles) */}
                        {<CardTemplate header={"Total Buses"} content={kpiData.totalVehicles} />}
                        {<CardTemplate header={"Bus Statuses"} content={kpiData.vehicleStatusCounts} />}
                        {<CardTemplate header={"Total Drivers"} content={kpiData.totalDrivers} />}
                        {<CardTemplate header={"Driver Status"} content={kpiData.driverStatus} />}
                        {<CardTemplate header={"Ongoing Charging Sessions"} content={kpiData.ongoingCharging} />}
                        {<CardTemplate header={"Upcoming Maintenance"} content={kpiData.unresolvedMaintenance} />}
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