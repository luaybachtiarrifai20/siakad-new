const { db } = require('./src/utils/database');

async function createTable() {
  try {
    console.log('Creating OtpStore table...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS OtpStore (
        email VARCHAR(255) PRIMARY KEY,
        otp VARCHAR(10) NOT NULL,
        expiresAt BIGINT NOT NULL,
        createdAt BIGINT NOT NULL,
        requestId VARCHAR(255) NOT NULL
      )
    `);
    console.log('✅ OtpStore table created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating table:', error);
    process.exit(1);
  }
}

createTable();
