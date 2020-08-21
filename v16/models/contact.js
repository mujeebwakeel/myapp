var mongoose = require("mongoose");

var contactSchema = new mongoose.Schema({
    username: String,
    method: String,
    chat: String,
    date: String,
    attention: {type: Boolean, default: false}
});

module.exports = mongoose.model("Contact", contactSchema);