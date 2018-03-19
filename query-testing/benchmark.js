const db = require('../server/db/index.js');
const moment = require('moment-timezone');

// console.time('early id query for restaurant')
// db.client.query('SELECT * FROM restaurants WHERE id = ($1)', [9543355], (err, data) => {
//   if (err) {
//     console.error(err)
//   }
//   else {
//     console.log(data)
//     console.timeEnd('early id query for restaurant')
//     db.client.end()
//   }
// })


console.log('******************INITIAL BENCHMARKS********************')

console.time('query for all reservation info for a given restaurant')

db.client.query('SELECT * FROM reservations WHERE restaurantid = ($1)', [789], (err, data) => {
  if (err) {
    console.error(err);
  } else {
    console.timeEnd('query for all reservation info for a given restaurant');
    console.time('query for all reservation info for a given restaurant with high-number ID');
    db.client.query('SELECT * FROM reservations WHERE restaurantid = ($1)', [9898900], (err, data) => {
      if (err) {
        console.error(err);
      } else {
        console.timeEnd('query for all reservation info for a given restaurant with high-number ID');
        console.time('low-number id query for restaurant info');
        db.client.query('SELECT * FROM restaurants WHERE id = ($1)', [6], (err, data) => {
          if (err) {
            console.error(err);
          } else {
            console.timeEnd('low-number id query for restaurant info');
            console.time('high-number id query for restaurant info');
            db.client.query('SELECT * FROM restaurants WHERE id = ($1)', [895043], (err, data) => {
              if (err) {
                console.error(err);
              } else {
                console.timeEnd('high-number id query for restaurant info');
                console.time('query time for getting open seats for a restaurant and date');
                db.client.query('SELECT time,seats_remaining AS remaining FROM slots WHERE date=$1 AND restaurantid=$2',
                  ['04-04-18', 999988], (err, data) => {
                    if (err) {
                      console.error(err);
                    } else {
                      console.timeEnd('query time for getting open seats for a restaurant and date')
                      db.client.end();
                    }
                  })
              }
            });
          }
        });
      }
    });
  }
});