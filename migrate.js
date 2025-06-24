require('dotenv').config();
const db = require('./db');

const migrate = async () => {
  try {
    await db.pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(100) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Migration completed');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit();
  }
};

migrate();