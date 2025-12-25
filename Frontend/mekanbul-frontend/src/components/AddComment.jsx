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

  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("Yorum yapmak için oturum açmalısınız.");
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleModalClose = () => {
    setShowModal(false);
    navigate(`/venue/${id}`);
  };

  const onSubmit = (evt) => {
    evt.preventDefault();
    
    if (!user) {
        navigate("/login");
        return;
    }

    // DÜZELTME 1: Verileri formdan alıyoruz (Artık ismi de formdan alıyoruz)
    const author = evt.target.elements.author.value;
    const text = evt.target.elements.text.value;
    const rating = evt.target.elements.rating.value;

    if (author && text && rating) {
      setSubmitting(true);

      let newComment = {
        author: author, // DÜZELTME 2: Elle yazılan ismi gönderiyoruz
        text: text,
        rating: rating,
      };

      VenueDataService.addComment(id, newComment, user.token)
        .then(() => {
          dispatch({ type: "ADD_COMMENT_SUCCESS" });
          setShowModal(true); 
        })
        .catch((err) => {
          console.error("Yorum Hatası:", err);
          setSubmitting(false);
          alert("Yorum eklenirken hata oluştu.");
        });
    } else {
        alert("Lütfen tüm alanları doldurunuz.");
    }
  };

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
                {/* DÜZELTME 3: Kilitleri kaldırdık, defaultValue yaptık */}
                <input
                  type="text"
                  className="form-control"
                  id="author"
                  name="author"
                  defaultValue={user.name} 
                  required
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