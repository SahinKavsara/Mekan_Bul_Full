import React, { useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import VenueDataService from "../services/VenueDataService"; 

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "", 
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

  const handleRegister = (e) => {
    e.preventDefault();
    setMessage("");
    
    // Basit doğrulama
    if (!formData.name || !formData.email || !formData.password) {
        setMessage("Lütfen tüm alanları doldurunuz.");
        return;
    }

    VenueDataService.register(formData.name, formData.email, formData.password)
      .then((response) => {
        alert("Kayıt Başarılı! Giriş yapabilirsiniz.");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Kayıt hatası:", error);
        const resMessage =
           (error.response && error.response.data && error.response.data.message) ||
           "Kayıt işlemi başarısız. (Bu e-posta kullanılıyor olabilir)";
        setMessage(resMessage);
      });
  };

  return (
    <>
      <Header headerText="Mekanbul" motto="Üye Ol" />
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-6 col-md-offset-3">
            <form className="form-horizontal" onSubmit={handleRegister}>
              {message && (
                <div className="alert alert-danger">{message}</div>
              )}
              
              <div className="form-group">
                <label className="col-sm-2 control-label">Ad Soyad:</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder="Adınızı ve Soyadınızı giriniz"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="col-sm-2 control-label">Email:</label>
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
                    placeholder="Şifrenizi belirleyiniz"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="col-sm-offset-2 col-sm-10">
                    <button type="submit" className="btn btn-default pull-right">
                        Kayıt Ol
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

export default Register;