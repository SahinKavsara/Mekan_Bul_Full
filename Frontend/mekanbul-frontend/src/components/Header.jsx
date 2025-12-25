import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Header({ headerText, motto }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Sayfa her yüklendiğinde (veya header render olduğunda) kullanıcıyı kontrol et
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    // Çıkış yaparken hafızayı temizle ve anasayfaya at
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    window.location.reload(); // Tam temizlik için sayfayı yenile
  };

  return (
    <div className="page-header">
      <div className="row align-items-center"> {/* align-items-center ile dikey ortalama yapıyoruz */}
        
        {/* SOL TARAF: Logo ve Slogan */}
        <div className="col-xs-12 col-sm-6">
          <h1>
            <NavLink to="/" style={{ textDecoration: "none", color: "inherit" }}>
               {headerText}
            </NavLink> 
            <small> {motto}</small>
          </h1>
        </div>

        {/* SAĞ TARAF: Menü Butonları */}
        <div className="col-xs-12 col-sm-6" style={{ textAlign: "right", marginTop: "20px" }}>
          
          {/* Yönetici Butonu (Her zaman görünsün şimdilik) */}
          <NavLink 
            to="/admin" 
            className="btn btn-warning btn-sm" 
            style={{ marginRight: "10px" }}
          >
            ⚙️ Yönetici
          </NavLink>

          {/* Kullanıcı Giriş Durumuna Göre Değişen Kısım */}
          {user ? (
            // Kullanıcı Varsa: İsmini ve Çıkış Butonunu Göster
            <span style={{ fontSize: "14px", fontWeight: "bold" }}>
              Merhaba, {user.name} | 
              <button 
                className="btn btn-link" 
                onClick={handleLogout}
                style={{ textDecoration: "none", color: "#d9534f" }}
              >
                Çıkış Yap
              </button>
            </span>
          ) : (
            // Kullanıcı Yoksa: Giriş Yap Butonunu Göster
            <NavLink to="/login" className="btn btn-success btn-sm">
              Giriş Yap
            </NavLink>
          )}

        </div>
      </div>
    </div>
  );
}

export default Header;