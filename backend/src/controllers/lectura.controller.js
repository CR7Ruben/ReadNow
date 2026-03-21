import { pool } from '../config/db.js';

export const readBook = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id_usuario;
    const userRole = req.user.role;

    console.log('📖 Usuario intentando leer libro:', { userId, userRole, bookId: id });

    if (userRole === 'PREMIUM') {
      console.log('👑 Usuario PREMIUM - acceso ilimitado');
      return fetchBookAndRespond(id, res);
    }

    if (userRole === 'FREE') {
      console.log('🆓 Usuario FREE - verificando límite mensual');

      const countResult = await pool.query(`
        SELECT COUNT(*) as books_read
        FROM lectura_usuario
        WHERE id_usuario = $1
        AND DATE_TRUNC('month', fecha_lectura) = DATE_TRUNC('month', CURRENT_DATE)
      `, [userId]);

      const booksReadThisMonth = parseInt(countResult.rows[0].books_read);
      console.log('📊 Libros leídos este mes:', booksReadThisMonth);

      if (booksReadThisMonth >= 1) {
        console.log('❌ Límite mensual alcanzado');
        return res.status(403).json({
          message: 'Límite de lectura alcanzado',
          limit: 1,
          current: booksReadThisMonth,
          resetDate: getNextMonthReset()
        });
      }

      console.log('✅ Límite disponible - permitiendo lectura');

      // Verificar si ya existe la lectura
      const existingResult = await pool.query(
        'SELECT id FROM lectura_usuario WHERE id_usuario = $1 AND id_libro = $2',
        [userId, id]
      );

      if (existingResult.rows.length === 0) {
        // Insertar solo si no existe
        await pool.query(
          'INSERT INTO lectura_usuario (id_usuario, id_libro, fecha_lectura) VALUES ($1, $2, CURRENT_DATE)',
          [userId, id]
        );
        console.log('📝 Lectura registrada');
      } else {
        console.log('📝 Lectura ya existía, no se duplica');
      }

      return fetchBookAndRespond(id, res);
    }

    return res.status(403).json({ message: 'Rol no válido' });
  } catch (error) {
    console.error('Error en lectura:', error);
    res.status(500).json({ message: 'Error al procesar solicitud de lectura' });
  }
};

async function fetchBookAndRespond(id, res) {
  try {
    const response = await fetch(`https://gutendex.com/books/${id}`);
    const book = await response.json();

    res.json({
      id: book.id?.toString() || id,
      title: book.title || 'Título desconocido',
      author: book.authors?.[0]?.name || 'Autor desconocido',
      readLink: book.formats?.['text/html'] || book.formats?.['application/pdf'] || null,
      downloadLinks: book.formats || {}
    });
  } catch (error) {
    console.error('Error fetching read link from Gutenberg:', error);
    res.status(500).json({ message: 'Error al obtener enlace de lectura' });
  }
}

function getNextMonthReset() {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.toISOString().split('T')[0];
}
