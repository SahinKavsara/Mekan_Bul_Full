import Header from "./Header";
import React, { useState, useEffect } from "react"; // useEffect eklendi
import { useParams, useLocation, useNavigate } from "react-router-dom";
import VenueDataService from "../services/VenueDataService";
import { useDispatch } from "react-redux";
import Modal from "./Modal";

function AddComment() {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Kullanıcı bilgisini State'te tutalım
  const [user, setUser] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // SAYFA YÜKLENDİĞİNDE ÇALIŞACAK KOD
  useEffect(() => {
    // LocalStorage'dan kullanıcıyı al
    const loggedInUser = localStorage.getItem("user");

    if (loggedInUser) {
      // Kullanıcı varsa state'e at
      setUser(JSON.parse(loggedInUser));
    } else {
      // Kullanıcı YOKSA login sayfasına şutla
      // state: { returnUrl: ... } ile giriş yapınca buraya geri dönmesini sağlayabiliriz (Opsiyonel)
      alert("Yorum yapmak için giriş yapmalısınız!");
      navigate("/login");
    }
  }, [navigate]);

  const handleModalClose = () => {
    setShowModal(false);
    navigate(`/venue/${id}`);
  };

  const onSubmit = (evt) => {
    evt.preventDefault();
    
    // Kullanıcı yoksa işlemi durdur (Güvenlik)
    if (!user) {
        navigate("/login");
        return;
    }

    const text = evt.target.elements.text.value;
    const rating = evt.target.elements.rating.value;

    if (text && rating) {
      setSubmitting(true);

      let newComment = {
        author: user.name, // İsmi formdan değil, giriş yapan kullanıcıdan alıyoruz
        text: text,
        rating: rating,
      };

      // DÜZELTME: Token'ı (user.token) da gönderiyoruz
      VenueDataService.addComment(id, newComment, user.token)
        .then(() => {
          dispatch({ type: "ADD_COMMENT_SUCCESS" });
          setShowModal(true); 
        })
        .catch((err) => {
          console.error("Yorum Hatası:", err);
          dispatch({ type: "ADD_COMMENT_FAILURE" });
          setSubmitting(false); 
          
          // Eğer token süresi dolmuşsa (401 hatası) kullanıcıyı uyarabiliriz
          if (err.response && err.response.status === 401) {
             alert("Oturum süreniz dolmuş, lütfen tekrar giriş yapın.");
             localStorage.removeItem("user"); // Temizle
             navigate("/login");
          } else {
             alert("Yorum eklenirken bir hata oluştu.");
          }
        });
    } else {
        alert("Lütfen tüm alanları doldurunuz.");
    }
  };

  // Eğer kullanıcı bilgisi henüz yüklenmediyse boş dön (Login'e yönleniyor zaten)
  if (!user) return null;

  return (
    <>
      <Header headerText={location.state ? location.state.name : "Mekan"} motto=" mekanına yorum yap" />
      
      <Modal
        show={showModal}
        onClose={handleModalClose}
        title="Tebrikler!"
        message="Yorumunuz yayınlandı!"
      />

      <div className="row">
        <div className="col-xs-12 col-md-6">
          <form
            className="form-horizontal"
            id="yorumEkle"
            onSubmit={(evt) => onSubmit(evt)}
          >
            <div className="form-group">
              <label className="col-sm-2 control-label">İsim:</label>
              <div className="col-sm-10">
                {/* İsim alanı artık otomatik dolu ve değiştirilemez (readOnly) */}
                <input
                  type="text"
                  className="form-control"
                  id="author"
                  name="author"
                  value={user.name || user.username} // Kullanıcı adı otomatik gelsin
                  readOnly 
                  disabled
                />
              </div>
            </div>
            <div className="form-group">
              <label className="col-xs-10 col-sm-2 control-label">Puan:</label>
              <div className="col-xs-12 col-sm-2">
                <select
                  className="form-control input-sm"
                  id="rating"
                  name="rating"
                  disabled={submitting}
                > 
                  <option>5</option>
                  <option>4</option>
                  <option>3</option>
                  <option>2</option>
                  <option>1</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="col-sm-2 control-label">Yorum:</label>
              <div className="col-sm-10">
                <textarea
                  className="review form-control"
                  name="text"
                  rows={5}
                  disabled={submitting}
                  required // HTML5 zorunluluk kontrolü
                />
              </div>
            </div>
            <button className="btn btn-default pull-right" disabled={submitting}>
              {submitting ? "Gönderiliyor..." : "Yorum Ekle"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddComment;