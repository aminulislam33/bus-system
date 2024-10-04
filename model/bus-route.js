const mongoose = require('mongoose');

const busRoute = mongoose.Schema({
    routeNu: {
        type: String,
        required: true,
        unique: true
    },
    stops: {
        type: [String], 
        required: true
    },
    busImg: {
        type: String
    }
}, { timestamps: true });

const BusRoute = mongoose.model('busRoute', busRoute);

module.exports = BusRoute;