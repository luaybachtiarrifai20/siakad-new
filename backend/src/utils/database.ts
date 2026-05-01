import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

const config: DatabaseConfig = {
  host: 'libraayra.my.id',
  port: 3306,
  user: 'vsagtmfw_user',
  password: 'libra2008',
  database: 'vsagtmfw_siakad'
};

class Database {
  private static instance: Database;
  private pool: mysql.Pool;

  private constructor() {
    this.pool = mysql.createPool({
      ...config,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async query(sql: string, params?: any[]): Promise<any> {
    try {
      const [rows] = await this.pool.execute(sql, params);
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  public async getConnection() {
    return await this.pool.getConnection();
  }

  public async close() {
    await this.pool.end();
  }
}

export const db = Database.getInstance();

// Helper functions untuk operasi umum
export const User = {
  async findByEmail(email: string) {
    const result = await db.query(
      'SELECT * FROM User WHERE email = ?',
      [email]
    );
    return result[0] || null;
  },

  async create(data: any) {
    const result = await db.query(
      'INSERT INTO User (id, email, password, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [data.id, data.email, data.password, data.role]
    );
    return result;
  },

  async update(id: string, data: any) {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    values.push(id);
    
    await db.query(
      `UPDATE User SET ${fields} WHERE id = ?`,
      values
    );
  }
};

export const Mahasiswa = {
  async findByUserId(userId: string) {
    const result = await db.query(
      'SELECT * FROM Mahasiswa WHERE userId = ?',
      [userId]
    );
    return result[0] || null;
  },

  async create(data: any) {
    const result = await db.query(
      'INSERT INTO Mahasiswa (id, userId, nim, nama, prodiId, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [data.id, data.userId, data.nim, data.nama, data.prodiId]
    );
    return result;
  }
};

export const Dosen = {
  async findByUserId(userId: string) {
    const result = await db.query(
      'SELECT * FROM Dosen WHERE userId = ?',
      [userId]
    );
    return result[0] || null;
  },

  async create(data: any) {
    const result = await db.query(
      'INSERT INTO Dosen (id, userId, nidn, nama, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())',
      [data.id, data.userId, data.nidn, data.nama]
    );
    return result;
  }
};
