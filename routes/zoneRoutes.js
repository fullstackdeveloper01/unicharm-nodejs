const express = require('express');
const router = express.Router();
const controller = require('../controllers/zoneController');

router.get('/', controller.getAllZones);
router.get('/:id', controller.getZoneById);
router.post('/', controller.createZone);
router.put('/:id', controller.updateZone);
router.delete('/:id', controller.deleteZone);

module.exports = router;
