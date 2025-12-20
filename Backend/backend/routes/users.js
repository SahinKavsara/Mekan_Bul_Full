var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');     // Şifreleme için
var jwt = require('jsonwebtoken');    // Token oluşturmak için

// User modelini import ediyoruz (Henüz oluşturmadıysak bir sonraki adımda oluşturacağız)
// Not: Model dosyasının yolunu projene göre kontrol etmelisin.
var User = require('../app_api/models/User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// --- KAYIT OL (REGISTER) ---
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // 1. Kullanıcı zaten var mı kontrol et
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Bu e-posta zaten kayıtlı." });
    }

    // 2. Şifreyi hashle (kriptola)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Yeni kullanıcıyı oluştur
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    // 4. Veritabanına kaydet
    await newUser.save();

    res.status(201).json({ message: "Kullanıcı başarıyla oluşturuldu." });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- GİRİŞ YAP (LOGIN) ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Kullanıcıyı bul
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    // 2. Şifreyi kontrol et
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Hatalı şifre." });
    }

    // 3. JWT Token oluştur (Vercel'deki secret burada kullanılıyor)
    const token = jwt.sign(
      { id: user._id, username: user.username }, 
      process.env.JWT_SECRET, // .env dosyasındaki anahtar
      { expiresIn: '1h' }     // Token 1 saat geçerli olsun
    );

    res.json({ 
      message: "Giriş başarılı",
      token: token,
      user: { id: user._id, username: user.username, email: user.email }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;