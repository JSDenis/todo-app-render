const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const connect = async () => {
  try {
    await pool.connect();
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Database connection error:', err);
    throw err;
  }
};

module.exports = {
  pool,
  connect
};