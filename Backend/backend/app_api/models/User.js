const mongoose = require('mongoose');

// Kullanıcı Şeması (Schema) Oluşturuluyor
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true, // Bu alan zorunlu
    trim: true      // Başındaki/sonundaki boşlukları otomatik siler
  },
  email: {
    type: String,
    required: true,
    unique: true,   // Aynı e-posta ile ikinci kayıt yapılamaz
    trim: true,
    lowercase: true // E-postayı hep küçük harfe çevirir
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now // Kayıt anındaki tarihi otomatik atar
  }
});

// Modeli dışarı aktarıyoruz
module.exports = mongoose.model('User', UserSchema);