const PD = require('probability-distributions');
const restaurants = require('../restaurants/data/output1')
const faker = require('faker');
const fs = require('fs');

// *********************randomize**************************

const numberReservations = PD.rpois(150, 15);
const getRandomBetween = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
const monthDictionary = {
  Jan: '01',
  Feb: '02',
  Mar: '03',
  Apr: '04',
  May: '05',
  Jun: '06',
  Jul: '07',
  Aug: '08',
  Sep: '09',
  Oct: '10',
  Nov: '11',
  Dec: '12',
}

// ******************make fake data***********************

let finalDataArray = [];
let currId = 0;

for (let i = 0; i < 1000000; i += 1) {
  let existingReservations = {};

  const numberReservationsNeeded = numberReservations[getRandomBetween(0, 150)]
  let reservationCountTracker = 0;
  while (reservationCountTracker < numberReservationsNeeded) {
    let partySize = getRandomBetween(1, 11);
    let date = faker.date.between('03-14-2018', '06-15-2018')
    date = date.toString().slice(4, 15).split(' ')
    date[0] = monthDictionary[date[0]]
    date = date.join('-')
    let time = getRandomBetween(17, 23);

    if (existingReservations[[date, time]] === undefined) {
      existingReservations[[date, time]] = restaurants[i].seats - partySize;
      reservationCountTracker += 1
      finalDataArray.push({
        id: currId,
        restaurant_id: i,
        date,
        time,
        name: faker.name.firstName(),
        party: partySize,
      })
      currId += 1
    }
    else if (partySize < restaurants[i].seats) {
      existingReservations[[date, time]] = existingReservations[[date, time]] - partySize;
      reservationCountTracker += 1
      finalDataArray.push({
        id: currId,
        restaurant_id: i,
        date,
        time,
        name: faker.name.firstName(),
        party: partySize,
      })
      currId += 1
    }
  }
  if ((i + 1) % 100000 === 0) {
    console.log('CREATED RESERVATIONS FOR ', (i + 1), ' RESTAURANTS');
    const jsonString = JSON.stringify(finalDataArray, null, 2);
    fs.writeFileSync(`./data/reservationsJson${(i + 1) / 100000}.js`, jsonString);
    finalDataArray = [];
  }
}

