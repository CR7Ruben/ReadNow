import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { pool } from '../config/db.js';
import { generateToken } from '../middlewares/auth.middleware.js';

export const updateRole = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const { role, cardYear, cardNumber, cvv } = req.body;

    console.log('🔄 Actualizando rol de usuario:', { id_usuario, role });

    if (!['FREE', 'PREMIUM'].includes(role)) {
      console.log('❌ Rol inválido:', role);
      return res.status(400).json({ message: 'Rol inválido' });
    }

    const userResult = await pool.query(
      'SELECT * FROM usuarios WHERE id_usuario = $1',
      [id_usuario]
    );

    if (userResult.rows.length === 0) {
      console.log('❌ Usuario no encontrado:', id_usuario);
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const updateQuery = `
      UPDATE usuarios
      SET role = $1
      WHERE id_usuario = $2
      RETURNING id_usuario, nombre, correo, role
    `;

    const result = await pool.query(updateQuery, [role, id_usuario]);
    const updatedUser = result.rows[0];

    const newToken = generateToken(updatedUser);

    res.json({
      message: 'Rol actualizado exitosamente',
      user: updatedUser,
      token: newToken
    });
  } catch (error) {
    console.error('❌ Error actualizando rol:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

export const saveCardData = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const { cardNumber, cardYear } = req.body;

    const userResult = await pool.query(
      'SELECT * FROM usuarios WHERE id_usuario = $1 AND role = $2',
      [id_usuario, 'PREMIUM']
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario PREMIUM no encontrado' });
    }

    if (!cardNumber?.trim() || !cardYear?.trim()) {
      return res.status(400).json({ message: 'Datos de tarjeta incompletos' });
    }

    const lastFourDigits = cardNumber.trim().slice(-4);
    const maskedCardNumber = '**** **** **** ' + lastFourDigits;
    const encryptedCardYear = crypto.createHash('sha256').update(cardYear.trim()).digest('hex').substring(0, 64);

    const updateQuery = `
      UPDATE usuarios
      SET card_number_masked = $1,
          card_year_encrypted = $2
      WHERE id_usuario = $3
      RETURNING id_usuario, nombre, correo, card_number_masked
    `;

    const result = await pool.query(updateQuery, [
      maskedCardNumber,
      encryptedCardYear,
      id_usuario
    ]);

    res.json({
      message: 'Datos de tarjeta guardados exitosamente',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Error guardando datos de tarjeta:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id_usuario, nombre, correo, role FROM usuarios ORDER BY id_usuario');
    res.json({
      message: 'Usuarios encontrados',
      users: result.rows
    });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ message: 'Error obteniendo usuarios' });
  }
};
