var express = require('express');
var router = express.Router();

// JWT Kütüphanesi
var { expressjwt: jwt } = require('express-jwt'); 

// Güvenlik Görevlisi (Middleware)
var auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload', 
  algorithms: ['HS256'] 
});

// Controllerlar
var venueController = require("../controller/VenueController");
var commentController = require("../controller/CommentController");
var authController = require("../controller/authentication"); 

// --- 1. ADMİN ROTASI (YENİ EKLENEN KISIM) ---
// Bu satır, VenueDataService.getAllVenues() fonksiyonunun çalışmasını sağlar.
// ÖNEMLİ: '/venues/:venueid' rotasından ÖNCE gelmeli.
router
  .route("/admin/venues")
  .get(venueController.listAllVenues);


// --- 2. MEKAN ROTALARI ---
router
  .route("/venues")
  .get(venueController.listVenues)
  .post(auth, venueController.addVenue); // Ekleme işlemi de şifreli olmalı (İsteğe bağlı, auth silebilirsin)

router
  .route("/venues/:venueid")
  .get(venueController.getVenue)             // Herkes görebilir
  .put(auth, venueController.updateVenue)    // Sadece Admin günceller 🔒
  .delete(auth, venueController.deleteVenue);// Sadece Admin siler 🔒


// --- 3. YORUM ROTALARI ---
router
  .route("/venues/:venueid/comments")
  .post(auth, commentController.addComment); // Yorum yapmak için giriş şart 🔒


// --- 4. GİRİŞ VE KAYIT ---
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;