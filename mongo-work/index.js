const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/restaurants');

const restaurantSchema = mongoose.Schema({
  id: Number,
  name: String,
  seats: Number,
  reservations: [{
    id: Number,
    date: String,
    time: Number,
    name: String,
    party: Number,
    timestamp: String,
  }],
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports.Restaurant = Restaurant
