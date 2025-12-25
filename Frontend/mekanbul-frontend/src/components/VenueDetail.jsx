import Rating from "./Rating";
import FoodAndDrinkList from "./FoodAndDrinkList";
import Header from "./Header";
import HourList from "./HourList";
import CommentList from "./CommentList";
import React from "react";
// DÜZELTME 1: NavLink yerine useNavigate'i ekledik
import { useParams, useNavigate } from "react-router-dom"; 
import { useSelector, useDispatch } from "react-redux";
import VenueDataService from "../services/VenueDataService";

const VenueDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  // DÜZELTME 2: Yönlendirme fonksiyonunu tanımladık
  const navigate = useNavigate(); 

  const {
    data: venue,
    isError,
    isLoading,
    isSuccess,
  } = useSelector((state) => state);

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

  // DÜZELTME 3: Butona tıklanınca çalışacak "Güvenlik Kontrolü" fonksiyonu
  const handleAddCommentClick = () => {
    // 1. Tarayıcı hafızasına bak
    const user = localStorage.getItem("user");

    if (!user) {
      // 2. Kimse yoksa uyar ve Login'e postala
      alert("Yorum yapmak için lütfen önce giriş yapınız.");
      navigate("/login");
    } else {
      // 3. Giriş yapılmışsa Yorum sayfasına gönder (Mekan ismini de taşıyarak)
      navigate(`/venue/${id}/comment/new`, { state: { name: venue.name } });
    }
  };

  return (
    <div>
      {isError ? (
        <div className="container">
            <div className="row">
                <div className="col-xs-12">
                    <p><strong>Bir şeyler ters gitti! ...</strong></p>
                </div>
            </div>
        </div>
      ) : isLoading ? (
        <div className="container">
            <div className="row">
                <div className="col-xs-12">
                    <p><strong>Mekanlar Yükleniyor ...</strong></p>
                </div>
            </div>
        </div>
      ) : (
        isSuccess && venue && (
          <div>
            <Header headerText={venue.name} />

            <div className="container">
              <div className="row">
                <div className="col-xs-12 col-md-12">
                  <div className="row">
                    
                    {/* SOL KOLON */}
                    <div className="col-xs-12 col-sm-6 ">
                      <p className="rating">
                        <Rating rating={venue.rating} />
                      </p>
                      <p>{venue.address}</p>
                      <div className="panel panel-primary">
                        <div className="panel-heading ">
                          <h2 className="panel-title ">Açılış Saatleri</h2>
                        </div>
                        <div className="panel-body ">
                          <HourList hourList={venue.hours || []} />
                        </div>
                      </div>
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

                    {/* SAĞ KOLON */}
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

                <div className="row">
                  <div className="col-xs-12 ">
                    <div className="panel panel-primary">
                      
                      {/* Başlık ve Buton Hizalama */}
                      <div className="panel-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 className="panel-title" style={{ margin: 0 }}>Yorumlar</h2>
                        
                        {/* DÜZELTME 4: NavLink'i sildik, yerine akıllı 'button' koyduk */}
                        <button
                          className="btn btn-default btn-xs"
                          onClick={handleAddCommentClick}
                        >
                          Yorum Ekle
                        </button>
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

export default VenueDetail;