var mongoose = require('mongoose');
var Venue = mongoose.model("venue");

const createResponse = function (res, status, content) {
    res.status(status).json(content);
}

var calculateLastRating = function (incomingVenue, isDeleted) {
    var i, numComments, avgRating, sumRating = 0;
    var numComments = incomingVenue.comments.length;

    if (incomingVenue.comments) {
        if (incomingVenue.comments.length == 0 && isDeleted) {
            avgRating = 0;
        } else {
            for (i = 0; i < numComments; i++) {
                sumRating = sumRating + incomingVenue.comments[i].rating;
            }
            avgRating = Math.ceil(sumRating / numComments);
        }
        incomingVenue.rating = avgRating;
        incomingVenue.save();
    }
};

var updateRating = function (venueid, isDeleted) {
    Venue.findById(venueid)
        .select("rating comments")
        .exec()
        .then(function (venue) {
            calculateLastRating(venue, isDeleted);
        });
};

// --- MODERNLEŞTİRİLMİŞ CREATE COMMENT ---
const createComment = async function (req, res, incomingVenue) {
    try {
        // 1. Yorum objesini oluşturuyoruz
        incomingVenue.comments.push({
            // Formdan isim geldiyse onu, gelmediyse Token'daki ismi kullan
            author: req.body.author ? req.body.author : req.payload.name,
            rating: req.body.rating,
            text: req.body.text
        });

        // 2. KAYIT İŞLEMİ (Await kullanarak)
        // Artık callback yok, bu sayede işlem askıda kalmayacak.
        await incomingVenue.save();

        // 3. Puanı Güncelle (Yorum eklendiği için ortalama değişmeli)
        updateRating(incomingVenue._id, false);

        // 4. Son eklenen yorumu bulup cevap dönüyoruz
        const newComment = incomingVenue.comments[incomingVenue.comments.length - 1];
        createResponse(res, 201, newComment);

    } catch (error) {
        createResponse(res, 400, error);
    }
};

// --- MODERNLEŞTİRİLMİŞ ADD COMMENT ---
const addComment = async function (req, res) {
    try {
        // Zincirleme .then yerine temiz await kullanımı
        const incomingVenue = await Venue.findById(req.params.venueid).select("comments");

        if (!incomingVenue) {
            createResponse(res, 404, { "status": "Mekan bulunamadı" });
        } else {
            // Helper fonksiyonu çağırıyoruz
            await createComment(req, res, incomingVenue);
        }
    } catch (error) {
        createResponse(res, 400, { status: "Yorum ekleme başarısız" });
    }
};

const getComment = async function (req, res) {
    try {
        await Venue.findById(req.params.venueid).select("name comments").exec().then(function (venue) {
            var response, comment;
            if (!venue) {
                createResponse(res, "404", "Mekanid yanlış");
            } else if (venue.comments.id(req.params.commentid)) {
                comment = venue.comments.id(req.params.commentid);
                response = {
                    venue: {
                        name: venue.name,
                        id: req.params.id,
                    },
                    comment: comment
                }
                createResponse(res, "200", response);
            } else {
                createResponse(res, "404", "Yorum id yanlış");
            }
        });
    } catch (error) {
        createResponse(res, "404", "Mekan bulunamadı");
    }
};

const updateComment = async function (req, res) {
    try {
        await Venue.findById(req.params.venueid)
            .select("comments")
            .exec()
            .then(function (venue) {
                try {
                    let comment = venue.comments.id(req.params.commentid);
                    if (comment) {
                        comment.set(req.body);
                        venue.save().then(function () {
                            updateRating(venue._id, false);
                            createResponse(res, "201", comment);
                        });
                    } else {
                        createResponse(res, "404", { status: "Yorum ID bulunamadı" });
                    }
                } catch (error) {
                    createResponse(res, "400", error);
                }
            });
    } catch (error) {
        createResponse(res, "400", error);
    }
};

const deleteComment = async function (req, res) {
    try {
        await Venue.findById(req.params.venueid)
            .select("comments")
            .exec()
            .then(function (venue) {
                try {
                    let comment = venue.comments.id(req.params.commentid);
                    if (comment) {
                        comment.deleteOne();
                        venue.save().then(function () {
                            updateRating(venue._id, true);
                            createResponse(res, "200", { status: comment.author + " isimli kişinin yorumu silindi" });
                        });
                    } else {
                        createResponse(res, "404", { status: "Yorum bulunamadı" });
                    }
                } catch (error) {
                    createResponse(res, "400", error);
                }
            });
    } catch (error) {
        createResponse(res, "400", error);
    }
};

module.exports = {
    addComment,
    getComment,
    updateComment,
    deleteComment
}