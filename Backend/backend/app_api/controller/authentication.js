const mongoose = require('mongoose');
const User = mongoose.model('user');

const sendJSONResponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

// KAYIT OL (REGISTER)
const register = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    sendJSONResponse(res, 400, { "mesaj": "Tüm alanlar zorunludur!" });
    return;
  }

  const user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  // Şifreyi şifreleyerek kaydet
  user.setPassword(req.body.password);

  user.isAdmin = (req.body.name === "Admin");
  user.setPassword(req.body.password);

  try {
    // Veritabanına kaydet
    await user.save();
    // Token üret
    const token = user.generateJwt();
    // Başarılı yanıt ve token dön
    sendJSONResponse(res, 200, { "token": token });
  } catch (err) {
    sendJSONResponse(res, 400, err);
  }
};

// GİRİŞ YAP (LOGIN)
const login = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    sendJSONResponse(res, 400, { "mesaj": "Tüm alanlar zorunludur!" });
    return;
  }

  try {
    // Kullanıcıyı email ile bul
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      sendJSONResponse(res, 404, { "mesaj": "Kullanıcı bulunamadı" });
      return;
    }

    // Şifre doğru mu kontrol et
    if (user.validPassword(req.body.password)) {
      const token = user.generateJwt();
      sendJSONResponse(res, 200, { "token": token });
    } else {
      sendJSONResponse(res, 401, { "mesaj": "Şifre hatalı" });
    }
  } catch (err) {
    sendJSONResponse(res, 400, err);
  }
};

module.exports = {
  register,
  login
};