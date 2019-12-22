const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId=Schema.Types.ObjectId;


// var bDay

const RatingSchema = new mongoose.Schema({
    username: String,
    Comment:String,
    rating: Number

});

module.exports = mongoose.model("Rating", RatingSchema);