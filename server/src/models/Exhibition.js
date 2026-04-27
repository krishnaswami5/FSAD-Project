const mongoose = require('mongoose');

const exhibitionSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  theme:       { type: String, default: '' },
  curator:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  artworks:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artwork' }],
  coverImage:  { type: String, default: '' },
  startDate:   { type: Date },
  endDate:     { type: Date },
  isActive:    { type: Boolean, default: true },
  isFeatured:  { type: Boolean, default: false },
  tags:        [{ type: String }],
  rooms: [{
    name:        String,
    description: String,
    artworks:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artwork' }],
    wallColor:   { type: String, default: '#1a1a26' },
    position:    { x: Number, y: Number },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Exhibition', exhibitionSchema);
