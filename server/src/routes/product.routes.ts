import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes (anyone can view products)
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-only routes (protected by two middleware functions)
router.post('/', requireAuth, requireAdmin, createProduct);
router.put('/:id', requireAuth, requireAdmin, updateProduct);
router.delete('/:id', requireAuth, requireAdmin, deleteProduct);

export default router;