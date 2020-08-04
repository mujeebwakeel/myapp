var mongoose = require("mongoose");
var moment = require("moment");

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    location: String,
    imageId: String,
    price: String,
    created: {type: Date, default: Date.now},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }
        ]
});

module.exports  = mongoose.model("Campground", campgroundSchema);


