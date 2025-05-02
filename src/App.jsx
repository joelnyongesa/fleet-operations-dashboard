// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import { Routes, Route } from "react-router";
import { useState } from "react";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className='flex h-screen overflow-hidden'>
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Routes>
        <Route path="/" element={<Dashboard sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />} />
      </Routes>
    </div>
  )
}

export default App
