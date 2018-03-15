const fs = require('fs');

let finalString = '';
let fileToImport = require('./data/reservationsJson1.js');

for (let i = 0; i < 10; i += 1) {
  let currentFileLength = fileToImport.length;
  for (let j = currentFileLength - 1; j >= 0; j -= 1) {
    let currentReservation = fileToImport.pop();
    finalString += currentReservation.id + ',' + currentReservation.restaurantid + ',' + currentReservation.date + ',' + 
    currentReservation.time + ',' + currentReservation.name + ',' + currentReservation.party + ',' + currentReservation.timestamp + '\n';
    if (j === 0) {
      console.log(`WRITING TO CSV FILE ./csv-data/reservationsAsCsv${i + 1}.csv`);
      fs.writeFileSync(`./csv-data/reservationsAsCsv${i + 1}.csv`, finalString);
    }
  }
  if (i === 9) {
    break;
  }
  fileToImport = require(`./data/reservationsJson${(i + 2)}.js`);
  finalString = '';
}
