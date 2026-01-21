const express = require('express');
const router = express.Router();
const controller = require('../controllers/unitController');

router.get('/', controller.getAllUnits);
router.get('/:id', controller.getUnitById);
router.post('/', controller.createUnit);
router.put('/:id', controller.updateUnit);
router.delete('/:id', controller.deleteUnit);

module.exports = router;
