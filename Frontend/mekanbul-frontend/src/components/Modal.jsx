import React from "react";
const Modal = ({show, oncClose, title, message }) => {
    if(!show) return null;
    
    return (
        <div className="popup-overlay">
            <div className="popop-content">
                <h2>{title}</h2>
                <p>{message}</p>
                <button onClick={oncClose}>Kapat</button>
            </div>
        </div>
    );
};
export default Modal;