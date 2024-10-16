// controllers/orderController.js
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private/Customer
const placeOrder = asyncHandler(async (req, res) => {
  const { orderItems } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Calculate total price and check stock
  let totalPrice = 0;
  for (const item of orderItems) {
    const product = await Product.findById(item.product);

    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.product}`);
    }

    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(
        `Not enough stock for product: ${product.name}. Available: ${product.stock}`
      );
    }

    item.price = product.price; // Set the current price
    totalPrice += product.price * item.quantity;

    // Reduce stock
    product.stock -= item.quantity;
    await product.save();

    // Check for low stock
    if (product.stock <= product.lowStockThreshold) {
      // Implement alert logic here (e.g., send email, log warning)
      console.warn(
        `Low stock alert for product: ${product.name}. Current stock: ${product.stock}`
      );
    }
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    totalPrice,
  });

  res.status(201).json({
    success: true,
    data: order,
  });
});

// @desc    Get all orders (Admin) or user orders (Customer)
// @route   GET /api/orders
// @access  Private
const getOrders = asyncHandler(async (req, res) => {
  let orders;

  if (req.user.role === 'admin') {
    orders = await Order.find()
      .populate('user', 'name email')
      .populate('orderItems.product', 'name price');
  } else {
    orders = await Order.find({ user: req.user._id }).populate(
      'orderItems.product',
      'name price'
    );
  }

  res.json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name price');

  if (order) {
    // If not admin, ensure the user owns the order
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }

    res.json({
      success: true,
      data: order,
    });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const validStatuses = ['Pending', 'Shipped', 'Delivered'];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = status;
    const updatedOrder = await order.save();

    res.json({
      success: true,
      data: updatedOrder,
    });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

module.exports = {
  placeOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
};
