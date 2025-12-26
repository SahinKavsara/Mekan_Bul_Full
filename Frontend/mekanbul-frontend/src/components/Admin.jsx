import React, { useState, useEffect } from "react";
import Header from "./Header";
import VenueDataService from "../services/VenueDataService";
import { useNavigate } from "react-router-dom";

function Admin() {
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // --- 1. GÜVENLİK KONTROLÜ (YENİ EKLENEN KISIM) ---
  // Sayfa açılır açılmaz çalışır. Kullanıcı yoksa Login'e atar.
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    
    // Kullanıcı yoksa, token yoksa VEYA admin değilse
    if (!user || !user.token || !user.isAdmin) {
        navigate("/login");
    }
  }, [navigate]);
  // -------------------------------------------------

  useEffect(() => {
    // Eğer yukarıdaki kontrolden geçerse (yani adminse) burası çalışır
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          getVenues(position.coords.latitude, position.coords.longitude);
        },
        () => {
          console.log("Konum alınamadı, varsayılan konum kullanılıyor.");
          getVenues(37.77, 30.55);
        }
      );
    } else {
      getVenues(37.77, 30.55);
    }
  }, []);

  const getVenues = (lat, long) => {
    VenueDataService.nearbyVenues(lat, long)
      .then((response) => {
        // --- DEDEKTİF MODU BAŞLANGIÇ ---
        console.log("BACKEND'DEN GELEN VERİ:", response.data);
        if (response.data.length > 0) {
            console.log("İlk mekanın ID durumu:", "id:", response.data[0].id, "_id:", response.data[0]._id);
        }
        // --------------------------------
        setVenues(response.data);
      })
      .catch((e) => {
        console.error(e);
        setError("Mekanlar getirilirken hata oluştu.");
      });
  };

  const handleDelete = async (venue) => {
    // BURASI ÇOK ÖNEMLİ: Hem id'ye hem _id'ye bakıyoruz!
    const venueId = venue.id || venue._id;

    console.log("Silinecek ID:", venueId); 

    if (!venueId) {
        alert("HATA: Mekan ID'si bulunamadı! Konsolu (F12) kontrol edin.");
        return;
    }

    if (window.confirm(`${venue.name} mekanını gerçekten silmek istiyor musunuz?`)) {
      try {
         const user = JSON.parse(localStorage.getItem("user"));
         if (!user || !user.token) {
            alert("Silme işlemi için giriş yapmalısınız!");
            return; // Burada return yaparak işlemi durduruyoruz
         }

         await VenueDataService.removeVenue(venueId, user.token);
         
         // Listeden silineni çıkarırken de aynı kontrolü yapıyoruz
         setVenues(venues.filter(v => (v.id || v._id) !== venueId));
         alert("Mekan başarıyla silindi!");

      } catch (error) {
         console.error("Silme Hatası:", error);
         alert("Silinirken bir hata oluştu! (Yetkiniz olmayabilir)");
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
              <button 
                className="btn btn-success"
                onClick={() => navigate("/admin/add")}
              >
                + Yeni Mekan Ekle
              </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {venues.length > 0 ? (
              <div className="panel panel-primary">
                <div className="panel-heading">Mekan Listesi</div>
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
                                // Satır içinde değişkeni tanımla
                                const currentId = venue.id || venue._id;
                                return (
                                    <tr key={currentId}>
                                        <td>{venue.name}</td>
                                        <td>{venue.address}</td>
                                        <td>{venue.rating}</td>
                                        <td style={{textAlign: "right"}}>
                                            <button 
                                                className="btn btn-info btn-xs" 
                                                style={{ marginRight: "5px" }}
                                                onClick={() => navigate(`/admin/update/${currentId}`)}
                                            >
                                                Güncelle
                                            </button>
                                            
                                            <button 
                                                className="btn btn-danger btn-xs"
                                                // Fonksiyona tüm venue objesini gönderiyoruz ki ID'yi kendi bulsun
                                                onClick={() => handleDelete(venue)}
                                            >
                                                Sil
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
              </div>
            ) : (
              <div className="alert alert-warning">
                 {error ? "Hata oluştu." : "Hiç mekan bulunamadı."}
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

export default Admin;