import React, { useState, useEffect } from "react";
import './Trains.css';
import 'font-awesome/css/font-awesome.min.css';

function Trains() {
  const [trains, setTrains] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTrains, setFilteredTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false); // For controlling modal visibility
  const [selectedTrain, setSelectedTrain] = useState({         // For storing the selected train data
    trName: '',
    trType: '',
    seats: '',
    description: ''
  });
  const [newTrain, setNewTrain] = useState({
    id: -1,
    trName: "",
    trType: "",
    seats: "",
    description: "",
  });



  useEffect(() => {
    const fetchTrains = async () => {
      try {
        const response = await fetch("http://192.168.0.102:8080/trains");
        if (!response.ok) {
          throw new Error("Không thể tải danh sách tàu");
        }
        const data = await response.json();
        setTrains(data);
        setFilteredTrains(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrains();
  }, []);

  useEffect(() => {
    const result = trains.filter(train =>
      train.id.toString().includes(searchQuery) ||
      train.trName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      train.trType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      train.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTrains(result);
  }, [searchQuery, trains]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };


  const handleUpdateTrain = (trNo) => {
    // console.log("2️⃣" + JSON.parse(trains))
    // const trainToUpdate = trains.find(
    //   (train) => train.trNo === trNo
    // );
    // console.log("2️⃣" + trainToUpdate)
    setSelectedTrain(trNo); // Cập nhật dữ liệu tàu vào state selectedTrain
    setShowUpdateModal(true); // Hiển thị modal
  };
    
  const handleAddTrain = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://192.168.0.102:8080/trains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTrain),
      });

      if (!response.ok) {
        throw new Error("Không thể thêm tàu");
      }

      const addedTrain = await response.json();
      setTrains([...trains, addedTrain]);
      setShowAddModal(false);
      setNewTrain({ id: "", trName: "", trType: "", seats: "", description: "" });
    } catch (err) {
      setError(err.message);
    }
  };
  const handleCloseModal = () => {
    setShowAddModal(false);
  };

  const handleCloseModalUpdate = () => {
    setShowUpdateModal(false);
  };


  const handleDeleteTrain = async (id) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa tàu này?");
    if (isConfirmed) {
      try {
        const response = await fetch(`http://192.168.0.102:8080/trains/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Không thể xóa tàu");
        }

        setTrains(trains.filter((train) => train.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };


  const handleUpdateTrainAPI = async (e) => {
    e.preventDefault();

    console.log("selectedTrain😗" + selectedTrain.id)
    try {
      // Gửi yêu cầu PUT để cập nhật tàu
      const response = await fetch(`http://192.168.0.102:8080/trains/${selectedTrain.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedTrain),
      });
  
      handleCloseModalUpdate(); // Đóng modal sau khi cập nhật
  
      const updatedTrain = await response.json();
  
      if (!response.ok) {
        const errorResponse = updatedTrain;
        setError(errorResponse.errorMessage || "Có lỗi xảy ra");
        return;
      }
  
      // Cập nhật danh sách tàu với tàu đã được cập nhật
      setTrains(
        trains.map((train) =>
          train.id === updatedTrain.id ? updatedTrain : train
        )
      );
  
      // Reset form sau khi cập nhật thành công
      setSelectedTrain({
        trNo: "",
        trName: "",
        trType: "",
        seats: "",
        description: "",
      });
  
    } catch (err) {
      setError(err.message); // Lưu thông báo lỗi vào state
    }
  };

  const handleInputAdd = (e) => {
    const { name, value } = e.target;
    setNewTrain((prevTrain) => ({
      ...prevTrain,
      [name]: value,
    }));
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedTrain((prevTrain) => ({
      ...prevTrain,
      [name]: value,
    }));
  };
  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="trains-container">
      <h1>Danh sách các tàu</h1>
      <input
        type="text"
        placeholder="Tìm kiếm tàu..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
      />

      <button onClick={() => setShowAddModal(true)} className="add-btn">
        <i className="fa fa-plus"></i>
      </button>

      {filteredTrains.length === 0 ? (
        <p>Không tìm thấy tàu nào.</p>
      ) : (
        <ul className="stations-list">
          {filteredTrains.map((train) => (
            <li key={train.id} className="station-item">
              <strong>ID:</strong> {train.id} <br />
              <strong>Tên tàu:</strong> {train.trName} <br />
              <strong>Loại:</strong> {train.trType} <br />
              <strong>Số ghế:</strong> {train.seats} <br />
              <strong>Mô tả:</strong> {train.description}
              <div className="action-buttons-stations">
                <button onClick={() => handleUpdateTrain(train)} className="update-btn-stations">
                  Cập nhật
                </button>
                <button onClick={() => handleDeleteTrain(train.id)} className="delete-btn-stations">
                  Xóa
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}


      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <span className="close-btn" onClick={handleCloseModal}>
                &times;
              </span>
            </div>
            <form onSubmit={handleAddTrain}>
              <h2>Thêm tàu mới</h2>
              <div className="form-group">
                <label htmlFor="trName">Tên tàu:</label>
                <input
                  type="text"
                  id="trName"
                  name="trName"
                  value={newTrain.trName}
                  onChange={handleInputAdd}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="trType">Loại tàu:</label>
                <input
                  type="text"
                  id="trType"
                  name="trType"
                  value={newTrain.trType}
                  onChange={handleInputAdd}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="seats">Số ghế:</label>
                <input
                  type="number"
                  id="seats"
                  name="seats"
                  value={newTrain.seats}
                  onChange={handleInputAdd}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Mô tả:</label>
                <textarea
                  id="description"
                  name="description"
                  value={newTrain.description}
                  onChange={handleInputAdd}
                  required
                ></textarea>
              </div>
              <div className="form-buttons">
                <button type="submit" className="submit-btn">Thêm tàu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUpdateModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <span className="close-btn" onClick={handleCloseModalUpdate}>
                &times;
              </span>
            </div>
            <form onSubmit={handleUpdateTrainAPI} >
              <h2>Cập nhật thông tin tàu</h2>
              <div className="form-group">
                <label htmlFor="trName">Tên tàu:</label>
                <input
                  type="text"
                  id="trName"
                  name="trName"
                  value={selectedTrain.trName} // Lấy giá trị từ selectedTrain
                  onChange={handleInputChange}
                  required
                   className="input-field"
                />
              </div>
              <div className="form-group">
                <label htmlFor="trType">Loại tàu:</label>
                <input
                  type="text"
                  id="trType"
                  name="trType"
                  value={selectedTrain.trType} // Lấy giá trị từ selectedTrain
                  onChange={handleInputChange}
                  required
                   className="input-field"
                />
              </div>
              <div className="form-group">
                <label htmlFor="seats">Số ghế:</label>
                <input
                  type="number"
                  id="seats"
                  name="seats"
                  value={selectedTrain.seats} // Lấy giá trị từ selectedTrain
                  onChange={handleInputChange}
                   className="input-field"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Mô tả:</label>
                <textarea
                  id="description"
                  name="description"
                  value={selectedTrain.description} // Lấy giá trị từ selectedTrain
                  onChange={handleInputChange}
                   className="input-field"
                  required
                ></textarea>
              </div>
              <div className="form-buttons">
                <button type="submit" className="submit-btn">Cập nhật tàu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Trains;
