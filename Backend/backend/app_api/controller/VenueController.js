var mongoose = require('mongoose');
var Venue = mongoose.model("venue");
const jwt = require('jsonwebtoken'); // <-- YENİ EKLEME: Token çözücü

const createResponse = function (res, status, content) {
    res.status(status).json(content);
}

// ... Diğer fonksiyonlar (listVenues, addVenue vb.) aynı kalabilir ...
// ... Sadece deleteVenue ve updateVenue'yu değiştireceğiz ...
// Yer kazanmak için yukarıdaki fonksiyonları ellemiyorum, sen dosyanın o kısımlarını koru.

// --- GÜNCELLENMİŞ SİLME FONKSİYONU ---
const deleteVenue = async function (req, res) {
    try {
        console.log("Silme işlemi başladı. ID:", req.params.venueid);

        // 1. MANUEL TOKEN KONTROLÜ
        // Header'dan token'ı alıyoruz
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
             console.log("HATA: Token header'da yok!");
             return createResponse(res, 401, { "status": "Token bulunamadı. Giriş yapmalısınız." });
        }

        const token = authHeader.split(' ')[1]; // "Bearer <token>" kısmından token'ı ayır

        // Token'ı şifreyle çözüyoruz
        let user;
        try {
            user = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Token doğrulandı. Kullanıcı:", user.name, "Admin mi:", user.isAdmin);
        } catch (err) {
            console.log("HATA: Token geçersiz veya süresi dolmuş.");
            return createResponse(res, 401, { "status": "Geçersiz Token." });
        }

        // 2. YETKİ KONTROLÜ
        if (!user.isAdmin) {
             console.log("HATA: Kullanıcı Admin değil.");
             return createResponse(res, 403, { "status": "Yetkiniz yok! Sadece Adminler silebilir." });
        }

        // 3. SİLME İŞLEMİ
        const venue = await Venue.findByIdAndDelete(req.params.venueid);
        if (venue) {
            console.log("BAŞARILI: Mekan silindi.");
            createResponse(res, 200, { status: venue.name + " isimli mekan silindi." });
        } else {
            createResponse(res, 404, { status: "Böyle bir mekan bulunamadı!" });
        }
    } catch (error) {
        console.log("BEKLENMEDİK HATA:", error);
        createResponse(res, 400, { status: "Silme işlemi başarısız.", error });
    }
};

// ... Diğer updateVenue vb. fonksiyonlar ...
// ... updateVenue için de aynı mantığı uygulayabilirsin ...

module.exports = {
    // ... diğerleri ...
    deleteVenue, // Bunu export etmeyi unutma
    // ...
}