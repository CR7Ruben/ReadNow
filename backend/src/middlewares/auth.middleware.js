import jwt from 'jsonwebtoken';

const JWT_SECRET = 'EstaEsUnaClaveSuperSeguraParaJWT2026BibliotecaAPI';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log('🔑 Verificando token - Header:', authHeader ? authHeader.substring(0, 50) + '...' : 'null');

  if (!authHeader) {
    console.log('❌ Token requerido - No hay header de autorización');
    return res.status(401).json({ message: 'Token requerido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token decodificado:', {
      id_usuario: decoded.id_usuario,
      email: decoded.email,
      role: decoded.role
    });

    req.user = {
      id_usuario: decoded.id_usuario,
      email: decoded.email,
      role: decoded.role
    };
    next();
  } catch (error) {
    console.log('❌ Error verificando token:', error.message);
    return res.status(401).json({ message: 'Token inválido' });
  }
};

export const generateToken = (user) => {
  return jwt.sign(
    { id_usuario: user.id_usuario, email: user.correo, role: user.role },
    JWT_SECRET,
    { expiresIn: '2h' }
  );
};
