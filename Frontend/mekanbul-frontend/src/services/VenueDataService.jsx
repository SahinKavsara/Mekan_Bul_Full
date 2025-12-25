import http from "./http-common";

class VenueDataService {
  
  // Yakındaki mekanları getir
  nearbyVenues(lat, long) {
    return http.get(`/api/venues?lat=${lat}&long=${long}`);
  }

  // ID'ye göre mekan getir
  getVenue(id) {
    return http.get(`/api/venues/${id}`);
  }

  // Yeni mekan ekle
  addVenue(data, token) {
    return http.post("/api/venues", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Yorum ekle
  addComment(id, comment, token) {
    return http.post(`/api/venues/${id}/comments`, comment, {
       headers: { Authorization: `Bearer ${token}` },
    });
  }

  // --- AŞAĞIDAKİLER YENİ EKLENDİ ---

  // Giriş Yap (Backend'e email ve şifre yollar)
  login(email, password) {
    return http.post("/api/login", { email, password });
  }

  // Kayıt Ol (Backend'e isim, email ve şifre yollar)
  register(name, email, password) {
    return http.post("/api/register", { name, email, password });
  }
}

export default new VenueDataService();