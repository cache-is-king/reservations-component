
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

//db.end()

// ~~~~~~~~~~~~~~~~~~~~~~~~ MIGRATE ~~~~~~~~~~~~~~~~~~~~~~~~~
