const moment = require('moment-timezone');

require('dotenv').config();
const { Client } = require('pg');

// clients will also use environment variables
// for connection information
const client = new Client({
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  host: process.env.RDS_HOSTNAME,
  database: process.env.RDS_DB_NAME || 'restaurant_reservations',
  port: process.env.RDS_PORT,
});

client.connect();

client.on('end', () => {
  console.log('pg client end');
});

client.on('error', (error) => {
  console.error('pg client error', error);
});


const bookingsToday = (restaurantId) => {
  const todayStr = moment(new Date()).tz('America/Los_Angeles').format('YYYY-MM-DD');

  return client.query(
    'SELECT COUNT(id) FROM reservations WHERE restaurantid=$1 AND timestamp=$2',
    [restaurantId, todayStr],
  );
};

// const getOpenSeats = ({
//   restaurantId, date,
// }) => client.query(
//   'SELECT time,(MAX(restaurants.seats)-SUM(party)) AS remaining FROM reservations INNER JOIN restaurants ON restaurants.id = reservations.restaurantid WHERE date=$1 AND restaurantid=$2 GROUP BY time',
//   [date, restaurantId],
// );

const newGetOpenSeats = ({
  restaurantId, date,
}) => client.query(
  'SELECT time,seats_remaining AS remaining FROM slots WHERE date=$1 AND restaurantid=$2',
  [date, restaurantId],
);


const getMaxSeats = restaurantId => client.query(
  'SELECT seats FROM restaurants WHERE id=$1',
  [restaurantId],
);


const genReservationSlots = ({ restaurantId, date }) => Promise.all([
  bookingsToday(restaurantId),
  newGetOpenSeats({ restaurantId, date }),
  getMaxSeats(restaurantId),
])
  .then((results) => {
    // results[0] has the # bookings made info
    // results[1] has the timeslot & remaining seats info
    // results[2] has the max seats for the restaurant

    // create default reservations array with default values
    const returnedSlots = results[1].rows.map(row => ({
      time: row.time,
      remaining: Number(row.remaining),
    }));

    // if a reservation slot is not in the results, make a default one with
    // max seating availability
    const returnedTimes = results[1].rows.map(slot => slot.time);
    for (let i = 17; i < 22; i += 1) {
      if (!returnedTimes.includes(i)) {
        returnedSlots.push({ time: i, remaining: results[2].rows[0].seats });
      }
    }

    // sort returnedSlots
    returnedSlots.sort((a, b) => (a.time - b.time));

    const output = {
      madeToday: Number(results[0].rows[0].count),
      reservations: returnedSlots,
    };
    return output;
  });


const addReservation = ({
  restaurantId, date, time, name, party,
}) => genReservationSlots({ restaurantId, date })
  .then((slots) => {
    const requestedSlot = slots.reservations.find(item => item.time === time);

    // check max Seats
    if (requestedSlot.remaining >= party) {
      return client.query(
        'INSERT INTO reservations (restaurantid, date, time, name, party) VALUES ($1,$2,$3,$4,$5)',
        [restaurantId, date, time, name, party], (err, data) => {
          if (err) {
            console.log(err);
          } else {
            updateSlots({ restaurantId, time, date, party })
          }
        }
      );
    }
    // console.log('genReservationSlots throws error');
    throw new Error('Restaurant cannot take a party of that size!');
  });

const updateSlots = ({
  restaurantId, time, date, party,
}) => client.query(
  'SELECT id,seats_remaining AS remaining FROM slots WHERE restaurantid = ($1) AND time = ($2) AND date = ($3)',
  [restaurantId, time, date], (err, data) => {
    if (err) {
      console.log(err)
    } else {
      const slot = data.rows[0]
      console.log(slot)
      if (slot) {
        updateSingleSlot({ slotId: slot.id, seatsRemaining: slot.remaining - party });
      }
      else {
        console.log('we are going to add a slot')
        addSlot({date, time, restaurantId, party})
      }
    }
  })

const addSlot = ({
  date, time, restaurantId, party
}) => client.query(
  'SELECT seats FROM restaurants WHERE id = ($1)', [restaurantId], (err, data) => {
    if (err) {
      console.log(err)
    } else {
      client.query('INSERT INTO slots (date, time, restaurantid, seats_remaining) VALUES ($1,$2,$3,$4)',
        [date, time, restaurantId, data.rows[0].seats - party], (err, data) => {
          if (err) {
            console.log(err)
          } else {
            console.log('new slot created!')
          }
        }
      );
    }
  });

const updateSingleSlot = ({
  slotId, seatsRemaining
}) => client.query(
  'UPDATE slots SET seats_remaining = ($1) WHERE id = ($2)',
  [seatsRemaining, slotId],
);

const addRestaurantInfo = ({
  id, name, seats,
}) => client.query(
  'INSERT INTO restaurants (id,name,seats) VALUES ($1,$2,$3)',
  [id, name, seats],
);

module.exports = {
  client,
  bookingsToday,
  getMaxSeats,
  genReservationSlots,
  addReservation,
  addRestaurantInfo,
  newGetOpenSeats,
  addSlot,
  updateSingleSlot,
};
