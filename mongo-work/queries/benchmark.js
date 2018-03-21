const db = require('../index.js');
const mongoose = require('mongoose');

const addReservation = (id, date, time, name, party, timestamp) => db.Restaurant.find({ id }).then((data) => {
  const maxSeats = data[0].seats;
  const seatsReserved = data[0].reservations.filter((reservation) => {
    return reservation.date === date && reservation.time === time;
  }).reduce((acc, reservation) => {
    return acc + reservation.party;
  }, 0);
  if (party <= maxSeats - seatsReserved) {
    console.log('Your reservation is confirmed :)');
    db.Restaurant.update(
      { id },
      {
        $push: {
          reservations:
            { date, time, name, party, timestamp }
        },
      },
    ).then(() => {
      console.timeEnd('AFTER INDEXING: time to check if a reservation slot is available and then add a reservation to the database if there is one');
      mongoose.disconnect() }).catch(error => console.log(error));
  } else {
    console.log('you can\'t reserve here :(');
    console.timeEnd('AFTER INDEXING: time to check if a reservation slot is available and then add a reservation to the database if there is one')
    mongoose.disconnect();
  }
}).catch((error) => console.log('Something went wrong :('));

console.time('AFTER INDEXING: time to check if a reservation slot is available and then add a reservation to the database if there is one');
addReservation(501110, '2018-04-09', 16, 'Beth', 6, '03-19-2018');
