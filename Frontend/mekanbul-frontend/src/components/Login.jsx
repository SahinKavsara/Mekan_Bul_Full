import React, { useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import VenueDataService from "../services/VenueDataService"; // AuthService yerine bunu kullanıyoruz

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.email || !formData.password) {
      setMessage("Lütfen tüm alanları doldurunuz.");
      return;
    }

    VenueDataService.login(formData.email, formData.password)
      .then((response) => {
        if (response.data.token) {
          // Token'ı kaydet
          localStorage.setItem("user", JSON.stringify(response.data));
          
          // Header güncellensin diye sayfayı yenileyerek anasayfaya git
          window.location.href = "/"; 
        }
      })
      .catch((error) => {
        // Hata mesajını yakala
        const resMessage =
          (error.response && error.response.data && error.response.data.message) ||
          "Giriş başarısız. E-posta veya şifre hatalı.";
        setMessage(resMessage);
      });
  };

  return (
    <>
      <Header headerText="Mekanbul" motto="Giriş Yap" />
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-6 col-md-offset-3">
            <form className="form-horizontal" onSubmit={handleLogin}>
              {message && (
                <div className="alert alert-danger">{message}</div>
              )}

              <div className="form-group">
                <label className="col-sm-2 control-label">E-Posta:</label>
                <div className="col-sm-10">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="E-postanızı giriniz"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-2 control-label">Şifre:</label>
                <div className="col-sm-10">
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Şifrenizi giriniz"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-offset-2 col-sm-10">
                  {/* Kayıt Ol butonu (Sadece yönlendirme yapar) */}
                  <button
                    type="button"
                    className="btn btn-default pull-left"
                    onClick={() => navigate("/register")}
                    style={{ color: "#d9534f" }} // Kırmızı renk
                  >
                    Kayıt Ol
                  </button>
                  
                  {/* Giriş Yap butonu */}
                  <button type="submit" className="btn btn-default pull-right">
                    Giriş Yap
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;