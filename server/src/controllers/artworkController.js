const Artwork = require('../models/Artwork');
const User = require('../models/User');

// GET /api/artworks
const getArtworks = async (req, res) => {
  try {
    const {
      page = 1, limit = 12, category, minPrice, maxPrice,
      artist, search, sort = '-createdAt', status = 'approved',
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (artist) query.artist = artist;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) query.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Artwork.countDocuments(query);
    const artworks = await Artwork.find(query)
      .populate('artist', 'name avatar bio')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      data: artworks,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/artworks/:id
const getArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id)
      .populate('artist', 'name avatar bio socialLinks')
      .populate('reviews.user', 'name avatar');
    if (!artwork) return res.status(404).json({ success: false, message: 'Artwork not found' });
    artwork.views += 1;
    await artwork.save({ validateBeforeSave: false });
    res.json({ success: true, data: artwork });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/artworks
const createArtwork = async (req, res) => {
  try {
    const {
      title, description, culturalHistory, price, category,
      medium, dimensions, year, tags, images, thumbnail,
    } = req.body;

    const artwork = await Artwork.create({
      title, description, culturalHistory, price, category,
      medium, dimensions, year, tags,
      images: images || [],
      thumbnail: thumbnail || (images && images[0]?.url) || '',
      artist: req.user.id,
      status: 'pending',
    });

    await artwork.populate('artist', 'name avatar');
    res.status(201).json({ success: true, data: artwork });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/artworks/:id
const updateArtwork = async (req, res) => {
  try {
    let artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ success: false, message: 'Artwork not found' });

    const isOwner = artwork.artist.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ success: false, message: 'Unauthorized' });

    artwork = await Artwork.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    }).populate('artist', 'name avatar');

    res.json({ success: true, data: artwork });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/artworks/:id
const deleteArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ success: false, message: 'Artwork not found' });

    const isOwner = artwork.artist.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ success: false, message: 'Unauthorized' });

    await artwork.deleteOne();
    res.json({ success: true, message: 'Artwork deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/artworks/:id/status (admin only)
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const artwork = await Artwork.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    ).populate('artist', 'name email');
    if (!artwork) return res.status(404).json({ success: false, message: 'Artwork not found' });
    res.json({ success: true, data: artwork });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/artworks/:id/reviews
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ success: false, message: 'Artwork not found' });

    const alreadyReviewed = artwork.reviews.find(r => r.user.toString() === req.user.id);
    if (alreadyReviewed) return res.status(400).json({ success: false, message: 'Already reviewed' });

    artwork.reviews.push({ user: req.user.id, rating, comment });
    artwork.calcAvgRating();
    await artwork.save();

    await artwork.populate('reviews.user', 'name avatar');
    res.status(201).json({ success: true, data: artwork });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET /api/artworks/featured
const getFeatured = async (req, res) => {
  try {
    const artworks = await Artwork.find({ isFeatured: true, status: 'approved' })
      .populate('artist', 'name avatar')
      .limit(8);
    res.json({ success: true, data: artworks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/artworks/my  (artist's own)
const getMyArtworks = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Artwork.countDocuments({ artist: req.user.id });
    const artworks = await Artwork.find({ artist: req.user.id })
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));
    res.json({
      success: true,
      data: artworks,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getArtworks, getArtwork, createArtwork, updateArtwork, deleteArtwork, updateStatus, addReview, getFeatured, getMyArtworks };
