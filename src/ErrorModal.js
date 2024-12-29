import React from "react";
import "./ErrorModal.css"; // Đảm bảo rằng bạn đã có style cho modal

function ErrorModal({ message, onClose }) {
    return (
        <div className="error-modal-overlay">
            <div className="error-modal">
                <h2>Lỗi</h2>
                <p>{message}</p>

                {/* Nút đóng thêm ở dưới */}
                <button className="close-btn-modal" onClick={onClose}>
                    Đóng
                </button>
            </div>
        </div>
    );
}

export default ErrorModal;
