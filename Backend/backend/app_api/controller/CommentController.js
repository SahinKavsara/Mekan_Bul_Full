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

const createComment = function (req, res, incomingVenue) {
  if (!incomingVenue) {
    createResponse(res, 404, { "status": "Mekan bulunamadı" });
  } else {
    // Yorum objesini oluşturuyoruz
    incomingVenue.comments.push({
      // DÜZELTME BURADA:
      // Artık ismi formdan (body) değil, Token'dan (payload) alıyoruz.
      // Böylece kimse başkasının adına yorum atamaz.
      author: req.payload.name, 
      
      rating: req.body.rating,
      text: req.body.text
    });

    // Veritabanına kaydediyoruz
    incomingVenue.save(function (err, venue) {
      var comment;
      if (err) {
        createResponse(res, 400, err);
      } else {
        // Son eklenen yorumu bulup geri döndürüyoruz
        comment = venue.comments[venue.comments.length - 1];
        createResponse(res, 201, comment);
      }
    });
  }
};

const addComment = async function (req, res) {
    try {
        await Venue.findById(req.params.venueid)
            .select("comments")
            .exec()
            .then((incomingVenue) => {
                if (!incomingVenue) {
                    createResponse(res, 404, { "status": "Mekan bulunamadı" });
                    return;
                }
                createComment(req, res, incomingVenue);
            });
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