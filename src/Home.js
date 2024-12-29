import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';  // Import Navigate từ react-router-dom
import Sidebar from "./Sidebar";

function Home() {
  const authToken = localStorage.getItem("authToken");

  const [activeSection, setActiveSection] = useState('manage-users');  // Set default active section

  useEffect(() => {
    if (!authToken) {
      // Redirect to login page if there's no auth token
      <Navigate to="/" />;
    }
  }, [authToken]);

  return (
    <div style={{ display: 'flex' }}>
      {/* Pass activeSection and setActiveSection to Sidebar */}
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <div style={{ flex: 1, padding: '16px' }}>
        <Outlet />
      </div>
    </div>
  );
}

export default Home;
