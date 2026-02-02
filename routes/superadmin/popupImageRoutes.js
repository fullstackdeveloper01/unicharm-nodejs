const express = require('express');
const router = express.Router();
const popupImageController = require('../../controllers/superadmin/popupImageController');

// Popup Image CRUD routes
router.get('/', popupImageController.getAllPopupImages);
router.get('/:id', popupImageController.getPopupImageById);
router.post('/', popupImageController.createPopupImage);
router.put('/:id', popupImageController.updatePopupImage);
router.delete('/:id', popupImageController.deletePopupImage);

module.exports = router;
