const express = require('express');
const router = express.Router();
const controller = require('../controllers/cityController');

router.get('/', controller.getAllCities);
router.get('/:id', controller.getCityById);
router.post('/', controller.createCity);
router.put('/:id', controller.updateCity);
router.delete('/:id', controller.deleteCity);

module.exports = router;
