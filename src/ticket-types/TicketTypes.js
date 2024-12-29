import React, { useEffect, useState } from "react";

function TicketTypes() {
  const [ticketTypes, setTicketTypes] = useState([]);
  const [newTicketType, setNewTicketType] = useState({ typeName: "", description: "" });
  const [editId, setEditId] = useState(null);

  // const [log, setLog] = useState("");

  // Fetch ticket types from backend
  const fetchTicketTypes = async () => {
    try {
      const response = await fetch("http://localhost:8080/ticket-types");
      const data = await response.json();
      setTicketTypes(data);
    } catch (err) {
      console.error("Failed to fetch ticket types:", err);
    }
  };

  useEffect(() => {
    fetchTicketTypes();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTicketType({ ...newTicketType, [name]: value });
  };

  const handleSave = async () => {
    try {
      const url = editId
        ? `http://localhost:8080/ticket-types/${editId}` // URL cho PUT (Cập nhật)
        : "http://localhost:8080/ticket-types"; // URL cho POST (Thêm mới)
      const method = editId ? "PUT" : "POST";

      // Tạo payload tùy thuộc vào phương thức
      const payload = editId
        ? {
          id: editId, // Gửi ID khi PUT
          typeName: newTicketType.typeName,
          description: newTicketType.description,
        }
        : {
          typeName: newTicketType.typeName, // Không gửi ID khi POST
          description: newTicketType.description,
        };
      // setLog("👩🏽‍💻" + payload.id)
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Refresh danh sách và đặt lại form
      fetchTicketTypes();
      setNewTicketType({ typeName: "", description: "" });
      setEditId(null);
    } catch (err) {
      console.error("Failed to save ticket type:", err);
    }
  };


  // Handle delete ticket type
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8080/ticket-types/${id}`, { method: "DELETE" });
      fetchTicketTypes();
    } catch (err) {
      console.error("Failed to delete ticket type:", err);
    }
  };

  // Handle edit ticket type
  const handleEdit = (ticket) => {
    setNewTicketType({ typeName: ticket.typeName, description: ticket.description });
    setEditId(ticket.id);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Quản lý loại vé</h1>
      <div style={styles.formContainer}>
        <h2 style={styles.formTitle}>{editId ? "Cập nhật loại vé" : "Thêm mới loại vé"}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          style={styles.form}
        >
          <input
            type="text"
            name="typeName"
            placeholder="Tên loại vé"
            value={newTicketType.typeName}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Thông tin chi tiết"
            value={newTicketType.description}
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
                  setNewTicketType({ typeName: "", description: "" });
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
            <th style={styles.th}>Tên loại vé</th>
            <th style={styles.th}>Thông tin chi tiết</th>
            <th style={styles.th}>Hành động</th>
          </tr>
        </thead>
        <tbody style={styles.tbody}>
          {ticketTypes.map((ticket) => (
            <tr
              key={ticket.id}
              style={styles.tr}
            >
              <td style={styles.td}>{ticket.id}</td>
              <td style={styles.td}>{ticket.typeName}</td>
              <td style={styles.td}>{ticket.description}</td>
              <td style={styles.actions}>
                <button
                  onClick={() => handleEdit(ticket)}
                  style={styles.buttonEdit}
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(ticket.id)}
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
  inputFocus: {
    borderColor: "#007bff",
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
  buttonSaveHover: {
    backgroundColor: "#45a049",
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
  buttonCancelHover: {
    backgroundColor: "#c0392b",
  },

  tableHeader: {
    backgroundColor: "#34495e",
    color: "#ffffff",
    fontWeight: "600",
  },
  actions: {
    display: "flex",
    gap: "10px",
  },
  buttonEdit: {
    padding: "5px 10px",
    backgroundColor: "#3498db",
    color: "#ffffff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  buttonEditHover: {
    backgroundColor: "#2980b9",
  },
  buttonDelete: {
    padding: "5px 10px",
    backgroundColor: "#e74c3c",
    color: "#ffffff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  buttonDeleteHover: {
    backgroundColor: "#c0392b",
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
    color: "#333",
  },
  actions: {
    display: "flex",
    gap: "10px",
  },
};

export default TicketTypes;
