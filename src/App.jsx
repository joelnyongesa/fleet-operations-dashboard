// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import { Routes, Route } from "react-router";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Buses from "./pages/Buses";
import Login from "./auth/Login";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [chargingSessions, setChargingSessions] = useState([]);
  const [upcomingMaintenances, setUpcomingMaintenances] = useState([]);
  const [trips, setTrips] = useState([]);
  const [routes, setRoutes] = useState([]);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  
  useEffect(() => {
    fetch(`${baseUrl}/check-session`, {
      credentials: "include",
    }).then((response) => {
      if (response.ok){
        response.json().then((user) => setUser(user));
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    })
  }, [baseUrl]);

  useEffect(() => {
    if (isAuthenticated) {
      fetch(`${baseUrl}/vehicles`, {
        credentials: "include",
      }).then((response) => {
        if (response.ok){
          response.json().then((vehicles) => setVehicles(vehicles));
        }
      })
    }
  }, [isAuthenticated, baseUrl]);

  useEffect(() => {
    if (isAuthenticated) {
      fetch(`${baseUrl}/drivers`, {
        credentials: "include",
      }).then((response) => {
        if (response.ok){
          response.json().then((drivers) => setDrivers(drivers));
        }
      })
    }
  }, [isAuthenticated, baseUrl]);

  useEffect(() => {
    if (isAuthenticated) {
      fetch(`${baseUrl}/trips`, {
        credentials: "include",
      }).then((response) => {
        if (response.ok){
          response.json().then((trips) => setTrips(trips));
        }
      })
    }
  }, [isAuthenticated, baseUrl]);

  useEffect(() => {
    if (isAuthenticated) {
      fetch(`${baseUrl}/routes`, {
        credentials: "include",
      }).then((response) => {
        if (response.ok){
          response.json().then((routes) => setRoutes(routes));
        }
      })
    }
  }, [isAuthenticated, baseUrl]);

  console.log(vehicles);
  console.log(drivers);
  console.log(trips);
  console.log(routes);  
  

  function handleLogin(user){
    setUser(user);
    setIsAuthenticated(true);
  }

  function handleLogout(){
    setUser(null);
    setIsAuthenticated(false);
  }


  return isAuthenticated ? (
    <div className='flex h-screen overflow-hidden'>
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Routes>
        <Route path="/" element={<Dashboard sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onLogout={handleLogout} vehicles={vehicles} setVehicles={setVehicles} drivers={drivers} setDrivers={setDrivers} trips={trips} setTrips={setTrips} routesData={routes}/>} />
        <Route path="/buses" element={<Buses sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onLogout={handleLogout} vehicles={vehicles} setVehicles={setVehicles} />}/>
      </Routes>
    </div>
  ) : (
    <Routes>
      <Route path="/*" element={<Login onLogin={handleLogin} />} />
    </Routes>
  )
}

export default App
