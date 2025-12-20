var express = require('express');
var router = express.Router();

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
  .post(commentController.addComment);

router
  .route("/venues/:venueid/comments/:commentid")
  .get(commentController.getComment)
  .put(commentController.updateComment)
  .delete(commentController.deleteComment);

// Giriş ve Kayıt Rotaları
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;