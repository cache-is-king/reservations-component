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

/*
let newRestaurant = new Restaurant({
	id: 5,
	name: 'Chipotle',
	seats: 8,
	reservations: [{
		id: 1,
		date: '06-07-2019',
		time: 18,
		name: 'Josh',
		party: 1,
		timestamp: 8
	}],
});

newRestaurant.save(function(err) {
	if (err) {
		console.error(err);
	}
	else {
		console.log('saved restaurant')
		mongoose.disconnect()
	}
})
*/


Restaurant.init().then(() => {
	mongoose.disconnect();
});
