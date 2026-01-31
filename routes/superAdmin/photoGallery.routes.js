const express = require('express');
const router = express.Router();
const photoGalleryController = require('../../controllers/superAdmin/photoGallery.controller.js');

// Photo Gallery CRUD routes
router.get('/', photoGalleryController.getAllPhotoGalleries);
router.get('/:id', photoGalleryController.getPhotoGalleryById);
router.post('/', photoGalleryController.createPhotoGallery);
router.put('/:id', photoGalleryController.updatePhotoGallery);
router.delete('/:id', photoGalleryController.deletePhotoGallery);

module.exports = router;
