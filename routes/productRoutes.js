// routes/productRoutes.js
const express = require('express');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateStock,
} = require('../controllers/productController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/products
 * @desc    Get all products
 * @access  Public
 */
router.get('/', getProducts);

router.get('/:id', getProductById);

router.post('/create', protect, authorize('admin'), createProduct);

router.put('/:id', protect, authorize('admin'), updateProduct);

router.delete('/:id', protect, authorize('admin'), deleteProduct);


router.put('/:id/stock', protect, authorize('admin'), updateStock);

module.exports = router;
