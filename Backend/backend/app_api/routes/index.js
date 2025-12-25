var express = require('express');
var router = express.Router();

// DÜZELTME: Yeni versiyon için süslü parantez ve 'expressjwt' kullanımı şart!
var { expressjwt: jwt } = require('express-jwt'); 

// Güvenlik Görevlisi Tanımlaması (Middleware)
var auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload', 
  algorithms: ['HS256'] 
});

// Mevcut Controllerlar
var venueController = require("../controller/VenueController");
var commentController = require("../controller/CommentController");

// Authentication Controller
var authController = require("../controller/authentication"); 

// Mekan Rotaları
router
  .route("/venues")
  .get(venueController.listVenues)
  .post(venueController.addVenue); 

router
  .route("/venues/:venueid")
  .get(venueController.getVenue)
  .put(venueController.updateVenue)
  .delete(venueController.deleteVenue);

// Yorum Rotaları
router
  .route("/venues/:venueid/comments")
  .post(auth, commentController.addComment); // 🔒 Kilitli Kapı (Auth aktif)

router
  .route("/venues/:venueid")
  .get(venueController.getVenue)
  // Güncelleme ve Silme işlemlerine 'auth' ekledik
  .put(auth, venueController.updateVenue) 
  .delete(auth, venueController.deleteVenue);

// Giriş ve Kayıt Rotaları
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;