const db = require('../server/db/index.js');

console.time('time to generate open seats for a restaurant and date')
db.client.query('SELECT time, seats_remaining FROM slots WHERE restaurantid = $1 AND date = $2', [569843, '04-04-2018'], (err, data) => {
  if (err) {
    console.log(err)
  } else {
    console.log(data.rows)
    console.timeEnd('time to generate open seats for a restaurant and date')
    db.client.end()
  }
})