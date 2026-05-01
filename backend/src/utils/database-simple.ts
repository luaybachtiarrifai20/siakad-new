import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const config = {
  host: "libraayra.my.id",
  port: 3306,
  user: "vsagtmfw_user",
  password: "libra2008",
  database: "vsagtmfw_siakad",
};

const pool = mysql.createPool({
  ...config,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function query(sql: string, params?: any[]): Promise<any> {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

export async function getConnection() {
  return await pool.getConnection();
}

export async function close() {
  await pool.end();
}

// Test connection
export async function testConnection() {
  try {
    const result = await query("SELECT 1 as test");
    console.log("✅ Database connection successful!");
    return true;
  } catch (error: any) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
}

// User operations
export const User = {
  async findByEmail(email: string) {
    const result = await query("SELECT * FROM User WHERE email = ?", [email]);
    return result[0] || null;
  },

  async create(data: any) {
    const result = await query(
      "INSERT INTO User (id, email, password, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())",
      [data.id, data.email, data.password, data.role],
    );
    return result;
  },

  async update(id: string, data: any) {
    const fields = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(data);
    values.push(id);

    await query(`UPDATE User SET ${fields} WHERE id = ?`, values);
  },
};

// Mahasiswa operations
export const Mahasiswa = {
  async findByUserId(userId: string) {
    const result = await query("SELECT * FROM Mahasiswa WHERE userId = ?", [
      userId,
    ]);
    return result[0] || null;
  },

  async create(data: any) {
    const result = await query(
      "INSERT INTO Mahasiswa (id, userId, nim, nama, prodiId, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())",
      [data.id, data.userId, data.nim, data.nama, data.prodiId],
    );
    return result;
  },
};

// Dosen operations
export const Dosen = {
  async findByUserId(userId: string) {
    const result = await query("SELECT * FROM Dosen WHERE userId = ?", [
      userId,
    ]);
    return result[0] || null;
  },

  async create(data: any) {
    const result = await query(
      "INSERT INTO Dosen (id, userId, nidn, nama, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())",
      [data.id, data.userId, data.nidn, data.nama],
    );
    return result;
  },
};
