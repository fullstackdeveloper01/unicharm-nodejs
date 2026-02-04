const express = require('express');
const router = express.Router();
const sliderImageController = require('../../controllers/superadmin/sliderImageController');

// Slider Image CRUD routes
const { verifyToken } = require('../../middlewares/shared/auth');

// Public routes (Get)
router.get('/', sliderImageController.getAllSliderImages);
router.get('/:id', sliderImageController.getSliderImageById);

// Protected routes (Mutations)
router.post('/', verifyToken, sliderImageController.createSliderImage);
router.put('/:id', verifyToken, sliderImageController.updateSliderImage);
router.delete('/:id', verifyToken, sliderImageController.deleteSliderImage);

module.exports = router;
