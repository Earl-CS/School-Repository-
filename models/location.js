const mongoose = require('mongoose');


const LocationSchema = new mongoose.Schema({
    locationName: String,
    address: Address={
        town: String, 
        city: String,
        province: String,
        country: String
    },
    estimateCost: String,
    description: String,
    index: Number, 
    numFavorites: Number,
    splashImage: String,
    otherImages: [String]
});

module.exports = mongoose.model("Location", LocationSchema);