const mysql = require('mysql2');
const fs = require('fs');

function exportDatabase() {
  const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3307,
    user: 'root',
    password: 'libraayra',
    database: 'vsagtmfw_siakad',
    multipleStatements: true
  });

  connection.connect((err) => {
    if (err) {
      console.error('Connection failed:', err.message);
      return;
    }

    console.log('Connected to database, exporting...');
    
    // Define table order to avoid foreign key issues
    const tableOrder = [
      'User', 'Fakultas', 'Prodi', 'Dosen', 'Mahasiswa', 
      'MataKuliah', 'Kelas', 'Jadwal', 'TagihanUKT', 
      'Pembayaran', 'Krs', 'Presensi'
    ];

    let sql = '';
    
    // Add header with disabled checks
    sql += '-- SIAKAD Database Export (Fixed Order)\n';
    sql += '-- Generated: ' + new Date().toISOString() + '\n';
    sql += 'SET FOREIGN_KEY_CHECKS = 0;\n';
    sql += 'SET UNIQUE_CHECKS = 0;\n';
    sql += 'SET AUTOCOMMIT = 0;\n\n';

    let completed = 0;
    
    function processTable(tableName) {
      connection.query(`SHOW TABLES LIKE '${tableName}'`, (err, result) => {
        if (err) {
          console.error(`Error checking table ${tableName}:`, err.message);
          completed++;
          return;
        }

        if (result.length === 0) {
          console.log(`⚠️  Table ${tableName} not found, skipping...`);
          completed++;
          return;
        }

        // Get table structure
        connection.query(`SHOW CREATE TABLE \`${tableName}\``, (err, createResult) => {
          if (err) {
            console.error(`Error getting structure for ${tableName}:`, err.message);
            completed++;
            return;
          }

          sql += `-- Table structure for \`${tableName}\`\n`;
          sql += 'DROP TABLE IF EXISTS `' + tableName + '`;\n';
          sql += createResult[0]['Create Table'] + ';\n\n';

          // Get table data
          connection.query(`SELECT * FROM \`${tableName}\``, (err, rows) => {
            if (err) {
              console.error(`Error getting data for ${tableName}:`, err.message);
              completed++;
              return;
            }

            if (rows.length > 0) {
              sql += `-- Data for table \`${tableName}\`\n`;
              sql += `INSERT INTO \`${tableName}\` VALUES `;

              rows.forEach((row, index) => {
                const values = Object.values(row).map(val => {
                  if (val === null) return 'NULL';
                  if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
                  if (val instanceof Date) return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`;
                  return val;
                });

                sql += '(' + values.join(', ') + ')';
                if (index < rows.length - 1) sql += ',';
                else sql += ';\n\n';
              });
            }

            completed++;
            console.log(`✅ Exported table ${completed}/${tableOrder.length}: ${tableName}`);

            if (completed === tableOrder.length) {
              sql += 'SET UNIQUE_CHECKS = 1;\n';
              sql += 'SET FOREIGN_KEY_CHECKS = 1;\n';
              sql += 'COMMIT;\n';
              
              fs.writeFileSync('siakad_database_export_final.sql', sql);
              console.log('\n✅ Database exported successfully to siakad_database_export_final.sql');
              connection.end();
            }
          });
        });
      });
    }

    // Process tables in order
    tableOrder.forEach(tableName => {
      processTable(tableName);
    });
  });
}

exportDatabase();
