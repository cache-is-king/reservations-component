const PD = require('probability-distributions');
const faker = require('faker');
const fs = require('fs');


// make arrays for reservation Size and # reservations distributions
const reservationSizes = PD.rpois(1000, 30);
const numberReservations = PD.rpois(150, 15);
const todayDate = '03-19-2018';
const oneMonthFromNow = '04-19-2018';

// helper functions for restaurant name generation
const capitalize = (str) => {
  const words = str.split(' ');
  const output = words.map((word) => {
    if (word) {
      const newWord = word.toLowerCase();
      return newWord[0].toUpperCase() + newWord.slice(1);
    }
  })
    .join(' ');
  return output;
};

const shuffleString = (string) => {
  const stringArray = string.split('');
  const characterNumber = stringArray.length;

  for (let i = characterNumber - 1; i > 0; i -= 1) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = stringArray[i];
    stringArray[i] = stringArray[j];
    stringArray[j] = temp;
  }
  return stringArray.join('');
};

const getRandomBetween = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const genRestName = (iteration) => {


  const randomFn = {
    0: () => {
      return shuffleString(faker.hacker.verb()) + shuffleString(faker.hacker.noun().slice(0, 5))
    },
    1: () => {
      return 'The ' + shuffleString(faker.lorem.word())
    },
    2: () => {
      return shuffleString(faker.lorem.word()) + ' & ' + shuffleString(faker.lorem.word().slice(0, 5));
    },
    3: () => {
      return shuffleString(faker.name.firstName()) + '\'s ' + shuffleString(faker.lorem.words(1 + Math.floor(2 * Math.random())));
    },
    4: () => {
      return shuffleString(faker.commerce.productAdjective()) + ' ' + shuffleString(faker.lorem.words(1 + Math.floor(2 * Math.random())));
    },
    5: () => {
      return shuffleString(faker.company.bsAdjective())
    },
    6: () => {
      return shuffleString(faker.lorem.word()) + ' of ' + shuffleString(faker.address.city())
    },
    7: () => {
      return shuffleString(faker.lorem.word().slice(0, 6)) + ' by ' + shuffleString(faker.lorem.word())
    },
    8: () => {
      return shuffleString(faker.company.bsBuzz()) + ' on ' + shuffleString(faker.company.bsNoun())
    },
    9: () => {
      return shuffleString(faker.company.bs()) + ' for ' + shuffleString(faker.lorem.word()) + 's.'
    },
  };

  return randomFn[iteration]();
};

const genReservationsForRestaurant = (numberOfReservations, startingReservationIndex, maxSeats) => {
  //this returns an array of reservations.
  const outputArray = [];
  const existingReservations = {};
  let reservationCountTracker = 0;
  let currentReservationIndex = startingReservationIndex;

  while (reservationCountTracker < numberOfReservations) {
    let partySize = getRandomBetween(1, 11);
    let date = faker.date.between(todayDate, oneMonthFromNow);
    date = date.toISOString().slice(0, 10);
    let time = getRandomBetween(17, 23);

    existingReservations[[date, time]] = existingReservations[[date, time]] ?
      existingReservations[[date, time]] : maxSeats;

    if (partySize <= existingReservations[[date, time]]) {
      existingReservations[[date, time]] = existingReservations[[date, time]] - partySize;
      outputArray.push({
        id: currentReservationIndex,
        date,
        time,
        name: faker.name.firstName(),
        party: partySize,
        timestamp: todayDate,
      });
      reservationCountTracker += 1;
      currentReservationIndex += 1;
    }
  }

  return outputArray;
};
// since map lengths will be different, we will have to keep track of the starting restaurant index
let reservationIndex = 0;

// this generates 10 million restaurants. In this, the first 1 million should get reservations.
for (let i = 0; i < 10; i += 1) {
  const output = {};
  let duplicateTracker = 0;
  for (let j = 0; j < 5000000; j += 1) {
    const restName = capitalize(genRestName(i));
    if (j % 1000000 === 0) {
      console.log('GOT ', j);
      console.log('UNIQUE: ', j - duplicateTracker);
    }
    if (output[restName]) {
      duplicateTracker += 1;
    }
    if (j - duplicateTracker === 1000000) {
      console.log('hi');
      break;
    }
    output[restName] = true;
  }

  // if restaurant < 1000000, we want to write 10 files since after adding reservations, it will be too large.
  if (i === 0) {
    for (let j = 0; j < 20; j += 1) {
      console.log('J ', j);
      
      const toFile = Object.keys(output).slice(j * 50000, (j + 1) * 50000).map((output, index) => {
        const requiredReservations = numberReservations[getRandomBetween(0, 150)];
        let startingIndex = reservationIndex
        reservationIndex += requiredReservations;
        const seats = reservationSizes[getRandomBetween(0, 1000)]
        return {
          id: (j * 50000) + index,
          name: output,
          seats,
          reservations: genReservationsForRestaurant(requiredReservations, startingIndex, seats),
        };
      });
      
      const jsonString = JSON.stringify(toFile, null, 2);
      fs.writeFileSync(`./data/restaurantsWithReservations/output${j + 1}.js`, jsonString);
    }
  } else {
    const toFile = Object.keys(output).map((output, index) => {
      return {
        id: ((i * 1000000) + index),
        name: output,
        seats: reservationSizes[getRandomBetween(0, 1000)],
        reservations: [],
      };
    });
    const jsonString = JSON.stringify(toFile, null, 2);

    fs.writeFileSync(`./data/restaurantsNoReservations/output${i}.js`, jsonString);
  }

}
