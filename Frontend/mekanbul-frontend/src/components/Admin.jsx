import React, { useState, useEffect } from "react";
import Header from "./Header";
import VenueDataService from "../services/VenueDataService";
import { useNavigate } from "react-router-dom";

function Admin() {
  const [venues, setVenues] = useState([]);
  const navigate = useNavigate();

  // Sayfa açılınca mekanları getir (Şimdilik Isparta koordinatları ile)
  useEffect(() => {
    VenueDataService.nearbyVenues(37.77, 30.55) // Koordinatları kendi bölgende tutabilirsin
      .then((response) => {
        setVenues(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleDelete = (id, name) => {
    // Silme işlemini bir sonraki adımda servise ekleyeceğiz, şimdilik sadece uyarı versin
    if (window.confirm(`${name} mekanını silmek istediğinize emin misiniz?`)) {
       alert("Silme fonksiyonu henüz bağlanmadı, birazdan yapacağız!");
    }
  };

  return (
    <>
      <Header headerText="Yönetici Paneli" motto="Mekanları Yönet" />
      
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            
            {/* Yeni Mekan Ekle Butonu */}
            <div style={{ marginBottom: "20px", textAlign: "right" }}>
              <button 
                className="btn btn-success"
                onClick={() => navigate("/admin/add")}
              >
                + Yeni Mekan Ekle
              </button>
            </div>

            {/* Mekan Listesi Tablosu */}
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
                            {venues.map((venue) => (
                                <tr key={venue._id}>
                                    <td>{venue.name}</td>
                                    <td>{venue.address}</td>
                                    <td>{venue.rating}</td>
                                    <td style={{textAlign: "right"}}>
                                        {/* Güncelle Butonu */}
                                        <button 
                                            className="btn btn-info btn-xs" 
                                            style={{ marginRight: "5px" }}
                                            onClick={() => navigate(`/admin/update/${venue._id}`)}
                                        >
                                            Güncelle
                                        </button>
                                        
                                        {/* Sil Butonu */}
                                        <button 
                                            className="btn btn-danger btn-xs"
                                            onClick={() => handleDelete(venue._id, venue.name)}
                                        >
                                            Sil
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              </div>
            ) : (
              <div className="alert alert-warning">Hiç mekan bulunamadı.</div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

export default Admin;