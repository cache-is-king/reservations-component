// MOVE ALL THIS TO ANOTHER FILE

/*
const fs = require('fs');
const { Client } = require('pg');

const pgClient = new Client({
  host: process.env.RDS_HOSTNAME || 'localhost',
  user: process.env.RDS_USERNAME || '',
  password: process.env.RDS_PASSWORD || '',
  database: process.env.RDS_DB_NAME || 'restaurant_reservations',
  port: process.env.RDS_PORT || 5432
});

pgClient.connect();

const db = pgClient;

*/



let finalString = '';
let fileToImport = require('./data/output1.js');

for (let i = 0; i < 10; i += 1) {
  for (let j = 0; j < fileToImport.length; j += 1) {
    finalString += fileToImport[j].id + ',' + fileToImport[j].name + ',' + fileToImport[j].seats + '\n';
    if ((j + 1) % 100000 === 0) {
      console.log('GOT ' + (j + 1) + ' AND WRITING TO FILE ' + (i + 1));
      fs.writeFileSync(`./csv-data/outputAsCsv${i + 1}.csv`, finalString);        
    }

  }
  fileToImport = require(`./data/output${(i + 2)}.js`);  
  finalString = '';
}

db.end()

// ~~~~~~~~~~~~~~~~~~~~~~~~ MIGRATE ~~~~~~~~~~~~~~~~~~~~~~~~~
