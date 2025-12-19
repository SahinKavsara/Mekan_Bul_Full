import React from "react";

const Modal = ({ show, onClose, title, message }) => {

  if (!show) return null;

  // CSS STİLLERİ 
  const overlayStyle = {
    position: "fixed", // Sayfadan bağımsız, ekrana yapışık
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Arka planı hafif karart
    display: "flex", // İçindekini ortalamak için
    justifyContent: "center", // Yatay ortala
    alignItems: "center", // Dikey ortala
    zIndex: 9999, // En üstte dursun 
  };

  const contentStyle = {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)", 
    textAlign: "center",
    minWidth: "300px",
    maxWidth: "80%",
  };

  const buttonStyle = {
    marginTop: "20px",
    padding: "10px 20px",
    cursor: "pointer",
    backgroundColor: "#d9534f",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px"
  };

  return (
    <div style={overlayStyle}>
      <div style={contentStyle}>
        <h2 style={{ marginTop: 0, color: "#333" }}>{title}</h2>
        <p style={{ fontSize: "18px", margin: "15px 0" }}>{message}</p>
        
        <button style={buttonStyle} onClick={onClose}>
          Kapat
        </button>
      </div>
    </div>
  );
};

export default Modal;