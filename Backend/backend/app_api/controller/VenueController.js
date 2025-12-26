var mongoose = require('mongoose');
var Venue = mongoose.model("venue");
const jwt = require('jsonwebtoken');

const createResponse = function (res, status, content) {
    res.status(status).json(content);
}

var converter = (function () {
    var earthRadius = 6371; // km
    var radian2Kilometer = function (radian) {
        return parseFloat(radian * earthRadius);
    };
    var kilometer2Radian = function (distance) {
        return parseFloat(distance / earthRadius);
    };
    return {
        radian2Kilometer, kilometer2Radian,
    }
})();

// 1. LİSTELE
const listVenues = function (req, res) {
    var lat = parseFloat(req.query.lat) || 0;
    var long = parseFloat(req.query.long) || 0;
    var point = { type: "Point", coordinates: [lat, long] };
    var geoOptions = {
        distanceField: "distance", spherical: true,
        maxDistance: converter.radian2Kilometer(5000)
    };
    try {
        Venue.aggregate([
            {
                $geoNear: {
                    near: point, ...geoOptions,
                }
            }]).then((result) => {
                const venues = result.map(function (venue) {
                    return {
                        distance: converter.kilometer2Radian(venue.distance),
                        name: venue.name,
                        address: venue.address,
                        rating: venue.rating,
                        foodanddrink: venue.foodanddrink,
                        id: venue._id,
                    };
                });
                if (venues.length > 0)
                    createResponse(res, "200", venues);
                else
                    createResponse(res, "200", []);
            })
    } catch (error) {
        createResponse(res, "404", error);
    }
};

// 2. EKLE
const addVenue = async function (req, res) {
    try {
        await Venue.create({
            ...req.body,
            coordinates: [req.body.lat, req.body.long],
            hours: [
                {
                    days: req.body.days1,
                    open: req.body.open1,
                    close: req.body.close1,
                    isClosed: req.body.isClosed1
                },
                {
                    days: req.body.days2,
                    open: req.body.open2,
                    close: req.body.close2,
                    isClosed: req.body.isClosed2
                }
            ],
        }).then(function (response) {
            createResponse(res, "201", response);
        })
    }
    catch (error) {
        createResponse(res, "400", error);
    }
};

// 3. GETİR
const getVenue = async function (req, res) {
    try {
        await Venue.findById(req.params.venueid).exec().then(function (venue) {
            createResponse(res, 200, venue);
        });

    }
    catch (err) {
        createResponse(res, 404, { status: "böyle bir mekan yok" });
    }
}

// 4. GÜNCELLE
const updateVenue = async function (req, res) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
             return createResponse(res, 401, { "status": "Token yok." });
        }
        const token = authHeader.split(' ')[1];
        try {
            const user = jwt.verify(token, process.env.JWT_SECRET);
            if (!user.isAdmin) {
                 return createResponse(res, 403, { "status": "Sadece Admin güncelleyebilir." });
            }
        } catch (e) {
            return createResponse(res, 401, { "status": "Geçersiz Token." });
        }

        const updatedVenue = await Venue.findByIdAndUpdate(
            req.params.venueid,
            {
                ...req.body,
                coordinates: [req.body.lat, req.body.long],
                hours: [
                    {
                        days: req.body.day1,
                        open: req.body.open1,
                        close: req.body.close1,
                        isClosed: req.body.isClosed1
                    },
                    {
                        days: req.body.day2,
                        open: req.body.open2,
                        close: req.body.close2,
                        isClosed: req.body.isClosed2
                    }
                ]
            },
            { new: true }
        );

        createResponse(res, 201, updatedVenue);
    } catch (error) {
        createResponse(res, 400, { status: "Güncelleme başarsız.", error });
    }
};

// 5. SİL
const deleteVenue = async function (req, res) {
    try {
        console.log("Silme işlemi başladı. ID:", req.params.venueid);
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
             return createResponse(res, 401, { "status": "Token bulunamadı. Giriş yapmalısınız." });
        }

        const token = authHeader.split(' ')[1]; 
        let user;
        try {
            user = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            console.log("Token hatası:", err.message);
            return createResponse(res, 401, { "status": "Geçersiz Token." });
        }

        if (!user.isAdmin) {
             return createResponse(res, 403, { "status": "Yetkiniz yok! Sadece Adminler silebilir." });
        }

        const venue = await Venue.findByIdAndDelete(req.params.venueid);
        if (venue) {
            createResponse(res, 200, { status: venue.name + " isimli mekan silindi." });
        } else {
            createResponse(res, 404, { status: "Böyle bir mekan bulunamadı!" });
        }
    } catch (error) {
        console.log("HATA:", error);
        createResponse(res, 400, { status: "Silme işlemi başarısız.", error });
    }
};

// BU KISIM ÇOK ÖNEMLİ! EĞER BU YOKSA HATA ALIRSIN.
module.exports = {
    listVenues,
    addVenue,
    getVenue,
    updateVenue,
    deleteVenue
}