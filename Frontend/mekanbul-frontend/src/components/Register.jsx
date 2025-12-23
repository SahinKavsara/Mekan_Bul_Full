import React, { useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";

const Register = () => {
  const navigate = useNavigate();
  
  // DÜZELTME: Backend 'name' beklediği için burayı tekrar 'name' yaptık
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
    
    console.log("Kayıt işlemi başlatılıyor...", formData);

    AuthService.register(formData)
      .then((response) => {
        console.log("Kayıt başarılı:", response);
        alert("Kayıt Başarılı! Giriş yapabilirsiniz.");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Kayıt hatası:", error);
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.mesaj) || // Backend bazen 'mesaj' bazen 'message' dönebilir
           (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
      });
  };

  return (
    <>
      <Header headerText="Mekanbul" motto="Üye Ol" />
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-6 col-md-offset-3">
            <form onSubmit={handleRegister}>
              {message && (
                <div className="alert alert-danger">{message}</div>
              )}
              
              <div className="form-group">
                <label>Ad Soyad:</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"      // DÜZELTME: Burası 'name' olmalı
                  value={formData.name} // DÜZELTME: Burası 'name' olmalı
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Şifre:</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary pull-right">Kayıt Ol</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;