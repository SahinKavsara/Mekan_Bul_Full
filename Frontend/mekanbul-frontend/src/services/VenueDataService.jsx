import http from "./http-common";

class VenueDataService {
  
  // Yakındaki mekanları getir
  nearbyVenues(lat, long) {
    // DÜZELTME: Başına '/api' eklendi
    return http.get(`/api/venues?lat=${lat}&long=${long}`);
  }

  // ID'ye göre mekan getir
  getVenue(id) {
    // DÜZELTME: Başına '/api' eklendi
    return http.get(`/api/venues/${id}`);
  }

  // Yeni mekan ekle
  addVenue(data, token) {
    // DÜZELTME: Başına '/api' eklendi
    return http.post("/api/venues", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Yorum ekle
  addComment(id, comment) {
    // DÜZELTME: Başına '/api' eklendi
    return http.post(`/api/venues/${id}/comments`, comment);
  }
}

export default new VenueDataService();