import Header from "./Header";
import React, { useState, useEffect } from "react"; 
import { useParams, useLocation, useNavigate } from "react-router-dom";
import VenueDataService from "../services/VenueDataService";
import { useDispatch } from "react-redux";
import Modal from "./Modal";

function AddComment() {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Kullanıcı bilgisini tutacak state
  const [user, setUser] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 🛑 GÜVENLİK KONTROLÜ (Sayfa açılır açılmaz çalışır)
  useEffect(() => {
    // 1. Tarayıcı hafızasına bak: Kullanıcı var mı?
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      // 2. Kullanıcı YOKSA: Hiç bekleme yapma, direkt Login'e postala!
      // state: { from: ... } kısmı ile giriş yapınca buraya geri dönmesini sağlayabiliriz (Opsiyonel)
      alert("Yorum yapmak için önce giriş yapmalısınız.");
      navigate("/login");
    } else {
      // 3. Kullanıcı VARSA: Bilgileri al ve sayfayı göster
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleModalClose = () => {
    setShowModal(false);
    // Yorum yapıldıktan sonra mekan detayına geri dön
    navigate(`/venue/${id}`);
  };

  const onSubmit = (evt) => {
    evt.preventDefault();
    
    // Çift dikiş güvenlik: Submit anında kullanıcı yoksa durdur
    if (!user) {
        navigate("/login");
        return;
    }

    const text = evt.target.elements.text.value;
    const rating = evt.target.elements.rating.value;

    if (text && rating) {
      setSubmitting(true);

      let newComment = {
        author: user.name, // İsim otomatik olarak Token'daki isimden gelir
        text: text,
        rating: rating,
      };

      // Backend'e Token ile birlikte yolluyoruz
      VenueDataService.addComment(id, newComment, user.token)
        .then(() => {
          dispatch({ type: "ADD_COMMENT_SUCCESS" });
          setShowModal(true); 
        })
        .catch((err) => {
          console.error("Yorum Hatası:", err);
          dispatch({ type: "ADD_COMMENT_FAILURE" });
          setSubmitting(false);
          
          if (err.response && err.response.status === 401) {
             alert("Oturum süreniz dolmuş, lütfen tekrar giriş yapın.");
             navigate("/login");
          } else {
             alert("Yorum eklenirken bir hata oluştu.");
          }
        });
    } else {
        alert("Lütfen tüm alanları doldurunuz.");
    }
  };

  // Kullanıcı yüklenene kadar (veya login'e gidene kadar) boş ekran göster
  // Bu sayede kullanıcı boş formu görüp kafa karışıklığı yaşamaz.
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
                {/* İsim alanı kilitli ve otomatik dolu gelir */}
                <input
                  type="text"
                  className="form-control"
                  id="author"
                  name="author"
                  value={user.name} 
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
                  required 
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