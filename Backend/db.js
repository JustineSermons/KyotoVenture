import pkg from 'pg'; 
const { Client } = pkg;  

import dotenv from 'dotenv';
dotenv.config();

let db;

// Production (Database Deployed on Supabase)
if (process.env.DATABASE_URL) {
  console.log("Connecting to remote database on Supabase")
  db = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Supabase requires SSL
    },
  });
} else {
console.log("Connecting to local database")
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
  .catch(err => {
    console.error('Database connection error:', err.stack);
    console.error('Connection details:', {
      usingEnvUrl: !!process.env.DATABASE_URL,
      host: process.env.DATABASE_URL ? 'From connection string' : 'localhost'
    });
  });
  
export default db;
