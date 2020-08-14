var mongoose = require("mongoose");

var bookSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    familyMembers: String,
    from: String,
    to: String,
    email: String,
    campName: String
});

module.exports = mongoose.model("Book", bookSchema);