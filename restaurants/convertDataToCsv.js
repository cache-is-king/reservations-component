const fs = require('fs');

let finalString = '';
let fileToImport = require('./data/output1.js');

for (let i = 0; i < 10; i += 1) {
  const currentFileLength = fileToImport.length;
  for (let j = currentFileLength - 1; j >= 0; j -= 1) {
    const currentRestaurant = fileToImport.pop();
    finalString += `${currentRestaurant.id},${currentRestaurant.name},${currentRestaurant.seats}\n`;
    if (j === 0) {
      console.log(`WRITING TO CSV FILE ./csv-data/outputAsCsv${i + 1}.csv`);
      fs.writeFileSync(`./csv-data/outputAsCsv${i + 1}.csv`, finalString);
    }
  }
  if (i === 9) {
    break;
  }
  fileToImport = require(`./data/output${(i + 2)}.js`);
  console.log(`working on file ${(i + 2)}`);
  finalString = '';
}
