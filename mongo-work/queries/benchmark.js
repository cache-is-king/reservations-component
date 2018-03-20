const db = require('../index.js');
const mongoose = require('mongoose');

// getOpenSlots = (id, date) => db.Restaurant.find({ id: id }).then((data) => {
//   const reservationsToday = data[0].reservations.filter((reservation) => {
//     return reservation.date === date;
//   });
//   console.log(reservationsToday);
//   //from here it'll just be a bunch of logic to generate the required output
//   mongoose.disconnect()
// }).catch((err) => console.log(err));

//getOpenSlots(9, '2018-04-15')

// addReservation = (id, date, time, party, name) => db.Restaurant.find({ id }).then((restaurants) => {
//   restaurants[0].reservations.push({
//     date,
//     time,
//     party,
//     name,
//   });
//   db.Restaurant.save();
//   mongoose.disconnect();
// }).catch(err => console.log(err));


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

// before we do this, we'll have to check if it's okay

/*
const addReservation = (id, date, time, name, party, timestamp) => db.Restaurant.update(
  { id: id },
  {
    $push: {
      reservations: 
        {date, time, name, party, timestamp}     
    }
  }
  ).then(() => mongoose.disconnect()).catch((error) => console.log(error))
  */
console.time('AFTER INDEXING: time to check if a reservation slot is available and then add a reservation to the database if there is one');
addReservation(501110, '2018-04-09', 16, 'Beth', 6, '03-19-2018');
