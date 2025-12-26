import React, { useState } from "react";
import Header from "./Header";
import VenueDataService from "../services/VenueDataService";
import { useNavigate } from "react-router-dom";

function AddVenue() {
  const navigate = useNavigate();
  
  // Form verilerini tutacak state
  const [venue, setVenue] = useState({
    name: "",
    address: "",
    foodanddrink: "",
    lat: "",
    long: "",
    days1: "Pazartesi - Cuma",
    open1: "09:00",
    close1: "23:00",
    isClosed1: false,
    days2: "Cumartesi - Pazar",
    open2: "10:00",
    close2: "22:00",
    isClosed2: false
  });

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setVenue({ ...venue, [name]: type === "checkbox" ? checked : value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    
    // Yiyecek içecekleri virgülden ayırıp diziye çevirmemiz gerekebilir
    // Ama şimdilik string olarak gönderiyoruz, backend şeman nasılsa öyle
    
    // Token'ı al (Güvenlik için)
    const user = JSON.parse(localStorage.getItem("user"));
    
    if(!user || !user.token) {
        alert("Mekan eklemek için giriş yapmalısınız!");
        return;
    }

    VenueDataService.addVenue(venue, user.token)
      .then((response) => {
        alert("Mekan başarıyla eklendi!");
        navigate("/admin"); // İşlem bitince listeye geri dön
      })
      .catch((e) => {
        console.log(e);
        alert("Hata oluştu! Lütfen tüm alanları doldurduğunuzdan emin olun.");
      });
  };

  return (
    <>
      <Header headerText="Yönetici Paneli" motto="Yeni Mekan Ekle" />
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-6 col-md-offset-3">
            <form onSubmit={onSubmit} className="form-horizontal">
              
              <h4>Mekan Bilgileri</h4>
              <div className="form-group">
                <label>Mekan Adı:</label>
                <input type="text" className="form-control" name="name" value={venue.name} onChange={handleInputChange} required />
              </div>

              <div className="form-group">
                <label>Adres:</label>
                <input type="text" className="form-control" name="address" value={venue.address} onChange={handleInputChange} required />
              </div>

              <div className="form-group">
                <label>İmkanlar (Virgülle ayırın):</label>
                <input type="text" className="form-control" name="foodanddrink" placeholder="Çay, Kahve, Kek" value={venue.foodanddrink} onChange={handleInputChange} />
              </div>

              <div className="form-group">
                <div className="row">
                    <div className="col-xs-6">
                        <label>Enlem (Lat):</label>
                        <input type="text" className="form-control" name="lat" value={venue.lat} onChange={handleInputChange} />
                    </div>
                    <div className="col-xs-6">
                        <label>Boylam (Long):</label>
                        <input type="text" className="form-control" name="long" value={venue.long} onChange={handleInputChange} />
                    </div>
                </div>
              </div>

              <hr />
              <h4>Çalışma Saatleri 1</h4>
              <div className="form-group">
                 <label>Günler:</label>
                 <input type="text" className="form-control" name="days1" value={venue.days1} onChange={handleInputChange} />
              </div>
              <div className="row">
                  <div className="col-xs-4">
                     <label>Açılış:</label>
                     <input type="text" className="form-control" name="open1" value={venue.open1} onChange={handleInputChange} />
                  </div>
                  <div className="col-xs-4">
                     <label>Kapanış:</label>
                     <input type="text" className="form-control" name="close1" value={venue.close1} onChange={handleInputChange} />
                  </div>
                  <div className="col-xs-4">
                     <label>Kapalı mı?</label> <br/>
                     <input type="checkbox" name="isClosed1" checked={venue.isClosed1} onChange={handleInputChange} /> Kapalı
                  </div>
              </div>

              <hr />
              <h4>Çalışma Saatleri 2</h4>
              <div className="form-group">
                 <label>Günler:</label>
                 <input type="text" className="form-control" name="days2" value={venue.days2} onChange={handleInputChange} />
              </div>
              <div className="row">
                  <div className="col-xs-4">
                     <label>Açılış:</label>
                     <input type="text" className="form-control" name="open2" value={venue.open2} onChange={handleInputChange} />
                  </div>
                  <div className="col-xs-4">
                     <label>Kapanış:</label>
                     <input type="text" className="form-control" name="close2" value={venue.close2} onChange={handleInputChange} />
                  </div>
                  <div className="col-xs-4">
                     <label>Kapalı mı?</label> <br/>
                     <input type="checkbox" name="isClosed2" checked={venue.isClosed2} onChange={handleInputChange} /> Kapalı
                  </div>
              </div>

              <br />
              <button type="submit" className="btn btn-primary btn-block">Mekanı Kaydet</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddVenue;