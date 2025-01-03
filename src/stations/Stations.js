import React, { useState, useEffect } from "react";
import './Stations.css'; // Import CSS file
import ErrorModal from "../ErrorModal"; // Đảm bảo bạn đã import ErrorModal đúng cách
import 'font-awesome/css/font-awesome.min.css';


function Stations() {
  const [stations, setStations] = useState([]); // Danh sách các ga tàu
  const [searchQuery, setSearchQuery] = useState(""); // Trạng thái tìm kiếm
  const [filteredStations, setFilteredStations] = useState([]); // Danh sách ga tàu đã lọc
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Lưu lỗi nếu có
  const [showAddModal, setShowAddModal] = useState(false); // Trạng thái modal thêm ga tàu
  const [newStation, setNewStation] = useState({
    stationCode: "",
    stationName: "",
    city: "",
    address: "",
    latitude: '',
    longitude: ''
  });
  const [showModal, setShowModal] = useState(false); // Trạng thái modal cập nhật

  // Gọi API để lấy danh sách ga tàu
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch("http://localhost:8080/stations", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Không thể tải danh sách ga tàu");
        }

        const data = await response.json();
        setStations(data); // Lưu dữ liệu các ga tàu
        setFilteredStations(data); // Đầu tiên, hiển thị tất cả ga tàu
      } catch (err) {
        setError(err.message); // Lưu lỗi
      } finally {
        setLoading(false); // Hoàn tất tải dữ liệu
      }
    };

    fetchStations();
  }, []);

  useEffect(() => {
    // Lọc ga tàu dựa trên từ khóa tìm kiếm
    const result = stations.filter(station =>
      station.stationCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.stationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStations(result);
  }, [searchQuery, stations]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Cập nhật giá trị tìm kiếm
  };

  // Hàm thêm ga tàu
  const handleAddStation = async (e) => {
    e.preventDefault();

    console.log("👹" + JSON.stringify(newStation))
    try {
      const response = await fetch("http://localhost:8080/stations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStation),
      });

      if (!response.ok) {
        throw new Error("Không thể thêm ga tàu");
      }

      const addedStation = await response.json();
      setStations([...stations, addedStation]); // Cập nhật danh sách ga tàu mới
      setShowAddModal(false); // Ẩn modal sau khi thêm
      setNewStation({
        stationCode: "",
        stationName: "",
        city: "",
        address: "",
      }); // Reset form
    } catch (err) {
      setError(err.message); // Lưu lỗi
    }
  };

  const handleUpdateStationAPI = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8080/stations/${newStation.stationCode}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStation),
      });
      handleCloseModal()

      const updatedStation = await response.json();


      if (!response.ok) {
        const errorResponse = updatedStation;
        setError(errorResponse.errorMessage || "Có lỗi xảy ra");
        return;
      }

      setStations(
        stations.map((station) =>
          station.stationCode === updatedStation.stationCode ? updatedStation : station
        )
      ); // Cập nhật danh sách ga tàu với ga tàu đã cập nhật

      setNewStation({
        stationCode: "",
        stationName: "",
        city: "",
        address: "",
      }); // Reset form

      // Đảm bảo modal được đóng sau khi cập nhật thành công


    } catch (err) {
      setError(err.message); // Lưu thông báo lỗi vào state

    }
  };

  const closeErrorModal = () => {
    setError(null); // Đóng modal khi nhấn "Close"
  };


  // Hàm thay đổi thông tin trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStation((prevStation) => ({
      ...prevStation,
      [name]: value,
    }));
  };

  // Hàm xóa ga tàu
  const handleDeleteStation = (stationCode) => {
    // Hiển thị popup xác nhận
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa ga tàu này?");

    if (isConfirmed) {
      // Nếu người dùng xác nhận, thực hiện việc xóa
      fetch(`http://localhost:8080/stations/${stationCode}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Không thể xóa ga tàu");
          }

          setStations(stations.filter((station) => station.stationCode !== stationCode)); // Cập nhật lại danh sách
        })
        .catch((err) => {
          setError(err.message); // Lưu lỗi nếu có
        });
    }
  };

  // Hàm mở modal chỉnh sửa
  const handleUpdateStation = (stationCode) => {
    const stationToUpdate = stations.find(
      (station) => station.stationCode === stationCode
    );
    setNewStation(stationToUpdate);
    setShowModal(true); // Hiển thị modal
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setShowModal(false); // Ẩn modal
    setShowAddModal(false); // Ẩn modal thêm
    setNewStation({
      stationCode: "",
      stationName: "",
      city: "",
      address: "",
    }); // Reset form
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }


  return (
    <div className="stations-container">
      <h1>Danh sách các ga tàu</h1>

      <input
        type="text"
        placeholder="Tìm kiếm ga tàu..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
      />

      <button
        onClick={() => setShowAddModal(true)}
        className="add-btn"
      >
        <i className="fa fa-plus"></i> {/* Icon thêm */}
      </button>

      {filteredStations.length === 0 ? (
        <p>Không tìm thấy ga tàu nào.</p>
      ) : (
        <ul className="stations-list">
          {filteredStations.map((station) => (
            <li key={station.stationCode} className="station-item">
              <strong>Mã ga:</strong> {station.stationCode} <br />
              <strong>Tên ga:</strong> {station.stationName} <br />
              <strong>Thành phố:</strong> {station.city} <br />
              <strong>Địa chỉ:</strong> {station.address} <br />
              <strong>Kinh độ:</strong> {station.latitude} <br />
              <strong>Vĩ độ:</strong> {station.longitude}
              {/* Buttons chỉ hiển thị khi hover */}
              <div className="action-buttons-stations">
                <button
                  onClick={() => handleUpdateStation(station.stationCode)}
                  className="update-btn-stations"
                >
                  Cập nhật
                </button>
                <button
                  onClick={() => handleDeleteStation(station.stationCode)}
                  className="delete-btn-stations"
                >
                  Xóa
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal thêm ga tàu */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <span className="close-btn" onClick={handleCloseModal}>
                &times;
              </span>
              <h2>Thêm ga tàu</h2>
            </div>
            <form onSubmit={handleAddStation}>
              <div>
                <label>
                  Mã ga:
                  <input
                    type="text"
                    name="stationCode"
                    value={newStation.stationCode}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </label>
              </div>

              <div>
                <label>
                  Tên ga:
                  <input
                    type="text"
                    name="stationName"
                    value={newStation.stationName}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </label>
              </div>

              <div>
                <label>
                  Thành phố:
                  <input
                    type="text"
                    name="city"
                    value={newStation.city}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </label>
              </div>

              <div>
                <label>
                  Địa chỉ:
                  <input
                    type="text"
                    name="address"
                    value={newStation.address}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </label>
              </div>

              {/* Thêm ô nhập Latitude và Longitude */}
              <div>
                <label>
                  Vĩ độ (Latitude):
                  <input
                    type="number"
                    name="latitude"
                    value={newStation.latitude}
                    onChange={handleInputChange}
                    required
                    step="0.00000001" // Để cho phép nhập chính xác đến 8 chữ số thập phân
                    className="input-field"
                  />
                </label>
              </div>

              <div>
                <label>
                  Kinh độ (Longitude):
                  <input
                    type="number"
                    name="longitude"
                    value={newStation.longitude}
                    onChange={handleInputChange}
                    required
                    step="0.00000001" // Để cho phép nhập chính xác đến 8 chữ số thập phân
                    className="input-field"
                  />
                </label>
              </div>

              <button className="close-btn bottom-close-btn" onClick={handleCloseModal}>
                <i className="fa fa-times"></i> {/* Biểu tượng dấu nhân */}
              </button>
              <div className="modal-footer">
                <button type="submit" className="submit-btn">Thêm ga tàu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal cập nhật ga tàu */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <span className="close-btn" onClick={handleCloseModal}>
                &times;
              </span>
              <h2>Cập nhật ga tàu</h2>
            </div>
            <form onSubmit={handleUpdateStationAPI}>
              <div>
                <label>
                  Mã ga:
                  <input
                    type="text"
                    name="stationCode"
                    value={newStation.stationCode}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </label>
              </div>

              <div>
                <label>
                  Tên ga:
                  <input
                    type="text"
                    name="stationName"
                    value={newStation.stationName}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </label>
              </div>

              <div>
                <label>
                  Thành phố:
                  <input
                    type="text"
                    name="city"
                    value={newStation.city}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </label>
              </div>

              <div>
                <label>
                  Địa chỉ:
                  <input
                    type="text"
                    name="address"
                    value={newStation.address}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </label>
              </div>

              {/* Thêm ô nhập Latitude và Longitude */}
              <div>
                <label>
                  Vĩ độ (Latitude):
                  <input
                    type="number"
                    name="latitude"
                    value={newStation.latitude}
                    onChange={handleInputChange}
                    required
                    step="0.00000001" // Để cho phép nhập chính xác đến 8 chữ số thập phân
                    className="input-field"
                  />
                </label>
              </div>

              <div>
                <label>
                  Kinh độ (Longitude):
                  <input
                    type="number"
                    name="longitude"
                    value={newStation.longitude}
                    onChange={handleInputChange}
                    required
                    step="0.00000001" // Để cho phép nhập chính xác đến 8 chữ số thập phân
                    className="input-field"
                  />
                </label>
              </div>
              <div className="modal-footer">
                <button type="submit" className="submit-btn">Cập nhật ga tàu</button>
              </div>
              <button className="close-btn bottom-close-btn" onClick={handleCloseModal}>
                <i className="fa fa-times"></i>
              </button>
            </form>

          </div>
        </div>
      )}

      {/* Hiển thị modal lỗi nếu có */}
      {error && <ErrorModal message={error} onClose={closeErrorModal} />}
    </div>
  );
}

export default Stations;
