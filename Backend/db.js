import pkg from 'pg'; 
const { Client } = pkg;  

import dotenv from 'dotenv';
dotenv.config();

let db;

// Production (Database Deployed on Supabase)
if (process.env.NODE_ENV === 'production') {
  console.log("Connecting to remote database on Supabase");

  // Use either DATABASE_URL or connection details for Supabase Pooler
  if (process.env.DATABASE_URL) {
    // Option 1: full connection string (if using IPv4 add-on)
    db = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false, 
      },
    });
  } else {
    // Option 2: Supabase Shared Pooler (the free option thats IPv4 comaptible since option one needs payment for the IPv4 compatible add-on)
    db = new Client({
      host: process.env.SUPABASE_DB_HOST,        
      user: process.env.SUPABASE_DB_USER,        
      password: process.env.SUPABASE_DB_PASSWORD,
      database: process.env.SUPABASE_DB_NAME,   
      port: process.env.SUPABASE_DB_PORT || 6543, 
      ssl: {
        rejectUnauthorized: false, 
      },
    });
  }
} else {
  console.log("Connecting to local database");

  // Local pgadmin PostgreSQL database
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
      host: process.env.DATABASE_URL ? 'From connection string' : process.env.SUPABASE_DB_HOST || 'localhost'
    });
  });

export default db;
