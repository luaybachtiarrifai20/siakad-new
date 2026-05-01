const mysql = require("mysql2");
const fs = require("fs");

async function exportDatabase() {
  const connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3307,
    user: "root",
    password: "libraayra",
    database: "vsagtmfw_siakad",
    multipleStatements: true,
  });

  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        reject(err);
        return;
      }

      console.log("Connected to database, exporting...");

      // Get all tables
      connection.query("SHOW TABLES", async (err, tables) => {
        if (err) {
          reject(err);
          return;
        }

        const tableNames = tables.map((t) => Object.values(t)[0]);
        let sql = "";

        // Add header
        sql += "-- SIAKAD Database Export\n";
        sql += "-- Generated: " + new Date().toISOString() + "\n";
        sql += "SET FOREIGN_KEY_CHECKS = 0;\n";
        sql += "SET UNIQUE_CHECKS = 0;\n";
        sql += "SET AUTOCOMMIT = 0;\n\n";

        let completed = 0;

        for (const tableName of tableNames) {
          try {
            // Get table structure
            const createTableResult = await new Promise((resolve, reject) => {
              connection.query(
                `SHOW CREATE TABLE \`${tableName}\``,
                (err, result) => {
                  if (err) reject(err);
                  else resolve(result);
                },
              );
            });

            sql += `-- Table structure for \`${tableName}\`\n`;
            sql += "DROP TABLE IF EXISTS `" + tableName + "`;\n";
            sql += createTableResult[0]["Create Table"] + ";\n\n";

            // Get table data
            const rows = await new Promise((resolve, reject) => {
              connection.query(
                `SELECT * FROM \`${tableName}\``,
                (err, result) => {
                  if (err) reject(err);
                  else resolve(result);
                },
              );
            });

            if (rows.length > 0) {
              sql += `-- Data for table \`${tableName}\`\n`;
              sql += `INSERT INTO \`${tableName}\` VALUES `;

              rows.forEach((row, index) => {
                const values = Object.values(row).map((val) => {
                  if (val === null) return "NULL";
                  if (typeof val === "string")
                    return `'${val.replace(/'/g, "''")}'`;
                  if (val instanceof Date)
                    return `'${val.toISOString().slice(0, 19).replace("T", " ")}'`;
                  return val;
                });

                sql += "(" + values.join(", ") + ")";
                if (index < rows.length - 1) sql += ",";
                else sql += ";\n\n";
              });
            }

            completed++;
            console.log(
              `Exported table ${completed}/${tableNames.length}: ${tableName}`,
            );

            if (completed === tableNames.length) {
              sql += "SET UNIQUE_CHECKS = 1;\n";
              sql += "SET FOREIGN_KEY_CHECKS = 1;\n";
              sql += "COMMIT;\n";

              fs.writeFileSync("siakad_database_export_fixed.sql", sql);
              console.log(
                "\n✅ Database exported successfully to siakad_database_export_fixed.sql",
              );
              connection.end();
              resolve();
            }
          } catch (error) {
            console.error(`Error exporting table ${tableName}:`, error.message);
            completed++;
          }
        }
      });
    });
  });
}

exportDatabase().catch(console.error);
