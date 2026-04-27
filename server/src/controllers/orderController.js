const Order = require('../models/Order');
const Artwork = require('../models/Artwork');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

// POST /api/orders  — create order from cart items
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ success: false, message: 'No items in order' });

    // Verify artworks
    const artworkIds = items.map(i => i.artwork);
    const artworks = await Artwork.find({ _id: { $in: artworkIds }, status: 'approved' });
    if (artworks.length !== items.length) return res.status(400).json({ success: false, message: 'Some artworks are unavailable' });

    const orderItems = artworks.map(a => ({
      artwork: a._id,
      title: a.title,
      price: a.price,
      thumbnail: a.thumbnail,
      artist: '',
    }));

    const subtotal = orderItems.reduce((sum, i) => sum + i.price, 0);
    const tax = Math.round(subtotal * 0.1 * 100) / 100;
    const total = subtotal + tax;

    const order = await Order.create({
      buyer: req.user.id,
      items: orderItems,
      subtotal,
      tax,
      total,
      shippingAddress: shippingAddress || {},
      status: 'pending',
    });

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/orders/stripe-session — mock Stripe payment intent
const createStripeSession = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.buyer.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Unauthorized' });

    // Simulate a Stripe payment intent (mock when no real key)
    let clientSecret = 'mock_pi_' + Math.random().toString(36).substr(2, 20) + '_secret_mock';

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(order.total * 100),
        currency: 'usd',
        metadata: { orderId: order._id.toString() },
      });
      clientSecret = paymentIntent.client_secret;
    } catch (_) {
      // Fall through to mock on Stripe error (test key not provided)
    }

    res.json({ success: true, clientSecret, orderId: order._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/orders/:id/confirm
const confirmOrder = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = 'paid';
    order.paymentIntentId = paymentIntentId || 'mock_' + Date.now();
    order.paidAt = new Date();
    await order.save();

    // Update artwork sales count
    for (const item of order.items) {
      await Artwork.findByIdAndUpdate(item.artwork, { $inc: { salesCount: 1 }, status: 'sold' });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/orders/my
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate('items.artwork', 'title thumbnail')
      .sort('-createdAt');
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    const total = await Order.countDocuments();
    const orders = await Order.find()
      .populate('buyer', 'name email')
      .populate('items.artwork', 'title thumbnail')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));
    res.json({ success: true, data: orders, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createOrder, createStripeSession, confirmOrder, getMyOrders, getAllOrders };
