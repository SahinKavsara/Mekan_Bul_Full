var mongoose = require( 'mongoose' );
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

// Kullanıcı Şeması
var userSchema = new mongoose.Schema({
  name: { // Frontend 'name' yolluyor, o yüzden burayı name yaptık
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true, 
    trim: true
  },

  isAdmin: {         // <-- YENİ EKLENEN KISIM
    type: Boolean,
    default: false
  },
  // Şifreyi açık (plain text) saklamıyoruz! Hash ve Salt kullanıyoruz.
  hash: String,
  salt: String
});

// Şifreyi şifreleyerek (Hash+Salt) kaydetme metodu
userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

// Giriş yaparken şifre doğru mu kontrol etme metodu
userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

// Token (JWT) üretme metodu
userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7); // Token 7 gün geçerli olsun

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    isAdmin: this.isAdmin,
    exp: parseInt(expiry.getTime() / 1000), // Son kullanma tarihi
  }, process.env.JWT_SECRET); // Vercel'e eklediğimiz gizli anahtar
};

mongoose.model('user', userSchema);