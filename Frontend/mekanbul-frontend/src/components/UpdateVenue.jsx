import React, { useState, useEffect } from "react";
import Header from "./Header";
import VenueDataService from "../services/VenueDataService";
import { useParams, useNavigate } from "react-router-dom";

function UpdateVenue() {
  const { id } = useParams(); // URL'den ID'yi al
  const navigate = useNavigate();
  
  const [venue, setVenue] = useState({
    name: "",
    address: "",
    foodanddrink: "",
    lat: "",
    long: "",
    days1: "",
    open1: "",
    close1: "",
    isClosed1: false,
    days2: "",
    open2: "",
    close2: "",
    isClosed2: false
  });

  // Sayfa yüklenince mevcut verileri getir
  useEffect(() => {
    VenueDataService.getVenue(id).then((response) => {
        const data = response.data;
        // Gelen veriyi form formatına çevir
        setVenue({
            name: data.name,
            address: data.address,
            foodanddrink: data.foodanddrink, // Dizi ise stringe çevirmek gerekebilir
            lat: data.coordinates[0],
            long: data.coordinates[1],
            days1: data.hours[0] ? data.hours[0].days : "",
            open1: data.hours[0] ? data.hours[0].open : "",
            close1: data.hours[0] ? data.hours[0].close : "",
            isClosed1: data.hours[0] ? data.hours[0].isClosed : false,
            days2: data.hours[1] ? data.hours[1].days : "",
            open2: data.hours[1] ? data.hours[1].open : "",
            close2: data.hours[1] ? data.hours[1].close : "",
            isClosed2: data.hours[1] ? data.hours[1].isClosed : false,
        });
    });
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setVenue({ ...venue, [name]: type === "checkbox" ? checked : value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    
    const user = JSON.parse(localStorage.getItem("user"));
    if(!user || !user.token) {
        alert("Güncellemek için giriş yapmalısınız!");
        return;
    }

    // Backend'in beklediği format (AddVenue ile aynı mantık)
    const payload = {
        ...venue,
        lat: parseFloat(venue.lat),
        long: parseFloat(venue.long),
        // Not: Backend controller'ımızda 'day' düzeltmesini yapmıştık
        // O yüzden burada days1 göndersek bile controller onu 'day' olarak kaydedecek
    };

    // Dikkat: VenueDataService.js dosyanda updateVenue fonksiyonu olmalı!
    // Eğer yoksa bir sonraki adımda ekleyeceğiz.
    VenueDataService.updateVenue(id, payload, user.token)
      .then((response) => {
        alert("Mekan başarıyla güncellendi! 🎉");
        navigate("/admin");
      })
      .catch((e) => {
        console.error("Güncelleme Hatası:", e);
        alert("Güncelleme başarısız oldu.");
      });
  };

  return (
    <>
      <Header headerText="Yönetici Paneli" motto="Mekanı Güncelle" />
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
                <label>İmkanlar:</label>
                <input type="text" className="form-control" name="foodanddrink" value={venue.foodanddrink} onChange={handleInputChange} required />
              </div>

              <div className="form-group">
                <div className="row">
                    <div className="col-xs-6">
                        <label>Enlem (Lat):</label>
                        <input type="number" step="any" className="form-control" name="lat" value={venue.lat} onChange={handleInputChange} required />
                    </div>
                    <div className="col-xs-6">
                        <label>Boylam (Long):</label>
                        <input type="number" step="any" className="form-control" name="long" value={venue.long} onChange={handleInputChange} required />
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
              <button type="submit" className="btn btn-warning btn-block">Güncellemeyi Kaydet</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateVenue;