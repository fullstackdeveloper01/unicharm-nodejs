const express = require('express');
const router = express.Router();
const sliderImageController = require('../../controllers/superadmin/sliderImageController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/slider-images/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'slider-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Slider Image CRUD routes
const { verifyToken } = require('../../middlewares/shared/auth');

// Public routes (Get)
router.get('/', sliderImageController.getAllSliderImages);
router.get('/:id', sliderImageController.getSliderImageById);

// Protected routes (Mutations) - with file upload middleware
router.post('/', verifyToken, upload.any(), sliderImageController.createSliderImage);
router.put('/:id', verifyToken, upload.any(), sliderImageController.updateSliderImage);
router.patch('/:id', verifyToken, upload.any(), sliderImageController.updateSliderImage);
router.delete('/:id', verifyToken, sliderImageController.deleteSliderImage);

module.exports = router;
