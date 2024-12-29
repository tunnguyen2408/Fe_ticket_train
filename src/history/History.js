import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function History() {
  const [activeSection, setActiveSection] = useState("history"); // Quản lý phần nội dung hiển thị
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex" }}>
      <h1>history</h1>
    </div>
  );
}

export default History;