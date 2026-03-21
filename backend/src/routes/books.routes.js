import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import * as booksController from '../controllers/books.controller.js';

const router = Router();

// Public routes
router.get('/', booksController.getBooks);
router.get('/search', booksController.searchBooks);
router.get('/category/:category', booksController.getBooksByCategory);
router.get('/public/:id', booksController.getPublicBookById);

// Protected routes
router.get('/subscription', verifyToken, booksController.getSubscriptionInfo);
router.get('/:id', verifyToken, booksController.getBookById);

export default router;
