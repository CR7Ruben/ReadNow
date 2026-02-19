
import express from 'express';
import cors from 'cors';
import booksRoutes from './routes/books.routes.js';
import premiumRoutes from './routes/premium.routes.js';
import authRoutes from './routes/auth.routes.js';
import paymentRoutes from './routes/payment.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/books', booksRoutes);
app.use('/premium', premiumRoutes);
app.use('/auth', authRoutes);
app.use('/payment', paymentRoutes);

app.listen(3000, () => console.log('ReadNow corriendo en el puerto 3000'));
