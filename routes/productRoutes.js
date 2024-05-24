import express from 'express';
import { getProducts, getProductById } from '../controllers/productController.js';
import authenticateToken from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getProducts);
router.get('/:id', authenticateToken, getProductById);

export default router