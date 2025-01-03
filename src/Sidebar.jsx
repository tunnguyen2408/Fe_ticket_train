import React, { useState } from 'react';  // Import useState để quản lý trạng thái dialog
import { Link, useNavigate } from 'react-router-dom';  // Import useNavigate để điều hướng
import './Sidebar.css'; // Import CSS file


function Sidebar({ activeSection, setActiveSection }) {
  const navigate = useNavigate();  // Khởi tạo navigate
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);  // Quản lý trạng thái dialog

  const sections = [
    { key: 'manage-users', label: 'Người dùng', path: '/home/manage-users' },
    { key: 'stations', label: 'Ga tàu', path: '/home/stations' },
    { key: 'routes', label: 'Tuyến đường', path: '/home/routes' },
    { key: 'trains', label: 'Tàu', path: '/home/trains' },
    { key: 'schedules', label: 'Lịch trình', path: '/home/schedules' },
    { key: 'ticket-types', label: 'Các loại vé', path: '/home/ticket-types' },
    { key: 'pricing', label: 'Giá vé', path: '/home/pricing' },
    { key: 'tickets', label: 'Vé', path: '/home/tickets' },
    // { key: 'payments', label: 'Thanh toán', path: '/home/payments' },
    // { key: 'history', label: 'Lịch sử giao dịch', path: '/home/history' },
    { key: 'logout', label: 'Đăng xuất', path: '#' },
  ];

  // Logout function to clear auth token and redirect to login page
  const handleLogout = () => {
    // Xóa thông tin đăng nhập (ví dụ: xóa token)
    localStorage.removeItem('authToken');
    // Điều hướng về trang Login
    navigate('/');
  };

  const handleConfirmLogout = () => {
    setShowLogoutDialog(true); // Hiển thị dialog xác nhận
  };

  const handleCancelLogout = () => {
    setShowLogoutDialog(false); // Đóng dialog
  };

  return (
    <div style={{ width: '250px', background: '#f4f4f4', padding: '10px' }}>
      {sections.map((section) => (
        section.key !== 'logout' ? (
          <Link
            key={section.key}
            to={section.path}
            onClick={() => setActiveSection(section.key)} // Set active section on click
            className={`sidebar-item ${activeSection === section.key ? 'active' : ''}`}
            style={{
              display: 'block',
              padding: '10px',
              borderRadius: '4px',
              cursor: 'pointer',
              background: activeSection === section.key ? '#ddd' : 'transparent', // Change background for active item
              textDecoration: 'none',
              color: activeSection === section.key ? '#1976d2' : 'black',
              fontWeight: activeSection === section.key ? 'bold' : 'normal',
            }}
          >
            {section.label}
          </Link>
        ) : (
          <div
            key={section.key}
            className="sidebar-item"
            style={{
              display: 'block',
              padding: '10px',
              borderRadius: '4px',
              cursor: 'pointer',
              background: 'transparent',
              textDecoration: 'none',
              color: 'red',  // Logout item color
              fontWeight: 'normal',
            }}
            onClick={handleConfirmLogout} // Trigger the confirm logout dialog
          >
            {section.label}
          </div>
        )
      ))}

      {showLogoutDialog && (
        <>
          <div className="logout-dialog-overlay" onClick={handleCancelLogout}></div> {/* Backdrop */}
          <div className="logout-dialog">
            <h3>Bạn có chắc chắn muốn đăng xuất?</h3>
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={handleLogout} // Đăng xuất khi bấm Đồng ý
                className="confirm-btn"
              >
                Đồng ý
              </button>
              <button
                onClick={handleCancelLogout} // Đóng dialog khi bấm Hủy
                className="cancel-btn"
              >
                Hủy
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Sidebar;
