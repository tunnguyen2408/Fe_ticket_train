import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Routes.css'; // Import CSS file

function Routes() {
  const [routes, setRoutes] = useState([]); // Quản lý danh sách các tuyến đường
  const [loading, setLoading] = useState(true); // Quản lý trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Quản lý lỗi
  const [showAddModal, setShowAddModal] = useState(false); // Quản lý trạng thái hiển thị modal
  const [stations, setStations] = useState([]); // Danh sách ga tàu
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Trạng thái tìm kiếm
  const [filteredRoute, setFilteredRoute] = useState([]); // Danh sách ga tàu đã lọc
  const [showAddStop, setShowAddStop] = useState(false);  // Trạng thái hiển thị danh sách các điểm đi qua
  const [showAddUpdateStop, setShowAddUpdateStop] = useState(false);  // Trạng thái hiển thị danh sách các điểm đi qua
  const [updatedRoute, setUpdatedRoute] = useState({
    routeName: "",
    startStation: "",
    endStation: "",
    stopStation: "",
    distance: "",
    id: "", // Giả sử bạn có một ID của tuyến đường
  });
  const [newRoute, setNewRoute] = useState({
    routeName: "",
    startStation: "",
    endStation: "",
    stopStations: "",
    distance: "",
  }); // Quản lý dữ liệu tuyến đường mới


  useEffect(() => {
    // Lọc tuyến đường dựa trên từ khóa tìm kiếm
    const result = routes.filter(route =>
      route.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.startStation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.endStation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.distance.toString().includes(searchQuery)
    );
    setFilteredRoute(result);
  }, [searchQuery, routes]);


  const navigate = useNavigate();

  // Hàm mở modal
  const openUpdateModal = (route) => {
    setUpdatedRoute(route); // Cập nhật state để modal có thông tin của tuyến đường
    setShowUpdateModal(true); // Mở modal
  };

  // Hàm đóng modal
  const closeUpdateModal = () => {
    setShowUpdateModal(false); // Đóng modal
  };


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
        setStations(data); // Lưu danh sách ga tàu
      } catch (err) {
        setError(err.message);
      }
    };

    if (stations.length === 0) { // Prevent fetching if already populated
      fetchStations();
    }
  }, []);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch("http://localhost:8080/routes", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Không thể tải danh sách tuyến đường");
        }

        const data = await response.json();
        setRoutes(data); // Lưu dữ liệu các ga tàu
      } catch (err) {
        setError(err.message); // Lưu lỗi
      } finally {
        setLoading(false); // Hoàn tất tải dữ liệu
      }
    };

    fetchRoutes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoute((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteRoute = (routeId) => {
    // Hiển thị popup xác nhận
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa tuyến đường này?");

    if (isConfirmed) {
      // Nếu người dùng xác nhận, thực hiện việc xóa
      fetch(`http://localhost:8080/routes/${routeId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Không thể xóa tuyến đường");
          }

          setRoutes(routes.filter((route) => route.id !== routeId)); // Cập nhật lại danh sách
        })
        .catch((err) => {
          setError(err.message); // Lưu lỗi nếu có
        });
    }
  };


  const handleAddRoute = async (e) => {
    e.preventDefault();
    try {
      // Chuyển mảng stopStations thành chuỗi với dấu phẩy, kèm theo startStation và endStation
      const formattedStopStations = [newRoute.startStation, ...newRoute.stopStations, newRoute.endStation].join(",");
  
      // Cập nhật lại dữ liệu newRoute với stopStations đã chuyển thành chuỗi
      const updatedRoute = { ...newRoute, stopStation: formattedStopStations };
  
      console.log("🤢" + JSON.stringify(updatedRoute));
  
      const response = await fetch("http://localhost:8080/routes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRoute),
      });
  
      if (!response.ok) {
        throw new Error("Không thể thêm tuyến đường");
      }
  
      const createdRoute = await response.json();
      setRoutes((prev) => [...prev, createdRoute]);
      setShowAddModal(false);
      setNewRoute({ routeName: "", startStation: "", endStation: "", stopStations: [] });
    } catch (err) {
      setError(err.message);
    }
  };

  // Thêm điểm vào stopStations
  const handleAddStopStation = (stationCode) => {
    setNewRoute((prevRoute) => ({
      ...prevRoute,
      stopStations: [...prevRoute.stopStations, stationCode]
    }));
    setShowAddStop(false); // Đóng danh sách sau khi chọn xong
  };


// Hàm cập nhật điểm dừng vào stopStations của tuyến đường đã chọn
const handleUpdateStopStation = (stationCode) => {
  setUpdatedRoute((prevRoute) => {
    // Tách stopStation thành mảng
    const stopStationsArray = prevRoute.stopStation.split(",");

    // Thêm stationCode vào trước điểm cuối cùng nếu không có rồi
    if (stationCode && !stopStationsArray.includes(stationCode)) {
      stopStationsArray.splice(stopStationsArray.length - 1, 0, stationCode); // Thêm vào trước điểm cuối cùng
    }

    // Chuyển mảng lại thành chuỗi và cập nhật updatedRoute
    const updatedStopStations = stopStationsArray.join(",");

    return {
      ...prevRoute,
      stopStation: updatedStopStations, // Cập nhật stopStation
    };
  });
};

  const handleRemoveStopStatio1 = (stationCodeToRemove) => {
    const updatedStopStations = updatedRoute.stopStation
      .split(",") // Chia chuỗi thành mảng
      .filter(stationCode => stationCode !== stationCodeToRemove) // Loại bỏ trạm cần xoá
      .join(","); // Chuyển lại thành chuỗi
    setUpdatedRoute(prevState => ({
      ...prevState,
      stopStation: updatedStopStations, // Cập nhật lại giá trị stopStation
    }));
  };


  // Xoá điểm khỏi stopStations
  const handleRemoveStopStation = (stationCode) => {
    setNewRoute((prevRoute) => ({
      ...prevRoute,
      stopStations: prevRoute.stopStations.filter((code) => code !== stationCode)
    }));
  };

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedRoute({
      ...updatedRoute,
      [name]: value,
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Cập nhật giá trị tìm kiếm
  };

  const handleUpdateRoute = (e) => {
    e.preventDefault();
    const { id } = updatedRoute;
  
    fetch(`http://localhost:8080/routes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedRoute),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không thể cập nhật tuyến đường");
        }
        return response.json();
      })
      .then((updatedRouteData) => {
        // Cập nhật lại danh sách tuyến đường
        setRoutes(routes.map((route) =>
          route.id === updatedRouteData.id ? updatedRouteData : route
        ));
        setShowUpdateModal(false); // Đóng modal sau khi cập nhật thành công
      })
      .catch((err) => {
        setError(err.message); // Xử lý lỗi nếu có
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h1>Danh sách các tuyến đường</h1>
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
      {filteredRoute.map((route) => (
        <div key={route.id} className="route-item">
          <div className="route-info">
            <div className="route-row">
              <span className="label">Tên tuyến đường:</span>
              <span className="value">{route.routeName}</span>
            </div>
            <div className="route-row">
              <span className="label">Điểm bắt đầu:</span>
              <span className="value">{route.startStation}</span>
            </div>
            <div className="route-row">
              <span className="label">Các điểm đi qua:</span>
              <span className="value">
                {route.stopStation && route.stopStation.length > 0
                  ? route.stopStation
                    .split(",")  // Chia chuỗi trạm thành mảng
                    .map(id => {
                      const station = stations.find(station => station.stationCode === id); // Tìm trạm theo id
                      console.log("😊" + JSON.stringify(stations))
                      return station ? station.stationName : id; // Trả về tên trạm, nếu không tìm thấy, trả về id
                    })
                    .join(" → ") // Nối các trạm lại với nhau bằng "→"
                  : "No intermediate stations"}
              </span>
            </div>
            <div className="route-row">
              <span className="label">Điểm kết thúc:</span>
              <span className="value">{route.endStation}</span>
            </div>
            <div className="route-row">
              <span className="label">Khoảng cách:</span>
              <span className="value">{route.distance} km</span>
            </div>
          </div>

          {/* Các nút chỉnh sửa và xóa */}
          <div className="route-actions">
            <button className="edit-btn" onClick={() => openUpdateModal(route)}>Edit</button>
            <button className="delete-btn-routes" onClick={() => handleDeleteRoute(route.id)}>Delete</button>
          </div>
        </div>
      ))}

      {/* Modal thêm tuyến đường */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <span className="close-btn" onClick={() => setShowAddModal(false)}> &times; </span>
              <h2>Thêm tuyến đường</h2>
            </div>
            <form onSubmit={handleAddRoute}>
              <div>
                <label>
                  Tên tuyến:
                  <input
                    type="text"
                    name="routeName"
                    value={newRoute.routeName}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </label>
              </div>

              <div>
                <label>
                  Ga bắt đầu:
                  <select
                    name="startStation"
                    value={newRoute.startStation}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  >
                    <option value="" disabled>Chọn ga bắt đầu</option>
                    {stations.map((station) => (
                      <option key={station.stationCode} value={station.stationCode}>
                        {station.stationName}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <label>
                  Ga kết thúc:
                  <select
                    name="endStation"
                    value={newRoute.endStation}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  >
                    <option value="" disabled>Chọn ga kết thúc</option>
                    {stations.map((station) => (
                      <option key={station.stationCode} value={station.stationCode}>
                        {station.stationName}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div>
                <label>Điểm đi qua:</label>
                <div className="stop-station-list">
                  {newRoute.stopStations.length === 0
                    ? <p>Chưa có điểm đi qua nào.</p>
                    : newRoute.stopStations.map((stationCode, index) => {
                      const station = stations.find((s) => s.stationCode === stationCode);
                      return (
                        <div key={index} className="stop-station-item">
                          {station?.stationName}
                          <button
                            className="remove-stop-btn"
                            onClick={(e) => {
                              e.preventDefault(); // Ngăn chặn hành động mặc định của sự kiện
                              handleRemoveStopStation(stationCode)
                            }} // Xoá điểm khi nhấn nút
                          >
                            Xoá
                          </button>
                        </div>
                      );
                    })
                  }
                </div>
                <button onClick={(e) => {
                  e.preventDefault(); // Ngăn chặn hành động mặc định của sự kiện
                  setShowAddStop(!showAddStop)
                }
                }>
                  {showAddStop ? "Đóng danh sách" : "Thêm điểm đi qua"}
                </button>

                {showAddStop && (
                  <div className="add-stop-stations">
                    {stations.map((station) => (
                      <button
                        key={station.stationCode}
                        onClick={() => handleAddStopStation(station.stationCode)}
                      >
                        {station.stationName}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label>
                  Khoảng cách (km):
                  <input
                    type="number"
                    name="distance"
                    value={newRoute.distance}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  />
                </label>
              </div>
              <div className="modal-footer">
                <button type="submit" className="submit-btn">
                  Thêm tuyến đường
                </button>
              </div>
            </form>
          </div>
        </div>)
      }

      {/* Modal cập nhật tuyến đường */}
      {showUpdateModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <span className="close-btn" onClick={() => setShowUpdateModal(false)}>
                &times;
              </span>
              <h2>Cập nhật tuyến đường</h2>
            </div>
            <form onSubmit={handleUpdateRoute}>
              <div>
                <label>
                  Tên tuyến:
                  <input
                    type="text"
                    name="routeName"
                    value={updatedRoute.routeName}
                    onChange={handleUpdateInputChange}
                    required
                    className="input-field"
                  />
                </label>
              </div>

              <div>
                <label>
                  Ga bắt đầu:
                  <select
                    name="startStation"
                    value={updatedRoute.startStation}
                    onChange={handleUpdateInputChange}
                    required
                    className="input-field"
                  >
                    <option value="" disabled>Chọn ga bắt đầu</option>
                    {stations.map((station) => (
                      <option key={station.stationCode} value={station.stationCode}>
                        {station.stationName}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <label>
                  Ga kết thúc:
                  <select
                    name="endStation"
                    value={updatedRoute.endStation}
                    onChange={handleUpdateInputChange}
                    required
                    className="input-field"
                  >
                    <option value="" disabled>Chọn ga kết thúc</option>
                    {stations.map((station) => (
                      <option key={station.stationCode} value={station.stationCode}>
                        {station.stationName}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <label>Điểm đi qua:</label>
                <div className="stop-station-list">
                  {
                    console.log("🤢" + JSON.stringify(updatedRoute.stopStation))
                  }

                  {updatedRoute.stopStation && updatedRoute.stopStation.length > 0
                    ? updatedRoute.stopStation
                      .split(",") // Chia chuỗi thành mảng
                      .length > 2 // Kiểm tra có nhiều hơn 2 điểm
                      ? updatedRoute.stopStation
                        .split(",")
                        .slice(1, -1) // Loại bỏ điểm đầu và điểm cuối
                        .map((stationCode, index) => {
                          const station = stations.find((s) => s.stationCode === stationCode); // Tìm trạm theo mã trạm
                          return (
                            <div key={index} className="stop-station-item">
                              {station ? station.stationName : stationCode} {/* Hiển thị tên trạm, nếu không có thì hiển thị mã */}
                              <button
                                className="remove-stop-btn"
                                onClick={(e) => {
                                  e.preventDefault(); // Ngăn chặn hành động mặc định của sự kiện
                                  handleRemoveStopStatio1(stationCode); // Gọi hàm xóa
                                }}
                              >
                                Xoá
                              </button>
                            </div>
                          );
                        })
                      : <p>Chưa có điểm đi qua nào.</p> // Nếu không có điểm ở giữa, hiển thị thông báo này
                    : <p>Chưa có điểm đi qua nào.</p> // Nếu không có điểm nào, hiển thị thông báo này
                  }
                </div>
                <button onClick={(e) => {
                  e.preventDefault(); // Ngăn chặn hành động mặc định của sự kiện
                  setShowAddUpdateStop(!showAddUpdateStop)
                }
                }>
                  {showAddUpdateStop ? "Đóng danh sách" : "Thêm điểm đi qua"}
                </button>

                {showAddUpdateStop && (
                  <div className="add-stop-stations">
                    {stations.map((station) => (
                      <button
                        key={station.stationCode}
                        onClick={(e) => {
                          e.preventDefault();
                          handleUpdateStopStation(station.stationCode)}
                        }
                      >
                        {station.stationName}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label>
                  Khoảng cách (km):
                  <input
                    type="number"
                    name="distance"
                    value={updatedRoute.distance}
                    onChange={handleUpdateInputChange}
                    required
                    className="input-field"
                  />
                </label>
              </div>

              <div className="modal-footer">
                <button type="submit" className="submit-btn">
                  Cập nhật tuyến đường
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Routes;
