import bcrypt from 'bcrypt';
import { pool } from '../config/db.js';

export const checkUsuarios = async (req, res) => {
  try {
    const tableExistsQuery = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'usuarios'
    `;
    const tableResult = await pool.query(tableExistsQuery);

    if (tableResult.rows.length === 0) {
      return res.json({ message: 'La tabla usuarios no existe', exists: false });
    }

    const columnsQuery = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'usuarios' AND table_schema = 'public'
      ORDER BY ordinal_position
    `;
    const columnsResult = await pool.query(columnsQuery);

    const sampleQuery = `SELECT * FROM usuarios LIMIT 3`;
    const sampleResult = await pool.query(sampleQuery);

    res.json({
      exists: true,
      columns: columnsResult.rows,
      sampleData: sampleResult.rows
    });
  } catch (error) {
    res.status(500).json({ message: 'Error verificando tabla usuarios', error: error.message });
  }
};

export const migratePasswords = async (req, res) => {
  try {
    const usersResult = await pool.query('SELECT id_usuario, correo, password FROM usuarios');
    let migratedCount = 0;
    let alreadyEncryptedCount = 0;

    for (const user of usersResult.rows) {
      if (user.password.startsWith('$2b$')) {
        alreadyEncryptedCount++;
        continue;
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);
      await pool.query(
        'UPDATE usuarios SET password = $1 WHERE id_usuario = $2',
        [hashedPassword, user.id_usuario]
      );
      migratedCount++;
    }

    res.json({
      message: 'Migración completada',
      totalUsers: usersResult.rows.length,
      migratedPasswords: migratedCount,
      alreadyEncrypted: alreadyEncryptedCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en migración', error: error.message });
  }
};

export const verifyDb = async (req, res) => {
  try {
    const tablesQuery = `
      SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'
    `;
    const tablesResult = await pool.query(tablesQuery);
    const existingTables = tablesResult.rows.map(row => row.table_name);

    if (!existingTables.includes('libros_lectura')) {
      await pool.query(`
        CREATE TABLE libros_lectura (
          id SERIAL PRIMARY KEY,
          id_usuario INTEGER REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
          id_libro VARCHAR(50) NOT NULL,
          fecha_lectura TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }

    if (!existingTables.includes('suscripciones')) {
      await pool.query(`
        CREATE TABLE suscripciones (
          id SERIAL PRIMARY KEY,
          id_usuario INTEGER REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
          tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('FREE', 'PREMIUM')),
          fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          fecha_fin TIMESTAMP,
          activa BOOLEAN DEFAULT true
        )
      `);
    }

    res.json({
      message: 'Base de datos verificada',
      existingTables
    });
  } catch (error) {
    res.status(500).json({ message: 'Error verificando base de datos', error: error.message });
  }
};

export const checkCardColumns = async (req, res) => {
  try {
    await pool.query(`
      ALTER TABLE usuarios
      ADD COLUMN IF NOT EXISTS card_number_masked VARCHAR(255),
      ADD COLUMN IF NOT EXISTS card_year_encrypted VARCHAR(255),
      ADD COLUMN IF NOT EXISTS card_cvv VARCHAR(255)
    `);
    res.json({ message: 'Columnas verificadas' });
  } catch (error) {
    res.status(500).json({ message: 'Error verificando columnas', error: error.message });
  }
};

export const createLecturaTable = async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS lectura_usuario (
        id SERIAL PRIMARY KEY,
        id_usuario INTEGER NOT NULL,
        id_libro VARCHAR(50) NOT NULL,
        fecha_lectura DATE NOT NULL DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_lectura_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
        CONSTRAINT unique_lectura UNIQUE (id_usuario, id_libro)
      )
    `);
    res.json({ message: 'Tabla lectura_usuario creada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error creando tabla', error: error.message });
  }
};
