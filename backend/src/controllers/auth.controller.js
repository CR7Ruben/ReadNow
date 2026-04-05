import bcrypt from 'bcrypt';
import { pool } from '../config/db.js';
import { generateToken } from '../middlewares/auth.middleware.js';

export const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM usuarios WHERE correo = $1',
      [correo]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    console.log('✅ Login exitoso');

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        correo: user.correo,
        role: user.role,
        fecha_creacion: user.fecha_creacion
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const register = async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    console.log('📝 Intentando registrar nuevo usuario');

    if (!nombre || !correo || !password) {
      return res.status(400).json({
        message: 'Faltan campos requeridos: nombre, correo y password'
      });
    }

    const existingUser = await pool.query(
      'SELECT * FROM usuarios WHERE correo = $1',
      [correo]
    );

    if (existingUser.rows.length > 0) {
      console.log('⚠️ Usuario ya existe');
      return res.status(400).json({ message: 'Usuario ya existe' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('🔐 Contraseña encriptada correctamente');

    const insertQuery = `
      INSERT INTO usuarios (nombre, correo, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id_usuario, nombre, correo, role
    `;

    const result = await pool.query(insertQuery, [
      nombre,
      correo,
      hashedPassword,
      'FREE'
    ]);

    const newUser = result.rows[0];
    console.log('✅ Usuario creado');

    res.json({
      id_usuario: newUser.id_usuario,
      nombre: newUser.nombre,
      correo: newUser.correo,
      role: newUser.role
    });
  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    // Aceptar tanto nombre/correo (frontend) como name/email (legacy)
    const nombre = req.body.nombre || req.body.name;
    const correo = req.body.correo || req.body.email;
    const { password } = req.body;
    const userId = req.user.id_usuario;

    console.log('📝 Actualizando perfil del usuario:', userId);

    const updates = [];
    const updateValues = [];

    if (nombre) {
      updates.push('nombre = $' + (updates.length + 1));
      updateValues.push(nombre);
    }

    if (correo) {
      updates.push('correo = $' + (updates.length + 1));
      updateValues.push(correo);
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push('password = $' + (updates.length + 1));
      updateValues.push(hashedPassword);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No hay campos para actualizar' });
    }

    const updateQuery = 'UPDATE usuarios SET ' + updates.join(', ') +
      ' WHERE id_usuario = $' + (updates.length + 1) + ' RETURNING *';
    updateValues.push(userId);

    const result = await pool.query(updateQuery, updateValues);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const updatedUser = result.rows[0];
    console.log('✅ Perfil actualizado');

    res.json({
      message: 'Perfil actualizado exitosamente',
      user: {
        id_usuario: updatedUser.id_usuario,
        nombre: updatedUser.nombre,
        correo: updatedUser.correo,
        role: updatedUser.role,
        fecha_creacion: updatedUser.fecha_creacion
      }
    });
  } catch (error) {
    console.error('❌ Error al actualizar perfil:', error);
    res.status(500).json({ message: 'Error al actualizar el perfil', detail: error.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id_usuario;
    console.log('🗑️ Eliminando cuenta del usuario:', userId);

    // Eliminar datos relacionados primero
    try {
      await pool.query('DELETE FROM favoritos WHERE usuarioId = $1', [userId]);
      console.log('🗑️ Favoritos eliminados');
    } catch (e) {
      console.warn('⚠️ No se pudieron eliminar favoritos:', e.message);
    }

    try {
      await pool.query('DELETE FROM lectura_usuario WHERE id_usuario = $1', [userId]);
      console.log('🗑️ Historial de lectura eliminado');
    } catch (e) {
      console.warn('⚠️ No se pudo eliminar historial:', e.message);
    }

    // Finalmente eliminar el usuario
    const result = await pool.query(
      'DELETE FROM usuarios WHERE id_usuario = $1 RETURNING *',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    console.log('✅ Cuenta eliminada exitosamente');
    res.json({ message: 'Cuenta eliminada exitosamente' });

  } catch (error) {
    console.error('❌ Error al eliminar cuenta:', error.message);
    res.status(500).json({ message: 'Error al eliminar la cuenta', error: error.message });
  }
};

export const test = (req, res) => {
  res.json({ message: 'Backend funcionando correctamente' });
};