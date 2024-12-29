import React, { useEffect, useState } from "react";

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [trains, setTrains] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [routes, setRoutes] = useState([]);  // Thêm state để lưu tuyến đường
  const [popupVisible, setPopupVisible] = useState(false);  // State quản lý popup
  const [selectedRoute, setSelectedRoute] = useState(null);  // State lưu thông tin tuyến đường được chọn

  // Fetch data from the APIs
  const fetchData = async () => {
    try {
      const ticketResponse = await fetch("http://localhost:8080/tickets");
      const trainResponse = await fetch("http://192.168.0.102:8080/trains");
      const scheduleResponse = await fetch("http://192.168.0.102:8080/schedules");
      const routeResponse = await fetch("http://192.168.0.102:8080/routes");  // Fetch tuyến đường
      const ticketTypeResponse = await fetch("http://localhost:8080/ticket-types");

      const ticketData = await ticketResponse.json();
      const trainData = await trainResponse.json();
      const scheduleData = await scheduleResponse.json();
      const routeData = await routeResponse.json();  // Lưu dữ liệu tuyến đường
      const ticketTypeData = await ticketTypeResponse.json();

      setTrains(trainData);
      setSchedules(scheduleData);
      setTicketTypes(ticketTypeData);
      setRoutes(routeData);  // Lưu tuyến đường
      setTickets(ticketData);

      console.log(JSON.stringify(ticketTypeData));
      console.log(JSON.stringify(ticketData));
      console.log("5️⃣")
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };


    // Helper function to find name by id
    const findNameById = (id, data, idKey, nameKey) => {
      console.log("+👹4" + id)
      console.log("+👹3" + JSON.stringify(data))
      console.log("+👹2" + idKey)
      console.log("+👹1" + nameKey)
      const item = data.find((item) => item[idKey] === id);
      return item ? item[nameKey] : "N/A";
    };

  useEffect(() => {
    fetchData();
  }, []);


  // Handler for showing the route details popup
  const handleRouteClick = (routeId) => {
    // const route = routes.find((route) => route.id === routeId);
    // if (route) {
    //   setSelectedRoute(route);  // Set thông tin tuyến đường vào state
    //   setPopupVisible(true);  // Hiển thị popup
    // }
  };

  // Close the popup
  const closePopup = () => {
    setPopupVisible(false);
    setSelectedRoute(null);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Thông tin vé</h1>

      <table style={styles.table}>
        <thead style={styles.thead}>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Chuyến tàu</th>
            <th style={styles.th}>Lịch trình</th>
            <th style={styles.th}>Loại vé</th>
            <th style={styles.th}>Số ghế</th>
            <th style={styles.th}>Ngày đặt</th>
            <th style={styles.th}>Trạng thái</th>
            <th style={styles.th}>Giá vé</th>
          </tr>
        </thead>
        <tbody style={styles.tbody}>
          {tickets.map((ticket) => (
            <tr key={ticket.id} style={styles.tr}>
              <td style={styles.td}>{ticket.id}</td>
              <td style={styles.td}>
                {
                trains.find((train) => train.id === ticket.trNo)?.trName || "N/A"
                }
              </td>
              <td style={styles.td}
                  onClick={() => handleRouteClick(ticket.id)}>
                {findNameById(ticket.schedule, routes, "id", "routeName")}  {/* Cập nhật để lấy tên tuyến đường */}
              </td>
              <td style={styles.td}>
                {ticketTypes.find((type) => type.id === ticket.typeID)?.typeName || "N/A"}
              </td>
              <td style={styles.td}>{ticket.seatNumber}</td>
              <td style={styles.td}>{ticket.bookingDate}</td>
              <td style={styles.td}>{ticket.status}</td>
              <td style={styles.td}>{ticket.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup Modal */}
      {popupVisible && selectedRoute && (
        <div style={styles.popupOverlay}>
          <div style={styles.popup}>
            <h2 style={styles.popupTitle}>Chi tiết tuyến đường</h2>
            <p><strong>Tuyến đường:</strong> {JSON.stringify(selectedRoute)}</p>
            <p><strong>Mô tả:</strong> {selectedRoute.description || "N/A"}</p>
            <p><strong>Thời gian bắt đầu:</strong> {selectedRoute.startTime || "N/A"}</p>
            <p><strong>Thời gian kết thúc:</strong> {selectedRoute.endTime || "N/A"}</p>
            <button style={styles.closeButton} onClick={closePopup}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "20px" },
  title: { fontSize: "24px", fontWeight: "bold" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "20px" },
  thead: { backgroundColor: "#f0f0f0" },
  th: { padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" },
  tbody: { backgroundColor: "#f9f9f9" },
  tr: { borderBottom: "1px solid #ddd" },
  td: { padding: "10px", textAlign: "left", cursor: "pointer" },  // Thêm cursor pointer cho các ô có thể click
  popupOverlay: { 
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%", 
    backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center"
  },
  popup: { 
    backgroundColor: "#fff", padding: "20px", borderRadius: "8px", 
    width: "400px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" 
  },
  popupTitle: { fontSize: "20px", fontWeight: "bold" },
  closeButton: { 
    marginTop: "20px", padding: "10px 15px", backgroundColor: "#007bff", 
    color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" 
  },
};


export default Tickets;
