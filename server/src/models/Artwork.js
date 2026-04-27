const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true },
}, { timestamps: true });

const artworkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000],
  },
  culturalHistory: { type: String, default: '' },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  category: {
    type: String,
    enum: ['painting', 'sculpture', 'photography', 'digital', 'drawing', 'mixed-media', 'print', 'other'],
    required: true,
  },
  medium: { type: String, default: '' },
  dimensions: { width: Number, height: Number, unit: { type: String, default: 'cm' } },
  year: { type: Number },
  images: [{ url: String, publicId: String }],
  thumbnail: { type: String, default: '' },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'sold'],
    default: 'pending',
  },
  isFeatured: { type: Boolean, default: false },
  tags: [{ type: String, trim: true }],
  reviews: [reviewSchema],
  avgRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  salesCount: { type: Number, default: 0 },
  exhibitions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exhibition' }],
}, { timestamps: true });

// Recalculate average rating
artworkSchema.methods.calcAvgRating = function () {
  if (this.reviews.length === 0) { this.avgRating = 0; this.totalReviews = 0; return; }
  const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
  this.avgRating = Math.round((sum / this.reviews.length) * 10) / 10;
  this.totalReviews = this.reviews.length;
};

// Text index for search
artworkSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Artwork', artworkSchema);
