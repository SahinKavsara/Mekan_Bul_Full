import React, { useState, useEffect } from "react";
import Header from "./Header";
import VenueDataService from "../services/VenueDataService";
import { useNavigate } from "react-router-dom";

function Admin() {
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // --- YARDIMCI: Token Çözücü Fonksiyon ---
  // Bu fonksiyon şifreli token'ın içini okur
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  // --- GÜVENLİK KONTROLÜ ---
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    
    // 1. Kullanıcı veya Token hiç yoksa -> DİREKT Login'e
    if (!user || !user.token) {
        navigate("/login");
        return;
    }

    // 2. Token var ama içinde "isAdmin: true" yazıyor mu?
    const decodedToken = parseJwt(user.token);

    if (!decodedToken || !decodedToken.isAdmin) {
        console.log("Kullanıcı Admin değil, yönlendiriliyor...");
        navigate("/login");
    }
  }, [navigate]);

  // --- 10 SANİYE HAREKETSİZLİK KURALI (Madde 6) ---
  useEffect(() => {
    let timeoutId;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        alert("Oturum süreniz doldu (10sn hareketsizlik).");
        localStorage.removeItem("user"); // Çıkış yap
        navigate("/login");
        window.location.reload();
      }, 10000); // 10 saniye
    };
    
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    
    resetTimer(); // Başlat
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [navigate]);

  // --- MEKANLARI GETİR (TÜMÜ) ---
  useEffect(() => {
    // getAllVenues fonksiyonu artık VenueDataService.js içinde olmalı!
    VenueDataService.getAllVenues()
      .then((response) => {
        setVenues(response.data);
      })
      .catch((e) => {
        console.log(e);
        setError("Mekanlar getirilirken hata oluştu.");
      });
  }, []);

  const handleDelete = async (venue) => {
    const venueId = venue.id || venue._id;
    if (window.confirm(`${venue.name} silinsin mi?`)) {
      try {
         const user = JSON.parse(localStorage.getItem("user"));
         await VenueDataService.removeVenue(venueId, user.token);
         // Listeyi güncelle
         setVenues(venues.filter(v => (v.id || v._id) !== venueId));
         alert("Silindi!");
      } catch (error) {
         console.error(error);
         alert("Hata oluştu!");
      }
    }
  };

  return (
    <>
      <Header headerText="Yönetici Paneli" motto="Mekanları Yönet" />
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <div style={{ marginBottom: "20px", textAlign: "right" }}>
              <button className="btn btn-success" onClick={() => navigate("/admin/add")}>+ Yeni Ekle</button>
            </div>
            
            {error && <div className="alert alert-danger">{error}</div>}
            
            {venues.length > 0 ? (
              <div className="panel panel-primary">
                <div className="panel-heading">Mekan Listesi (Tümü)</div>
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Mekan Adı</th>
                                <th>Adres</th>
                                <th>Puan</th>
                                <th style={{textAlign: "right"}}>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {venues.map((venue) => {
                                const currentId = venue.id || venue._id;
                                return (
                                    <tr key={currentId}>
                                        <td>{venue.name}</td>
                                        <td>{venue.address}</td>
                                        <td>{venue.rating}</td>
                                        <td style={{textAlign: "right"}}>
                                            <button className="btn btn-info btn-xs" style={{ marginRight: "5px" }} onClick={() => navigate(`/admin/update/${currentId}`)}>Güncelle</button>
                                            <button className="btn btn-danger btn-xs" onClick={() => handleDelete(venue)}>Sil</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
              </div>
            ) : (
              <div className="alert alert-warning">{error ? "Hata." : "Mekan yok."}</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Admin;