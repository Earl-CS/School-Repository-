const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId=Schema.Types.ObjectId;
// const passportLocalMongoose = require("passport-local-mongoose");


// var bDay

const ObjectCheckSchema = new mongoose.Schema({
    email: String,
    visitedLocations:{type:ObjectId, ref: 'location'},
});

// UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("ObjectCheck", ObjectCheckSchema);