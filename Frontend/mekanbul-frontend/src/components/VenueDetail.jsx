import Rating from "./Rating";
import FoodAndDrinkList from "./FoodAndDrinkList";
import Header from "./Header";
import HourList from "./HourList";
import CommentList from "./CommentList";
import React from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { useSelector, useDispatch } from "react-redux";
import VenueDataService from "../services/VenueDataService";

const VenueDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
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

  // --- DEDEKTİF KONTROLÜ ---
  const handleAddCommentClick = (e) => {
    e.preventDefault();
    
    // Veriyi çek ve temizle (bazen tırnak içinde "null" stringi kalabilir)
    let user = localStorage.getItem("user");
    
    console.log("LOG DURUMU:", user);

    // Eğer user yoksa VEYA user "null" stringi ise VEYA user "undefined" ise
    if (!user || user === "null" || user === "undefined") {
      alert("Lütfen önce giriş yapın! (Yönlendiriliyor...)");
      navigate("/login");
    } else {
      console.log("İçeri giriliyor...");
      navigate(`/venue/${id}/comment/new`, { state: { name: venue.name } });
    }
  };

  return (
    <div>
      {isError ? (
        <div className="container"><p>Hata oluştu.</p></div>
      ) : isLoading ? (
        <div className="container"><p>Yükleniyor...</p></div>
      ) : (
        isSuccess && venue && (
          <div>
            <Header headerText={venue.name} />

            <div className="container">
              <div className="row">
                <div className="col-xs-12 col-md-12">
                  <div className="row">
                    {/* SOL TARAFI KISALTTIM (Odaklanmak için) */}
                    <div className="col-xs-12 col-sm-6 ">
                      <p className="rating"><Rating rating={venue.rating} /></p>
                      <p>{venue.address}</p>
                      <div className="panel panel-primary">
                         <div className="panel-heading">Hizmetler</div>
                         <div className="panel-body"><FoodAndDrinkList foodAndDrinkList={venue.foodanddrink || []} /></div>
                      </div>
                    </div>

                    {/* SAĞ TARAF */}
                    <div className="col-xs-12 col-sm-6">
                       <p>Harita Alanı</p>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-xs-12 ">
                    <div className="panel panel-primary">
                      
                      <div className="panel-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 className="panel-title" style={{ margin: 0 }}>Yorumlar</h2>
                        
                        {/* --- BURAYI KONTROL ET --- */}
                        <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                            
                            {/* DEDEKTİF KUTUSU: LocalStorage Durumunu Gösterir */}
                            <div style={{background: 'red', color:'white', padding:'5px', fontSize:'10px'}}>
                                DURUM: {localStorage.getItem("user") ? "GİRİŞ YAPILI" : "ÇIKIŞ YAPILI"}
                            </div>

                            <button
                              className="btn btn-warning btn-xs"
                              onClick={handleAddCommentClick}
                            >
                              GÜVENLİK TESTİ BUTONU
                            </button>
                        </div>
                        {/* ------------------------- */}
                        
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