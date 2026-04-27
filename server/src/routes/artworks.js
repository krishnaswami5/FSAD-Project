const express = require('express');
const {
  getArtworks, getArtwork, createArtwork, updateArtwork, deleteArtwork,
  updateStatus, addReview, getFeatured, getMyArtworks,
} = require('../controllers/artworkController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/featured', getFeatured);
router.get('/my', protect, authorize('artist'), getMyArtworks);
router.get('/', getArtworks);
router.get('/:id', getArtwork);
router.post('/', protect, authorize('artist', 'admin'), createArtwork);
router.put('/:id', protect, authorize('artist', 'admin'), updateArtwork);
router.delete('/:id', protect, authorize('artist', 'admin'), deleteArtwork);
router.patch('/:id/status', protect, authorize('admin'), updateStatus);
router.post('/:id/reviews', protect, addReview);

module.exports = router;
