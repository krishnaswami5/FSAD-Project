const Exhibition = require('../models/Exhibition');

// GET /api/exhibitions
const getExhibitions = async (req, res) => {
  try {
    const exhibitions = await Exhibition.find({ isActive: true })
      .populate('curator', 'name avatar')
      .populate('artworks', 'title thumbnail price')
      .sort('-createdAt');
    res.json({ success: true, data: exhibitions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/exhibitions/:id
const getExhibition = async (req, res) => {
  try {
    const exhibition = await Exhibition.findById(req.params.id)
      .populate('curator', 'name avatar bio')
      .populate({ path: 'artworks', populate: { path: 'artist', select: 'name avatar' } })
      .populate({ path: 'rooms.artworks', populate: { path: 'artist', select: 'name avatar' } });
    if (!exhibition) return res.status(404).json({ success: false, message: 'Exhibition not found' });
    res.json({ success: true, data: exhibition });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/exhibitions
const createExhibition = async (req, res) => {
  try {
    const exhibition = await Exhibition.create({ ...req.body, curator: req.user.id });
    res.status(201).json({ success: true, data: exhibition });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/exhibitions/:id
const updateExhibition = async (req, res) => {
  try {
    let exh = await Exhibition.findById(req.params.id);
    if (!exh) return res.status(404).json({ success: false, message: 'Exhibition not found' });
    const isOwner = exh.curator.toString() === req.user.id;
    if (!isOwner && req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Unauthorized' });
    exh = await Exhibition.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: exh });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/exhibitions/:id
const deleteExhibition = async (req, res) => {
  try {
    const exh = await Exhibition.findById(req.params.id);
    if (!exh) return res.status(404).json({ success: false, message: 'Exhibition not found' });
    await exh.deleteOne();
    res.json({ success: true, message: 'Exhibition deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/exhibitions/my (curator)
const getMyExhibitions = async (req, res) => {
  try {
    const exhibitions = await Exhibition.find({ curator: req.user.id })
      .populate('artworks', 'title thumbnail price')
      .sort('-createdAt');
    res.json({ success: true, data: exhibitions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getExhibitions, getExhibition, createExhibition, updateExhibition, deleteExhibition, getMyExhibitions };
