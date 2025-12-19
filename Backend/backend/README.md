Bu proje, Full-Stack Web Geliştirme dersi ödevidir. Konum bazlı mekan listeleme, yorum ekleme ve yönetme işlemlerini içerir.

Canlı Demo (Vercel)
Projenin Çalışan Son Hali:

https://mekan-bul-theta.vercel.app 

https://mekan-bul-theta.vercel.app/api/venues?lat=37.7830&long=30.5423

Kullanılan Teknolojiler

Backend: Node.js, Express.js
Veritabanı: MongoDB Cloud (Atlas)
Platform: Vercel

Kurulum:

* cd /path/to/backend

* npm install

Uygulama Çalıştırma:

* npm start

API ENDPOINTS
* Tüm Mekanları Listele: GET /api/venues
* Yeni Mekan Ekle: POST /api/venues
* Mekan Detaylarını Getir: GET /api/venues/:venueid
* Mekan Güncelle: PUT /api/venues/:venueid
* Mekan Sil: DELETE /api/venues/:venueid
* Yorum Ekle (Mekana): POST /api/venues/:venueid/comments
* Yorum Getir: GET /api/venues/:venueid/comments/:commentid
* Yorum Güncelle: PUT /api/venues/:venueid/comments/:commentid
* Yorum Sil: DELETE /api/venues/:venueid/comments/:commentid

POSTMAN TEST SONUCU: Aşağıda Postman ile alınmış test sonuçlarının ekran görüntüsü bulunmaktadır.
### Mekan Ekleme Test
![Mekan Ekleme Ekran Görüntüsü](tests/MekanEklemeTest1.PNG)
![Mekan Ekleme Ekran Görüntüsü2](tests/MekanEklemeTest2.PNG)

### Mekan Listeleme Test
![Mekan Listeleme Ekran Görüntüsü](tests/MekanListeTest1.PNG)
![Mekan Listeleme Ekran Görüntüsü2](tests/MekanListeTest2.PNG)

## Mekan Silme Test
![Mekan Silme Ekran Görüntüsü](tests/MekanSilmeTest1.PNG)

## Mekan Bilgi Güncelleme Test
![Mekan Bilgi Güncelleme Ekran Görüntüsü](tests/MekanUpdateTest.PNG)

## Yakın Mekanları Listeleme Test
![Yakın Mekanları Listeleme Ekran Görüntüsü](tests/YakınMekanTest.PNG)

## Yorum Ekleme Test
![Yorum Ekleme Ekran Görüntüsü](tests/YorumEklemeTest1.PNG)
![Yorum Ekleme Ekran Görüntüsü2](tests/YorumEklemeTest2.PNG)

## Yorum Listeleme Test
![Yorum Listeleme Ekran Görüntüsü](tests/YorumListeleTest.PNG)

## Yorum Silme Test
![Yorum Silme Ekran Görüntüsü](tests/YorumSilmeTest1.PNG)
![Yorum Silme Ekran Görüntüsü2](tests/YorumSilmeTest2.PNG)

## Yorum Güncelleme Test
![Yorum Güncelleme Ekran Görüntüsü](tests/YorumUpdateTest.PNG)