import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import booksRoutes from './routes/books.routes.js';
import premiumRoutes from './routes/premium.routes.js';
import authRoutes from './routes/auth.routes.js';
import paymentRoutes from './routes/payment.routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/books', booksRoutes);
app.use('/books', booksRoutes); // opcional si la usas
app.use('/premium', premiumRoutes);
app.use('/auth', authRoutes);
app.use('/payment', paymentRoutes);

app.listen(3000, () => {
  console.log('✅ ReadNow corriendo en el puerto 3000');
});