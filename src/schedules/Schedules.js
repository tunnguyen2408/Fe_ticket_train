import React, { useEffect, useState } from "react";

function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [trains, setTrains] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [stations, setStations] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    trNo: "",
    routeID: "",
    stationCode: "",
    departureTime: "",
    arrivalTime: "",
  });
  const [editId, setEditId] = useState(null);
  const [log, setLog] = useState("");

  // Fetch schedules data from the API
  const fetchSchedules = async () => {
    try {
      const response = await fetch("http://localhost:8080/schedules");
      if (!response.ok) {
        throw new Error(`Failed to fetch schedules: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Fetched schedules data:", data);
      if (Array.isArray(data)) {
        setSchedules(data);
      } else {
        console.error("Fetched data is not an array:", data);
        setSchedules([]);
      }
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setSchedules([]);
    }
  };

  // Fetch trains, routes, and stations
  const fetchAdditionalData = async () => {
    try {
      const [trainsResponse, routesResponse, stationsResponse] = await Promise.all([
        fetch("http://localhost:8080/trains"),
        fetch("http://localhost:8080/routes"),
        fetch("http://localhost:8080/stations"),
      ]);

      if (!trainsResponse.ok || !routesResponse.ok || !stationsResponse.ok) {
        throw new Error("One or more additional data fetch failed");
      }

      const [trainsData, routesData, stationsData] = await Promise.all([
        trainsResponse.json(),
        routesResponse.json(),
        stationsResponse.json(),
      ]);

      setTrains(trainsData);
      setRoutes(routesData);
      setStations(stationsData);

      // After additional data is fetched, fetch schedules
      fetchSchedules();
    } catch (err) {
      console.error("Error fetching additional data:", err);
    }
  };

  useEffect(() => {
    fetchAdditionalData();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule({ ...newSchedule, [name]: value });
  };

  // Save or update schedule
  const handleSave = async () => {
    try {
      const url = editId
        ? `http://localhost:8080/schedules/${editId}`
        : "http://localhost:8080/schedules";
      const method = editId ? "PUT" : "POST";

      const convertToISO8601 = (time) => {
        if (time) {
          // Example time format: '2024-11-27T23:32'
          const date = new Date(time); // Directly create a Date object from datetime-local format
          if (isNaN(date)) {
            console.error("Invalid date:", time);
            return null;
          }
          return date.toISOString(); // Convert to ISO 8601 format
        }
        return null;
      };
      
      const payload = editId
    ? { id: editId, ...newSchedule, 
        departureTime: convertToISO8601(newSchedule.departureTime),
        arrivalTime: convertToISO8601(newSchedule.arrivalTime) }
    : {
        ...newSchedule,
        departureTime: convertToISO8601(newSchedule.departureTime),
        arrivalTime: convertToISO8601(newSchedule.arrivalTime)
      };


      console.log("1️⃣", JSON.stringify(payload));
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      fetchSchedules();
      setNewSchedule({
        trNo: "",
        routeID: "",
        stationCode: "",
        departureTime: "",
        arrivalTime: "",
      });
      setEditId(null);
    } catch (err) {
      console.error("Failed to save schedule:", err);
    }
  };

  // Delete schedule
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8080/schedules/${id}`, { method: "DELETE" });
      fetchSchedules();
    } catch (err) {
      console.error("Failed to delete schedule:", err);
    }
  };

  const handleEdit = (schedule) => {
    // Ensure that departureTime and arrivalTime are in the correct format
    const formatDateTime = (datetime) => {
      const date = new Date(datetime);
      return date.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:MM
    };
  
    setNewSchedule({
      trNo: schedule.trNo,
      routeID: schedule.routeID,
      stationCode: schedule.stationCode,
      departureTime: formatDateTime(schedule.departureTime),
      arrivalTime: formatDateTime(schedule.arrivalTime),
    });
    setEditId(schedule.id);
  };

  // Get name by ID from the fetched data
  const getTrainName = (id) => {
    const train = trains.find((train) => train.id === id);
    return train ? train.trName : "N/A";
  };

  const getRouteName = (id) => {
    const route = routes.find((route) => route.id === id);
    return route ? route.routeName : "N/A";
  };

  const getStationName = (id) => {
    console.log(id)
    console.log(stations)
    console.log("stations")

    const station = stations.find((station) => station.stationCode === id);
    return station ? station.stationName : "N/A";
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Quản lý lịch trình</h1>
      <div style={styles.formContainer}>
        <h2 style={styles.formTitle}>{editId ? "Cập nhật lịch trình" : "Thêm mới lịch trình"}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          style={styles.form}
        >
          {/* Train dropdown */}
          <select
            name="trNo"
            value={newSchedule.trNo}
            onChange={handleInputChange}
            style={styles.input}
            required
          >
            <option value="">Chọn chuyến tàu</option>
            {trains.map((train) => (
              <option key={train.id} value={train.id}>
                {train.trName}
              </option>
            ))}
          </select>

          {/* Route dropdown */}
          <select
            name="routeID"
            value={newSchedule.routeID}
            onChange={handleInputChange}
            style={styles.input}
            required
          >
            <option value="">Chọn tuyến đường</option>
            {routes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.routeName}
              </option>
            ))}
          </select>

          {/* Station dropdown */}
          <select
            name="stationCode"
            value={newSchedule.stationCode}
            onChange={handleInputChange}
            style={styles.input}
            required
          >
            <option value="">Chọn ga</option>
            {stations.map((station) => (
              <option key={station.stationCode} value={station.stationCode}>
                {station.stationName}
              </option>
            ))}
          </select>

          {/* Departure Time input */}
          <input
            type="datetime-local"
            name="departureTime"
            value={newSchedule.departureTime}
            onChange={handleInputChange}
            style={styles.input}
            required
          />

          {/* Arrival DateTime input */}
          <input
            type="datetime-local"
            name="arrivalTime"
            value={newSchedule.arrivalTime}
            onChange={handleInputChange}
            style={styles.input}
            required
          />

          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.buttonSave}>
              {editId ? "Cập nhật" : "Thêm mới"}
            </button>
            {editId && (
              <button
                type="button"
                style={styles.buttonCancel}
                onClick={() => {
                  setNewSchedule({
                    trNo: "",
                    routeID: "",
                    stationCode: "",
                    departureTime: "",
                    arrivalTime: "",
                  });
                  setEditId(null);
                }}
              >
                Huỷ
              </button>
            )}
          </div>
        </form>
      </div>

      <table style={styles.table}>
        <thead style={styles.thead}>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Chuyến tàu</th>
            <th style={styles.th}>Tuyến đường</th>
            <th style={styles.th}>Ga</th>
            <th style={styles.th}>Giờ xuất phát</th>
            <th style={styles.th}>Giờ đến</th>
            <th style={styles.th}>Hành động</th>
          </tr>
        </thead>
        <tbody style={styles.tbody}>
          {schedules.map((schedule) => (
            <tr key={schedule.id} style={styles.tr}>
              <td style={styles.td}>{schedule.id}</td>
              <td style={styles.td}>{getTrainName(schedule.trNo)}</td>
              <td style={styles.td}>{getRouteName(schedule.routeID)}</td>
              <td style={styles.td}>{getStationName(schedule.stationCode)}</td>
              <td style={styles.td}>{schedule.departureTime}</td>
              <td style={styles.td}>{schedule.arrivalTime}</td>
              <td style={styles.actions}>
                <button
                  onClick={() => handleEdit(schedule)}
                  style={styles.buttonEdit}
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(schedule.id)}
                  style={styles.buttonDelete}
                >
                  Xoá
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: { padding: "20px" },
  title: { fontSize: "24px", fontWeight: "bold" },
  text: { fontSize: "16px", marginTop: "10px" },
  formContainer: { marginTop: "20px" },
  formTitle: { fontSize: "20px", fontWeight: "bold" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "8px", fontSize: "16px" },
  buttonGroup: { display: "flex", gap: "10px" },
  buttonSave: { padding: "10px", backgroundColor: "green", color: "white" },
  buttonCancel: { padding: "10px", backgroundColor: "red", color: "white" },
  table: { width: "100%", marginTop: "20px", borderCollapse: "collapse" },
  thead: { backgroundColor: "#f1f1f1" },
  th: { padding: "10px", border: "1px solid #ccc" },
  tbody: { textAlign: "center" },
  tr: { borderBottom: "1px solid #ddd" },
  td: { padding: "10px" },
  actions: { display: "flex", justifyContent: "center", gap: "10px" },
  buttonEdit: { backgroundColor: "yellow", color: "black", padding: "5px" },
  buttonDelete: { backgroundColor: "red", color: "white", padding: "5px" },
};

export default Schedules;
