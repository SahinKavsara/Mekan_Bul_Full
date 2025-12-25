import React, { useState, useEffect } from "react";
import Header from "./Header";
import VenueDataService from "../services/VenueDataService";
import { useNavigate } from "react-router-dom";

function Admin() {
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          getVenues(position.coords.latitude, position.coords.longitude);
        },
        () => {
          setError("Konum alınamadı. Varsayılan konum kullanılıyor.");
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
        setVenues(response.data);
      })
      .catch((e) => {
        console.log(e);
        setError("Mekanlar getirilirken hata oluştu.");
      });
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`${name} mekanını gerçekten silmek istiyor musunuz?`)) {
      try {
         const user = JSON.parse(localStorage.getItem("user"));
         if (!user || !user.token) {
            alert("Silme işlemi için giriş yapmalısınız!");
            return;
         }

         // Backend 'auth' ile korunuyor, token gönderiyoruz
         await VenueDataService.removeVenue(id, user.token);
         
         // Listeden silineni çıkar (Burada _id kullanıyoruz)
         setVenues(venues.filter(venue => venue._id !== id));
         alert("Mekan başarıyla silindi!");

      } catch (error) {
         console.error(error);
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
                            {venues.map((venue) => (
                                /* DÜZELTME: venue._id kullanıyoruz */
                                <tr key={venue._id}>
                                    <td>{venue.name}</td>
                                    <td>{venue.address}</td>
                                    <td>{venue.rating}</td>
                                    <td style={{textAlign: "right"}}>
                                        <button 
                                            className="btn btn-info btn-xs" 
                                            style={{ marginRight: "5px" }}
                                            /* DÜZELTME: venue._id */
                                            onClick={() => navigate(`/admin/update/${venue._id}`)}
                                        >
                                            Güncelle
                                        </button>
                                        
                                        <button 
                                            className="btn btn-danger btn-xs"
                                            /* DÜZELTME: venue._id */
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