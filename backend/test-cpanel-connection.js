const mysql = require('mysql2');

// Test berbagai kemungkinan konfigurasi database
const configs = [
  {
    name: "Current Config",
    config: {
      host: 'libraayra.my.id',
      port: 3306,
      user: 'vsagtmfw_luay',
      password: 'Luay2008_',
      database: 'vsagtmfw_siakad'
    }
  },
  {
    name: "Alternative Password 1",
    config: {
      host: 'libraayra.my.id',
      port: 3306,
      user: 'vsagtmfw_luay',
      password: 'Luay2008',
      database: 'vsagtmfw_siakad'
    }
  },
  {
    name: "Alternative Password 2",
    config: {
      host: 'libraayra.my.id',
      port: 3306,
      user: 'vsagtmfw_luay',
      password: 'Luay2008',
      database: 'vsagtmfw_siakad'
    }
  },
  {
    name: "With Localhost",
    config: {
      host: 'localhost',
      port: 3306,
      user: 'vsagtmfw_luay',
      password: 'Luay2008_',
      database: 'vsagtmfw_siakad'
    }
  },
  {
    name: "With IP Address",
    config: {
      host: '127.0.0.1',
      port: 3306,
      user: 'vsagtmfw_luay',
      password: 'Luay2008_',
      database: 'vsagtmfw_siakad'
    }
  }
];

async function testConnections() {
  console.log('🔍 Testing Database Connection Configurations...\n');
  
  for (const { name, config } of configs) {
    console.log(`\n=== Testing: ${name} ===`);
    
    try {
      const connection = mysql.createConnection(config);
      
      await new Promise((resolve, reject) => {
        connection.connect((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
      
      console.log('✅ Connection successful!');
      
      // Test simple query
      await new Promise((resolve, reject) => {
        connection.query('SELECT COUNT(*) as count FROM User', (err, results) => {
          if (err) {
            reject(err);
          } else {
            console.log(`✅ Query successful! Found ${results[0].count} users`);
            resolve();
          }
        });
      });
      
      connection.end();
      
    } catch (error) {
      console.log('❌ Connection failed:', error.message);
      console.log('   Error Code:', error.code || 'Unknown');
      console.log('   Error Number:', error.errno || 'Unknown');
    }
  }
}

testConnections().then(() => {
  console.log('\n🎯 Recommendations:');
  console.log('1. If any config works, update your .env file');
  console.log('2. Check cPanel MySQL user permissions');
  console.log('3. Verify database exists in cPanel');
  console.log('4. Ensure user has ALL PRIVILEGES');
}).catch(console.error);
