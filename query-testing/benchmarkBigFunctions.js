const db = require('../server/db/index.js');

console.time('time for genReservationSlots');

db.genReservationSlots({
  restaurantId: 7,
  date: '03-17-18',
}).then((result) => {
  console.log(result)
  console.timeEnd('time for genReservationSlots');
  console.time('time for addReservation for an available slot');
  db.addReservation({
    restaurantId: 12000,
    date: '04-04-2018',
    time: 19,
    name: 'Vanessa',
    party: 2,
  }).then(() => {
    console.timeEnd('time for addReservation for an available slot');
    console.log('******************END INITIAL BENCHMARKS********************');
    db.client.end();
  });
});