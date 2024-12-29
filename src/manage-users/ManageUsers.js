import React, { useState, useEffect } from "react";
import './ManageUsers.css'; // Importing the CSS file

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); // State to store selected user for viewing details

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://192.168.0.102:8080/customers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);


  const handleDeleteAccount = async (userId) => {
    // Hiển thị cảnh báo xác nhận trước khi xoá tài khoản
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xoá tài khoản này?");
  
    if (confirmDelete) {
      try {
        const response = await fetch(`http://192.168.0.102:8080/customers/${userId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("Không thể xoá tài khoản");
        }
  
        setUsers((prevUsers) => prevUsers.filter((user) => user.mailid !== userId));
        setSelectedUser(null); // Đóng modal
        alert("Tài khoản đã được xoá thành công!");
      } catch (err) {
        alert("Đã xảy ra lỗi khi xoá tài khoản: " + err.message);
      }
    }
  };
  

  const handleDeleteUser = async (mailid) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://192.168.0.102:8080/customers/${mailid}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete user");
        }

        setUsers(users.filter(user => user.mailid !== mailid));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="container">
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul className="user-list">
          {users.map((user) => (
            <li
              key={user.mailid}
              className="user-item"
              onClick={() => handleViewUser(user)} // Clickable to view user details
            >
              <div className="user-info">
                <strong>{user.fname} {user.lname}</strong><br />
                <span>Email: {user.mailid}</span>
              </div>
              <div className="user-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents click from triggering user view
                    handleDeleteUser(user.mailid);
                  }} 
                  className="delete-button"
                >
                  Xoá tài khoản
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {selectedUser && (
        <div className="modal">
          <div className="modal-content">
            <h3>Thông tin người dùng</h3>
            <p><strong>Họ tên:</strong> {selectedUser.fname} {selectedUser.lname}</p>
            <p><strong>Email:</strong> {selectedUser.mailid}</p>
            <p><strong>Địa chỉ:</strong> {selectedUser.addr}</p>
            <p><strong>SĐT:</strong> {selectedUser.phno}</p>
            <p><strong>Ngày tháng năm sinh:</strong> {selectedUser.dob}</p>
            <p><strong>Giới tính:</strong> {selectedUser.gender}</p>
            <button
              onClick={() => handleDeleteAccount(selectedUser.mailid)} 
              className="delete-button"
            >
              Xoá Tài Khoản
            </button>
            <p/>
            <button
              onClick={() => setSelectedUser(null)} 
              className="close-button"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;
