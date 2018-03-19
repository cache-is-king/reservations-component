const db = require('../server/db/index.js');
const seats = require('./seatsOnly.js');
const fs = require('fs');

//do one query to populate table, then do another one to update

// db.client.query('INSERT INTO slots (date, time, restaurantid, seats_remaining) SELECT DISTINCT ON (date, time, restaurantid) date, time, restaurantid, seats FROM restaurants INNER JOIN reservations ON restaurants.id = reservations.restaurantid WHERE restaurants.id < ($1)', [100000], (err, res) => {
//   if (err) {
//     console.error(err);
//   } else {
//     db.client.end();
//   }
// });


// db.client.query('SELECT * FROM reservations WHERE restaurantid > 10000 AND restaurantid < 20000', (err, results) => {
//   if (err) {
//     console.error(err);
//   } else {
//     results.rows.forEach((slot, index, array) => {
//       db.client.query('UPDATE slots SET seats_remaining = seats_remaining - ($1) WHERE date = ($2) AND time = ($3) AND restaurantid = ($4)', [slot.party, slot.date, slot.time, slot.restaurantid], (err, results) => {
//         if (err) {
//           console.error(err);
//         }
//         else {
//           if (index % 1000 === 0) {
//             console.log(index)
//           }
//           if (index === array.length - 1) {
//             console.log('finished');
//             db.client.end();
//           }
//         }
//       })
//     }
//     )
//   }
// })

// console.time('Time to populate new table with data from 10000 restaurants');
// db.client.query('SELECT date, time, restaurantid, SUM(party) FROM reservations WHERE restaurantid < 10000 GROUP BY date, time, restaurantid', (err, results) => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log(results.rows)
//     results.rows.forEach((slot, index, array) => {
//       const openSeats = slot.sum - seats[slot.restaurantid];
//       db.client.query('INSERT INTO slots (date, time, restaurantid, seats_remaining) VALUES ($1, $2, $3, $4)', [slot.date, slot.time, slot.restaurantid, openSeats], (err, results) => {
//         if (err) {
//           console.error(err);
//         } else {
//           if (index % 1000 === 0) {
//             console.log(index);
//           }
//           if (index === array.length - 1) {
//             console.log('finished');
//             console.timeEnd('Time to populate new table with data from 10000 restaurants');
//             db.client.end();
//           }
//         }
//       })
//     })
//   }
// })

const iteration = 10;
db.client.query(`SELECT date, time, restaurantid, SUM(party) FROM reservations WHERE restaurantid >= ${(iteration - 1) * 100000} AND restaurantid < ${iteration * 100000} GROUP BY date, time, restaurantid`, (err, results) => {
  if (err) {
    console.error(err);
  } else {
    let outputString = '';
    let slotId = 12788122;
    results.rows.forEach((slot, index, array) => {
      const seatsRemaining = seats[slot.restaurantid] - slot.sum;
      outputString += `${slotId},${slot.date.toISOString().slice(0, 10)},${slot.time},${slot.restaurantid},${seatsRemaining}\n`;
      if (index === array.length - 1) {
        console.log("start next one at", slotId + 1)
        fs.writeFileSync(`./csv-files/slotsAsCsv${iteration}.csv`, outputString);
        db.client.end()
      }
      slotId += 1;
    });
  }
});