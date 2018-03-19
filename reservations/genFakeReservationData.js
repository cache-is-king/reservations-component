const PD = require('probability-distributions');
const restaurants = require('../restaurants/data/output1');
const faker = require('faker');
const fs = require('fs');

// *********************randomize**************************

const numberReservations = PD.rpois(150, 15);
const getRandomBetween = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

// *********************************make fake data******************************************

const todayDate = '03-15-2018';
const oneMonthFromNow = '04-15-2018';
let allReservationsArray = [];
let allSlotsString = '';
let currSlotId = 0;
let currId = 0;

const addReservation = (i, date, time, partySize) => {
  allReservationsArray.push({
    id: currId,
    restaurantid: i,
    date,
    time,
    name: faker.name.firstName(),
    party: partySize,
    timestamp: '03-15-2018',
  }); 
};

for (let i = 0; i < 1000000; i += 1) {
  const existingReservations = {};
  const numberReservationsNeeded = numberReservations[getRandomBetween(0, 150)];
  let reservationCountTracker = 0;

  while (reservationCountTracker < numberReservationsNeeded) {
    let partySize = getRandomBetween(1, 11);
    let date = faker.date.between(todayDate, oneMonthFromNow);
    date = date.toISOString().slice(0, 10);
    let time = getRandomBetween(17, 23);

    existingReservations[[date, time]] = existingReservations[[date, time]] ?
      existingReservations[[date, time]] : restaurants[i].seats;

    if (partySize <= existingReservations[[date, time]]) {
      existingReservations[[date, time]] = existingReservations[[date, time]] - partySize;
      reservationCountTracker += 1;
      addReservation(i, date, time, partySize);
      currId += 1;
    }
  }

  if ((i + 1) % 100000 === 0) {
    console.log('CREATED RESERVATIONS FOR ', (i + 1), ' RESTAURANTS');
    const jsonString = 'module.exports = ' + JSON.stringify(allReservationsArray, null, 2);
    fs.writeFileSync(`./data/reservationsJson${(i + 1) / 100000}.js`, jsonString);
    allReservationsArray = [];
  }
}

