const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  artwork:   { type: mongoose.Schema.Types.ObjectId, ref: 'Artwork', required: true },
  title:     { type: String, required: true },
  price:     { type: Number, required: true },
  thumbnail: { type: String, default: '' },
  artist:    { type: String, default: '' },
});

const orderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  subtotal:   { type: Number, required: true },
  tax:        { type: Number, default: 0 },
  total:      { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending',
  },
  paymentMethod: { type: String, default: 'stripe' },
  paymentIntentId: { type: String, default: '' },
  stripeSessionId: { type: String, default: '' },
  shippingAddress: {
    line1:   { type: String },
    line2:   { type: String },
    city:    { type: String },
    state:   { type: String },
    zip:     { type: String },
    country: { type: String, default: 'US' },
  },
  paidAt:      { type: Date },
  deliveredAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
