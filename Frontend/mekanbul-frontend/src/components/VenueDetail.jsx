import { NavLink } from "react-router-dom";
import Rating from "./Rating";
import FoodAndDrinkList from "./FoodAndDrinkList";
import Header from "./Header";
import HourList from "./HourList";
import CommentList from "./CommentList";
import React from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import VenueDataService from "../services/VenueDataService";

// Mekan detay sayfası bileşeni
const VenueDetail = () => {
  // URL'den mekan ID'sini al
  const { id } = useParams();
  const dispatch = useDispatch();

  // Redux store'dan verileri ve durumları çekiyoruz
  const {
    data: venue,
    isError,
    isLoading,
    isSuccess,
  } = useSelector((state) => state);

  // Veri Çekme İşlemi 
  React.useEffect(() => {
    dispatch({ type: "FETCH_INIT" });
    VenueDataService.getVenue(id)
      .then((response) => {
        dispatch({ type: "FETCH_SUCCESS", payload: response.data });
      })
      .catch(() => {
        dispatch({ type: "FETCH_FAILURE" });
      });
  }, [id, dispatch]);

  return (
    <div>
      

      {isError ? (
        // HATA DURUMU
        <div className="container">
            <div className="row">
                <div className="col-xs-12">
                    <p>
                        <strong>Birşeyler ters gitti! ...</strong>
                    </p>
                </div>
            </div>
        </div>
      ) : isLoading ? (
        // YÜKLENİYOR DURUMU
        <div className="container">
            <div className="row">
                <div className="col-xs-12">
                    <p>
                        <strong>Mekanlar Yükleniyor ...</strong>
                    </p>
                </div>
            </div>
        </div>
      ) : (
        isSuccess && venue && (
          // BAŞARILI DURUM
          <div>
            {/* Sayfa başlığı - Mekan adını göster */}
            <Header headerText={venue.name} />

            {/* Bootstrap container */}
            <div className="container">
              <div className="row">
                <div className="col-xs-12 col-md-12">
                  <div className="row">
                    
                    {/* SOL KOLON - Mekan Bilgileri */}
                    <div className="col-xs-12 col-sm-6 ">
                      
                      {/* Yıldız puanlama */}
                      <p className="rating">
                        <Rating rating={venue.rating} />
                      </p>

                      {/* Mekan adresi */}
                      <p>{venue.address}</p>

                      {/* Açılış saatleri paneli */}
                      <div className="panel panel-primary">
                        <div className="panel-heading ">
                          <h2 className="panel-title ">Açılış Saatleri</h2>
                        </div>
                        <div className="panel-body ">
                          <HourList hourList={venue.hours || []} />
                        </div>
                      </div>

                      {/* Yiyecek/içecek paneli */}
                      <div className="panel panel-primary">
                        <div className="panel-heading ">
                          <h2 className="panel-title ">Neler Var?</h2>
                        </div>
                        <div className="panel-body ">
                          <FoodAndDrinkList
                            foodAndDrinkList={venue.foodanddrink || []}
                          />
                        </div>
                      </div>
                    </div>

                    {/* SAĞ KOLON - Harita */}
                    <div className="col-xs-12 col-sm-6">
                      <div className="panel panel-primary">
                        <div className="panel-heading ">
                          <h2 className="panel-title ">Konum Bilgisi</h2>
                        </div>
                        <div className="panel-body ">
                          <img
                            className="img img-responsive img-rounded"
                            alt="Konum Bilgisi"
                            src={`https://maps.googleapis.com/maps/api/staticmap?center=${
                              venue.coordinates
                            }&zoom=12&size=600x400&markers=${
                              venue.coordinates
                            }&key=AIzaSyCmmKygTpBzHGOZEciJpAdxC9v_tWHagnE`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* YORUMLAR BÖLÜMÜ */}
                <div className="row">
                  <div className="col-xs-12 ">
                    <div className="panel panel-primary">
                      <div className="panel-heading ">
                        <NavLink
                          className="btn btn-default pull-right"
                          to={`/venue/${id}/comment/new`}
                          state={{ name: venue.name }}
                        >
                          Yorum Ekle{" "}
                        </NavLink>
                        <h2 className="panel-title ">Yorumlar</h2>
                      </div>
                      <div className="panel-body ">
                        <CommentList commentList={venue.comments || []} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

// Bileşeni dışa aktar
export default VenueDetail;