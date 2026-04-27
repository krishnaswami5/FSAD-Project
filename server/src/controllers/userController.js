const User = require('../models/User');
const Artwork = require('../models/Artwork');
const Order = require('../models/Order');

// GET /api/users (admin)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
    const skip = (page - 1) * limit;
    const total = await User.countDocuments(query);
    const users = await User.find(query).sort('-createdAt').skip(skip).limit(Number(limit));
    res.json({ success: true, data: users, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/users/:id
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('wishlist', 'title thumbnail price');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/users/:id (admin update role/status)
const updateUser = async (req, res) => {
  try {
    const { role, isActive, name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isActive, name, email },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/users/:id (admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await user.deleteOne();
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/users/wishlist/:artworkId
const toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const artworkId = req.params.artworkId;
    const idx = user.wishlist.findIndex(id => id.toString() === artworkId);
    if (idx > -1) {
      user.wishlist.splice(idx, 1);
    } else {
      user.wishlist.push(artworkId);
    }
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/users/analytics (admin)
const getAnalytics = async (req, res) => {
  try {
    const [
      totalUsers, totalArtworks, totalOrders,
      usersByRole, artworksByCategory, recentOrders,
      totalRevenue,
    ] = await Promise.all([
      User.countDocuments(),
      Artwork.countDocuments(),
      Order.countDocuments({ status: 'paid' }),
      User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
      Artwork.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
      Order.find({ status: 'paid' }).sort('-createdAt').limit(5).populate('buyer', 'name'),
      Order.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
    ]);
    res.json({
      success: true,
      data: {
        totalUsers,
        totalArtworks,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        usersByRole,
        artworksByCategory,
        recentOrders,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllUsers, getUser, updateUser, deleteUser, toggleWishlist, getAnalytics };
