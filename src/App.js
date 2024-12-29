import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './login/Login.js'; 
import Home from './Home.js';  
import DashboardContent from './dashboard/AdminDashboard.js';
import ManageUsers from './manage-users/ManageUsers.js'; 
import Stations from './stations/Stations.js'; 
import RoutesPath from './routes/Routes.js'; 
import Trains from './trains/Trains.js'; 
import Schedules from './schedules/Schedules.js'; 
import TicketTypes from './ticket-types/TicketTypes.js'; 
import Pricing from './pricing/Pricing.js'; 
import Tickets from './tickets/Tickets.js'; 
import Payments from './payments/Payments.js'; 
import History from './history/History.js'; 


function App() {
  return (
    <Router>
      <Routes>
        {/* Route Login */}
        <Route path="/" element={<Login />} />

        {/* Route Home (Chứa Sidebar) */}
        <Route path="/home" element={<Home />}>
          <Route path="dashboard" element={<DashboardContent />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="stations" element={<Stations />} />
          <Route path="routes" element={<RoutesPath />} />
          <Route path="trains" element={<Trains />} />
          <Route path="schedules" element={<Schedules />} />
          <Route path="ticket-types" element={<TicketTypes />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="payments" element={<Payments />} />
          <Route path="history" element={<History />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
