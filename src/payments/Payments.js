import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Payments() {
  const [activeSection, setActiveSection] = useState("payments"); // Quản lý phần nội dung hiển thị
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex" }}>
      <h1>payments</h1>
    </div>
  );
}

export default Payments;