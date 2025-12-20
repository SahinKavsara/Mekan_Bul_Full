import React, { useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";

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

    AuthService.login(formData)
      .then((response) => {
        if (response.data.token) {
          // TOKEN'I TARAYICIYA KAYDET (İşte burası kilit nokta)
          localStorage.setItem("user", JSON.stringify(response.data));
          
          alert("Giriş Başarılı!");
          navigate("/"); // Ana sayfaya yönlendir
          window.location.reload(); // Sayfayı yenile ki Header güncellensin
        }
      })
      .catch((error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.mesaj) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
      });
  };

  return (
    <>
      <Header headerText="Mekanbul" motto="Giriş Yap" />
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-6 col-md-offset-3">
            <form onSubmit={handleLogin}>
              {message && (
                <div className="alert alert-danger">{message}</div>
              )}

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

              <button className="btn btn-primary pull-right">Giriş Yap</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;