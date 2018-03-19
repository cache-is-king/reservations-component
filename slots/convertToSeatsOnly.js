const restaurants = require('../restaurants/data/output1.js');
const fs = require('fs');

const seats = restaurants.map((restaurant) => {
  return restaurant.seats;
});

fs.writeFileSync('./seatsOnly.js', 'module.exports = ' + JSON.stringify(seats, null, 2))