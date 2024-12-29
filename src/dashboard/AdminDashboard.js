import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard"); // Quản lý phần nội dung hiển thị
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xử lý logout
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div style={{ display: "flex" }}>
      <h1>DashboardContent</h1>
    </div>
  );
}

export default AdminDashboard;