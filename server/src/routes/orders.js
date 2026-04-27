const express = require('express');
const { createOrder, createStripeSession, confirmOrder, getMyOrders, getAllOrders } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createOrder);
router.post('/stripe-session', protect, createStripeSession);
router.post('/:id/confirm', protect, confirmOrder);
router.get('/my', protect, getMyOrders);
router.get('/', protect, authorize('admin'), getAllOrders);

module.exports = router;
