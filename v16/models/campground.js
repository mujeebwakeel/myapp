var mongoose = require("mongoose");
var moment = require("moment");

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    location: String,
    imageId: String,
    price: String,
    booking: [
        {type: String}
    ],
    created: {type: Date},
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


