const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId=Schema.Types.ObjectId;
const passportLocalMongoose = require("passport-local-mongoose");


// var bDay

const UserSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    birthDate: bDay={
        month:String,
        day: String,
        year: String
    },
    email: String,
    phone: String,
    password:String,
    gender: String,
    visitedLocations:[{type:ObjectId, ref: 'location'}],
    favoriteLocations:[{type:ObjectId, ref: 'location'}],
    role:String
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);