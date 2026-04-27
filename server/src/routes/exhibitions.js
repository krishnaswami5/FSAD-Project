const express = require('express');
const { getExhibitions, getExhibition, createExhibition, updateExhibition, deleteExhibition, getMyExhibitions } = require('../controllers/exhibitionController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getExhibitions);
router.get('/my', protect, authorize('curator', 'admin'), getMyExhibitions);
router.get('/:id', getExhibition);
router.post('/', protect, authorize('curator', 'admin'), createExhibition);
router.put('/:id', protect, authorize('curator', 'admin'), updateExhibition);
router.delete('/:id', protect, authorize('curator', 'admin'), deleteExhibition);

module.exports = router;
