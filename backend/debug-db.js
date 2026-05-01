// Test connection dengan berbagai konfigurasi
const configs = [
  {
    name: "Basic Connection",
    config: {
      host: 'libraayra.my.id',
      port: 3306,
      user: 'vsagtmfw_luay',
      password: 'Luay2008_',
      database: 'vsagtmfw_siakad'
    }
  },
  {
    name: "With SSL Disabled",
    config: {
      host: 'libraayra.my.id',
      port: 3306,
      user: 'vsagtmfw_luay',
      password: 'Luay2008_',
      database: 'vsagtmfw_siakad',
      ssl: false
    }
  },
  {
    name: "With MySQL Native Password",
    config: {
      host: 'libraayra.my.id',
      port: 3306,
      user: 'vsagtmfw_luay',
      password: 'Luay2008_',
      database: 'vsagtmfw_siakad',
      authPlugins: {
        mysql_native_password: () => () => Buffer.from('Luay2008_')
      }
    }
  }
];

async function testConnections() {
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
      
      // Test query
      await new Promise((resolve, reject) => {
        connection.query('SELECT 1 as test', (err, results) => {
          if (err) {
            reject(err);
          } else {
            console.log('✅ Query successful:', results);
            resolve();
          }
        });
      });
      
      connection.end();
      
    } catch (error) {
      console.log('❌ Connection failed:', error.message);
    }
  }
}

testConnections();
