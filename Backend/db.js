import pkg from 'pg'; 
const { Client } = pkg;  

import dotenv from 'dotenv';
dotenv.config();

let db;

// Production (Database Deployed on Supabase)
if (process.env.DATABASE_URL) {
  db = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Supabase requires SSL
    },
  });
} else {

// Local pgadmin postgresql database
// Set up PostgreSQL connection
db = new Client({
  host: 'localhost',
  user: 'postgres',
  database: 'kyotoventure',
  password: process.env.LOCAL_DB_PASSWORD,
  port: 5432,
});
}

// Connect to PostgreSQL
db.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

export default db;
