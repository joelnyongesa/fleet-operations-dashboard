// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import { Routes, Route } from "react-router";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./auth/Login";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true); //Remember to set this to true.


  return isAuthenticated ? (
    <div className='flex h-screen overflow-hidden'>
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Routes>
        <Route path="/" element={<Dashboard sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />} />
      </Routes>
    </div>
  ) : (
    <Routes>
      <Route path="/*" element={<Login />} />
    </Routes>
  )
}

export default App
