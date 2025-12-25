var express = require('express');
var router = express.Router();
var jwt = require('express-jwt'); // Güvenlik paketi

// Güvenlik Görevlisi Tanımlaması (Middleware)
// Bu fonksiyon, gelen isteğin Header'ında "Bearer TOKEN" var mı diye bakar.
// Varsa ve geçerliyse geçiş izni verir, yoksa 401 hatası fırlatır.
var auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload', // Token içindeki bilgileri req.payload içine atar
  algorithms: ['HS256'] // Standart şifreleme algoritması
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
  // İPUCU: İleride admin eklerken buraya da 'auth' koyacağız
  .post(venueController.addVenue); 

router
  .route("/venues/:venueid")
  .get(venueController.getVenue)
  .put(venueController.updateVenue)
  .delete(venueController.deleteVenue);

// Yorum Rotaları
router
  .route("/venues/:venueid/comments")
  .post(auth, commentController.addComment); // DÜZELTME: Buraya 'auth' eklendi! 🔒

router
  .route("/venues/:venueid/comments/:commentid")
  .get(commentController.getComment)
  .put(commentController.updateComment) 
  .delete(commentController.deleteComment);

// Giriş ve Kayıt Rotaları
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;