import Header from "./Header";
import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import VenueDataService from "../services/VenueDataService";
import { useDispatch } from "react-redux";
import Modal from "./Modal";

function AddComment() {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  // Butona basıldığında yükleniyor durumu
  const [submitting, setSubmitting] = useState(false); 

  const handleModalClose = () => {
    setShowModal(false);
    navigate(`/venue/${id}`);
  };

  const onSubmit = (evt) => {
    evt.preventDefault();
    
    // Form elemanlarını al
    const author = evt.target.elements.author.value;
    const text = evt.target.elements.text.value;
    const rating = evt.target.elements.rating.value;

    if (author && text && rating) {
      // Butonu devre dışı bırak (Tıklanmaz yap)
      setSubmitting(true);

      let newComment = {
        author: author,
        text: text,
        rating: rating,
      };

      VenueDataService.addComment(id, newComment)
        .then(() => {
          dispatch({ type: "ADD_COMMENT_SUCCESS" });
          // İşlem bitti, Modal'ı aç
          setShowModal(true); 
        })
        .catch(() => {
          dispatch({ type: "ADD_COMMENT_FAILURE" });
          setSubmitting(false); 
          alert("Yorum eklenirken bir hata oluştu.");
        });
    } else {
        alert("Lütfen tüm alanları doldurunuz.");
    }
  };

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
                <input
                  type="text"
                  className="form-control"
                  id="author"
                  name="author"
                  disabled={submitting}
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