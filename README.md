# 📍 Mekan Bul Full-Stack Web Uygulaması

![Mekan Bul Banner](banner.png)

**Mekan Bul (Find Venue)**, kullanıcıların bulundukları konuma en yakın mekanları (kafe, restoran vb.) keşfetmelerini, detaylarını görüntülemelerini ve bu mekanlara puan verip yorum yapmalarını sağlayan kapsamlı bir Full-Stack web uygulamasıdır. 

Bu repo, uygulamanın hem **Frontend (İstemci)** hem de **Backend (Sunucu)** kısımlarını tek bir çatı altında barındırmaktadır.

---

## 🔗 Canlı Önizleme (Live Demos)

Uygulamanın çalışan son haline aşağıdaki bağlantılardan ulaşabilirsiniz:

- **🌐 Frontend (Kullanıcı Arayüzü):** [https://mekanful-frontend.vercel.app](https://mekanful-frontend.vercel.app)
- **⚙️ Backend (API Servisi):** [https://mekan-bul-theta.vercel.app](https://mekan-bul-theta.vercel.app)

---

## 🚀 Proje Özellikleri

- **Konum Bazlı Keşif:** Bulunduğunuz konuma veya aradığınız adrese göre etraftaki mekanları mesafeleriyle listeleme.
- **Detaylı İnceleme:** Mekanlara ait çalışma saatleri, imkanlar (Wi-Fi, otopark, vb.), puan durumu ve harita üzerindeki konumunu görüntüleme.
- **Yorum & Puanlama Sistemi:** Mekan deneyimleri hakkında yorum bırakma ve 1-5 arası yıldızlı puanlama yapabilme.
- **Dinamik State Yönetimi:** Redux Toolkit sayesinde optimize edilmiş veri işleme.
- **Modern Arayüz Tasarımı:** Bootstrap ile hazırlanan, her cihaza uyumlu (Responsive) kullanıcı dostu, şık arayüz.

---

## 🛠️ Kullanılan Teknolojiler

### Frontend (İstemci)
* Klasör: `/Frontend/mekanbul-frontend`
* **React:** UI (Arayüz) geliştirme kütüphanesi
* **Vite:** Geliştirme sürecini kolaylaştıran modern build aracı
* **React Router:** SPA için sayfa yönlendirmeleri
* **Redux Toolkit:** Merkezi state (durum) yönetimi
* **Axios:** RESTful API ile HTTP istekleri kurma
* **Bootstrap:** CSS framework ile responsive komponentler 

### Backend (Sunucu)
* Klasör: `/Backend/backend`
* **Node.js:** JavaScript çalışma ortamı
* **Express.js:** Web API sunucu iskeleti (Framework)
* **MongoDB & Mongoose:** NoSQL veritabanı ve ODM (Object Data Modeling)
* **JSON Web Token (JWT) & bcryptjs:** Kimlik doğrulama ve veri şifreleme alt yapısı

---

## 📁 Proje Yapısı

\`\`\`text
Mekan_Bul_Full/
│
├── Backend/                 # Sunucu Taraflı (API) Kodlar
│   └── backend/
│       ├── app_api/         # API Controller & Model Klasörleri
│       ├── routes/          # Express route tanımları
│       ├── tests/           # Postman API test ekran görüntüleri
│       ├── app.js           # Ana sunucu başlangıç yapılandırması
│       └── package.json     # Node modülleri bağımlılıkları
│
└── Frontend/                # İstemci Taraflı (UI) Kodlar
    └── mekanbul-frontend/
        ├── src/             
        │   ├── components/  # React arayüz bileşenleri (Home, VenueDetail vb.)
        │   ├── redux/       # Redux reducer ve store yapılandırması
        │   └── services/    # Axios API bağlantı fonksiyonları
        ├── package.json     # Node modülleri bağımlılıkları
        └── vite.config.js   # Vite ayar dosyası
\`\`\`

---

## ⚙️ Kurulum ve Çalıştırma

Projeyi yerel ortamınızda (localhost) çalıştırmak için aşağıdaki adımları sırasıyla uygulayabilirsiniz.

### 1. Depoyu Klonlayın
\`\`\`bash
git clone <bu-deponun-urlsi>
cd Mekan_Bul_Full
\`\`\`

### 2. Backend Geliştirme Ortamı Kurulumu
Yeni bir terminal sekmesinde açın:
\`\`\`bash
cd Backend/backend
npm install
npm start
\`\`\`
*Sunucu ortamı \`http://localhost:3000\` veya tanımlanan .env portunda başlayacaktır.*

### 3. Frontend Geliştirme Ortamı Kurulumu
İkinci bir terminal sekmesinde açın:
\`\`\`bash
cd Frontend/mekanbul-frontend
npm install
npm run dev
\`\`\`
*Bu işlem \`http://localhost:5173\` (Vite standart portu) üzerinden React uygulamasını ayağa kaldırır.*

---

## 📡 Temel API Endpoint'leri
Uygulama arka planda aşağıdaki API yollarını kullanır:

- \`GET /api/venues\` : Yakındaki tüm mekanları getirir
- \`POST /api/venues\` : Yeni bir mekan ekler
- \`GET /api/venues/:venueid\` : İlgili mekanın detay verilerini getirir
- \`PUT /api/venues/:venueid\` : Mekan bilgilerini günceller
- \`POST /api/venues/:venueid/comments\` : Seçili mekana yeni yorum ekler
- \`DELETE /api/venues/:venueid/comments/:commentid\` : Spesifik yorumu siler

*(API testlerine ait Postman ekran görüntülerini \`Backend/backend/tests/\` dizininde inceleyebilirsiniz).*

---

## 👨‍💻 Geliştirici

**Şahin Kavsara - 2025**  
*Mekan Bul Projesi / Full-Stack Web Geliştirme*
