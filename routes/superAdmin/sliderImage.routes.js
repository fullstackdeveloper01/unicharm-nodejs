const express = require('express');
const router = express.Router();
const sliderImageController = require('../../controllers/superAdmin/sliderImage.controller.js');

// Slider Image CRUD routes
router.get('/', sliderImageController.getAllSliderImages);
router.get('/:id', sliderImageController.getSliderImageById);
router.post('/', sliderImageController.createSliderImage);
router.put('/:id', sliderImageController.updateSliderImage);
router.delete('/:id', sliderImageController.deleteSliderImage);

module.exports = router;
