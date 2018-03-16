const PD = require('probability-distributions');
const faker = require('faker');
const fs = require('fs');


// make a reservationSize array for reservation Size distribution
const reservationSizes = PD.rpois(1000, 30);

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

  const toFile = Object.keys(output).map(
    (output, index) => {
      return { id: (i * 1000000) + index, name: output, seats: reservationSizes[getRandomBetween(0, 1000)] };
    });

  const jsonString = JSON.stringify(toFile, null, 2);

  console.log(`writing to file ${i + 1}`)
  fs.writeFileSync(`./data/output${i + 1}.js`, `module.exports = ${jsonString}`)
}
