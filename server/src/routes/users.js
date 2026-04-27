const express = require('express');
const { getAllUsers, getUser, updateUser, deleteUser, toggleWishlist, getAnalytics } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/analytics', protect, authorize('admin'), getAnalytics);
router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, getUser);
router.put('/:id', protect, authorize('admin'), updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);
router.post('/wishlist/:artworkId', protect, toggleWishlist);

module.exports = router;
