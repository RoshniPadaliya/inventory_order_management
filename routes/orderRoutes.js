// routes/orderRoutes.js
const express = require('express');
const {
  placeOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/orderController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/orders
 * @desc    Place a new order
 * @access  Private/Customer
 */
router.post('/placeorder', protect, authorize('customer'), placeOrder);

/**
 * @route   GET /api/orders
 * @desc    Get all orders (Admin) or user orders (Customer)
 * @access  Private
 */
router.get('/', protect, getOrders);

/**
 * @route   GET /api/orders/:id
 * @desc    Get single order
 * @access  Private
 */
router.get('/:id', protect, getOrderById);

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Update order status
 * @access  Private/Admin
 */
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

module.exports = router;

