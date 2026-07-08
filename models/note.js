const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    name: String,
    course: String,
    date: String,
    note: String
});

module.exports = mongoose.model("Note", noteSchema);