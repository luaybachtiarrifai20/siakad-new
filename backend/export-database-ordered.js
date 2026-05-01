const mysql = require('mysql2');
const fs = require('fs');

async function exportDatabase() {
  const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3307,
    user: 'root',
    password: 'libraayra',
    database: 'vsagtmfw_siakad',
    multipleStatements: true
  });

  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        reject(err);
        return;
      }

      console.log('Connected to database, exporting...');
      
      // Define table creation order to avoid foreign key issues
      const tableOrder = [
        'User',           // 1. Users first (no foreign keys)
        'Fakultas',       // 2. Independent tables
        'Prodi',           // 3. Independent tables
        'Dosen',          // 4. References User
        'Mahasiswa',       // 5. References User, Prodi
        'MataKuliah',     // 6. References Prodi
        'Kelas',          // 7. References Dosen, MataKuliah
        'Jadwal',         // 8. References Kelas
        'TagihanUKT',     // 9. References Mahasiswa
        'Pembayaran',      // 10. References TagihanUKT
        'Krs',            // 11. References Mahasiswa, Kelas
        'Presensi'        // 12. References Kelas
      ];

      let sql = '';
      
      // Add header with disabled checks
      sql += '-- SIAKAD Database Export (Fixed Order)\n';
      sql += '-- Generated: ' + new Date().toISOString() + '\n';
      sql += 'SET FOREIGN_KEY_CHECKS = 0;\n';
      sql += 'SET UNIQUE_CHECKS = 0;\n';
      sql += 'SET AUTOCOMMIT = 0;\n\n';

      let completed = 0;
      
      for (const tableName of tableOrder) {
        try {
          // Check if table exists
          const tableExists = await new Promise((resolve, reject) => {
            connection.query(`SHOW TABLES LIKE '${tableName}'`, (err, result) => {
              if (err) reject(err);
              else resolve(result.length > 0);
            });
          });

          if (!tableExists) {
            console.log(`⚠️  Table ${tableName} not found, skipping...`);
            completed++;
            continue;
          }

          // Get table structure
          const createTableResult = await new Promise((resolve, reject) => {
            connection.query(`SHOW CREATE TABLE \`${tableName}\``, (err, result) => {
              if (err) reject(err);
              else resolve(result);
            });
          });

          sql += `-- Table structure for \`${tableName}\`\n`;
          sql += 'DROP TABLE IF EXISTS `' + tableName + '`;\n';
          sql += createTableResult[0]['Create Table'] + ';\n\n';

          // Get table data
          const rows = await new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM \`${tableName}\``, (err, result) => {
              if (err) reject(err);
              else resolve(result);
            });
          });

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
            
            fs.writeFileSync('siakad_database_export_ordered.sql', sql);
            console.log('\n✅ Database exported successfully to siakad_database_export_ordered.sql');
            connection.end();
            resolve();
          }
        } catch (error) {
          console.error(`❌ Error exporting table ${tableName}:`, error.message);
          completed++;
        }
      }
    });
  });
}

exportDatabase().catch(console.error);
