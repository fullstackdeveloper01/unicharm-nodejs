const express = require('express');
const router = express.Router();
const wallController = require('../controllers/employee/wall.controller');

// Wall CRUD routes
router.get('/', wallController.getAllWalls);
router.get('/:id', wallController.getWallById);
router.post('/', wallController.createWall);
router.put('/:id', wallController.updateWall);
router.delete('/:id', wallController.deleteWall);

module.exports = router;
