import React, { useEffect, useState } from "react";

function Pricing() {
  const [prices, setPrices] = useState([]);
  const [trains, setTrains] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [newPrice, setNewPrice] = useState({
    trNo: "",
    typeID: "",
    routeID: "",
    fare: "",
    effectiveDate: "",
  });
  const [editId, setEditId] = useState(null);
  const [log, setLog] = useState("");

  // Fetch prices data from the API
  const fetchPrices = async () => {
    try {
      const response = await fetch("http://localhost:8080/price");
      if (!response.ok) {
        throw new Error(`Failed to fetch prices: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Fetched prices data:", data);
      if (Array.isArray(data)) {
        setPrices(data);
      } else {
        console.error("Fetched data is not an array:", data);
        setPrices([]);
      }
    } catch (err) {
      console.error("Error fetching prices:", err);
      setPrices([]);
    }
  };

  // Fetch trains, ticket types, and stations
  // Fetch additional data (trains, ticket types, stations)
  const fetchAdditionalData = async () => {
    try {
      const [trainsResponse, ticketTypesResponse, routesResponse] = await Promise.all([
        fetch("http://192.168.0.102:8080/trains"),
        fetch("http://192.168.0.102:8080/ticket-types"),
        fetch("http://192.168.0.102:8080/routes"),
      ]);

      if (!trainsResponse.ok || !ticketTypesResponse.ok || !routesResponse.ok) {
        throw new Error("One or more additional data fetch failed");
      }

      const [trainsData, ticketTypesData, routesData] = await Promise.all([
        trainsResponse.json(),
        ticketTypesResponse.json(),
        routesResponse.json(),
      ]);

      setTrains(trainsData)
      setTicketTypes(ticketTypesData);
      setRoutes(routesData);

      // After additional data is fetched, fetch prices
      fetchPrices();
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
    setNewPrice({ ...newPrice, [name]: value });
  };

  // Save or update price
  const handleSave = async () => {
    try {
      const url = editId
        ? `http://localhost:8080/price/${editId}`
        : "http://localhost:8080/price";
      const method = editId ? "PUT" : "POST";
      console.error("1️⃣", JSON.stringify(newPrice));
      const payload = editId ? { id: editId, ...newPrice } : { ...newPrice };
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      fetchPrices();
      setNewPrice({
        trNo: "",
        typeID: "",
        routeID: "",
        fare: "",
        effectiveDate: "",
      });
      setEditId(null);
    } catch (err) {
      console.error("Failed to save price:", err);
    }
  };

  // Delete price
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8080/price/${id}`, { method: "DELETE" });
      fetchPrices();
    } catch (err) {
      console.error("Failed to delete price:", err);
    }
  };

  // Edit price
  const handleEdit = (price) => {
    setNewPrice({
      trNo: price.trNo,
      typeID: price.typeID,
      routeID: price.routeID,
      fare: price.fare,
      effectiveDate: price.effectiveDate,
    });
    setEditId(price.id);
  };

  // Get name by ID from the fetched data
  const getTrainName = (id) => {
    const train = trains.find((train) => train.id === id);
    return train ? train.trName : "N/A";
  };

  const getTicketTypeName = (id) => {
    const type = ticketTypes.find((type) => type.id === id);
    return type ? type.typeName : "N/A";
  };

  const getRouteName = (id) => {
    const route = routes.find((station) => station.id === id);
    return route ? route.routeName : "N/A";
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Quản lý giá vé</h1>
      <div style={styles.formContainer}>
        <h2 style={styles.formTitle}>{editId ? "Cập nhật giá vé" : "Thêm mới giá vé"}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          style={styles.form}
        >
          <select
            name="trNo"
            value={newPrice.trNo}
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

          {/* Ticket type dropdown */}
          <select
            name="typeID"
            value={newPrice.typeID}
            onChange={handleInputChange}
            style={styles.input}
            required
          >
            <option value="">Chọn loại vé</option>
            {ticketTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.typeName}
              </option>
            ))}
          </select>

          {/* Route dropdown */}
          <select
            name="routeID"
            value={newPrice.routeID}
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

          {/* Fare input */}
          <input
            type="number"
            step="0.01"
            name="fare"
            placeholder="Giá vé"
            value={newPrice.fare}
            onChange={handleInputChange}
            style={styles.input}
            required
          />

          {/* Effective date input */}
          <input
            type="date"
            name="effectiveDate"
            value={newPrice.effectiveDate}
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
                  setNewPrice({
                    trNo: "",
                    typeID: "",
                    routeID: "",
                    fare: "",
                    effectiveDate: "",
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
            <th style={styles.th}>Số chuyến tàu</th>
            <th style={styles.th}>Loại vé</th>
            <th style={styles.th}>Tuyến đường</th>
            <th style={styles.th}>Giá vé</th>
            <th style={styles.th}>Ngày hiệu lực</th>
            <th style={styles.th}>Hành động</th>
          </tr>
        </thead>
        <tbody style={styles.tbody}>
          {prices.map((price) => (
            <tr key={price.id} style={styles.tr}>
              <td style={styles.td}>{price.id}</td>
              <td style={styles.td}>{getTrainName(price.trNo)}</td>
              <td style={styles.td}>{getTicketTypeName(price.typeID)}</td>
              <td style={styles.td}>{getRouteName(price.routeID)}</td>
              <td style={styles.td}>{price.fare}</td>
              <td style={styles.td}>{price.effectiveDate}</td>
              <td style={styles.actions}>
                <button
                  onClick={() => handleEdit(price)}
                  style={styles.buttonEdit}
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(price.id)}
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
  container: {
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
  },
  title: {
    textAlign: "center",
    color: "#2c3e50",
    marginBottom: "20px",
    fontSize: "2rem",
    fontWeight: "bold",
  },
  formContainer: {
    marginBottom: "30px",
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  formTitle: {
    marginBottom: "15px",
    color: "#34495e",
    fontSize: "1.5rem",
    fontWeight: "600",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ced4da",
    borderRadius: "8px",
    transition: "border-color 0.2s",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-start",
  },
  buttonSave: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "#ffffff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.3s",
  },
  buttonCancel: {
    padding: "10px 20px",
    backgroundColor: "#e74c3c",
    color: "#ffffff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.3s",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  thead: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    textAlign: "left",
  },
  th: {
    padding: "12px",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: "14px",
  },
  tbody: {
    backgroundColor: "#f9f9f9",
  },
  tr: {
    borderBottom: "1px solid #ddd",
  },
  td: {
    padding: "12px",
    textAlign: "left",
    fontSize: "14px",
  },
  actions: {
    display: "flex",
    gap: "10px",
  },
  buttonEdit: {
    padding: "6px 12px",
    backgroundColor: "#f39c12",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  buttonDelete: {
    padding: "6px 12px",
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Pricing;
