// CSS dosyasını içe aktar
import "./App.css";

// React kütüphanesini içe aktar
import React, { useState } from "react";

// React DOM'u içe aktar
import ReactDOM from "react-dom/client";

// Sayfa bileşenlerini içe aktar
import Template from "./components/Template"; 
import Home from "./components/Home"; 
import VenueDetail from "./components/VenueDetail"; 
import AddComment from "./components/AddComment"; 
import About from "./components/About"; 
import PageNotFound from "./components/PageNotFound"; 

// Login ve Register bileşenlerini çağırıyoruz
import Login from "./components/Login";
import Register from "./components/Register";

// React Router bileşenlerini içe aktar
import { Routes, Route, BrowserRouter } from "react-router-dom";

// Redux store'u içe aktar
import store from "./redux/store.jsx";

// Redux Provider'ı içe aktar
import { Provider } from "react-redux";

// Uygulamayı başlat
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true, 
        v7_startTransition: true, 
      }}
    >
      <Routes>
        
        <Route path="/" element={<Template />}>
          
          <Route path="/" element={<Home />} />
          <Route path="venue/:id" element={<VenueDetail />} />
          <Route path="venue/:id/comment/new" element={<AddComment />} />
          <Route path="about" element={<About />} />

          
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          

          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
);