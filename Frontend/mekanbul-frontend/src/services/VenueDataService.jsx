import http from "../http-common";

class VenueDataService {
  
  // Yakındaki mekanları getir
  nearbyVenues(lat, long) {
    return http.get(`/venues?lat=${lat}&long=${long}`);
  }

  // --- YENİ EKLENECEK KISIM (BURASI EKSİK) ---
  // Tüm mekanları getir (Admin için)
  getAllVenues() {
    return http.get("/admin/venues");
  }
  // ------------------------------------------

  getVenue(id) {
    return http.get(`/venues/${id}`);
  }

  addVenue(data, token) {
    return http.post("/venues", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  updateVenue(id, data, token) {
    return http.put(`/venues/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  removeVenue(id, token) {
    return http.delete(`/venues/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

export default new VenueDataService();