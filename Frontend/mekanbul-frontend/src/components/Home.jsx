// Gerekli bileşenleri içe aktar
import InputWithLabel from "./InputWithLabel";
import VenueList from "./VenueList";
import Header from "./Header";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import VenueDataService from "../services/VenueDataService";

// Ana sayfa bileşeni
const Home = () => {
  const [coordinate, setCoordinate] = useState({ lat: 37, long: 35 });
  const dispatch = useDispatch();

  // Redux store'dan verileri ve durumları çekiyoruz
  const {
    data: venues,
    isError,
    isLoading,
    isSuccess,
  } = useSelector((state) => state);

  // Arama metni için state tanımla
  const [searchVenue, setSearchVenue] = useState("");

  // Arama kutusuna yazıldığında çalışan fonksiyon
  const search = (event) => {
    setSearchVenue(event.target.value);
  };

  // Konum alma (Geolocation) Effect'i
  React.useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setCoordinate({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      });
    }
  }, []);

  // Veri Çekme Effect'i
  React.useEffect(() => {
    dispatch({ type: "FETCH_INIT" });
    VenueDataService.nearbyVenues(coordinate.lat, coordinate.long)
      .then((response) => {
        dispatch({ type: "FETCH_SUCCESS", payload: response.data });
      })
      .catch(() => {
        dispatch({ type: "FETCH_FAILURE" });
      });
  }, [coordinate.lat, coordinate.long, dispatch]);

  // GÜNCELLENEN KISIM: Mekanları hem 'name' hem de 'address' alanına göre filtrele
  const filteredVenues = Array.isArray(venues)
    ? venues.filter(
        (venue) =>
          venue.name.toLowerCase().includes(searchVenue.toLowerCase()) ||
          venue.address.toLowerCase().includes(searchVenue.toLowerCase())
      )
    : [];

  return (
    <div>
      {/* Sayfa başlığı ve slogan */}
      <Header
        headerText="Mekanbul"
        motto="Civarınızdaki Mekanlarınızı Keşfedin!"
      />

      {/* Arama kutusu */}
      <InputWithLabel
        id="arama"
        label="Mekan Ara:"
        type="text"
        isFocused
        onInputChange={search}
        value={searchVenue}
      />

      <hr />

      <div className="row">
        {isError ? (
          <p>
            <strong>Birşeyler ters gitti! ...</strong>
          </p>
        ) : isLoading ? (
          <p>
            <strong>Mekanlar Yükleniyor ...</strong>
          </p>
        ) : (
          isSuccess && (
            <div className="row">
              <VenueList venues={filteredVenues} />
            </div>
          )
        )}
      </div>
    </div>
  );
};

// Bileşeni dışa aktar
export default Home;