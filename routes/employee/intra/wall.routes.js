const express = require('express');
const router = express.Router();
const wallController = require('../../../controllers/employee/intra/wall.controller.js');
const { verifyToken } = require('../../../middleware/employee/intra/auth.middleware.js');

// Routes
router.get('/', verifyToken, wallController.getAllWalls);
router.get('/:id', verifyToken, wallController.getWallById);
router.post('/', verifyToken, wallController.createWall);
router.post('/:id/like', verifyToken, wallController.toggleLike);
router.post('/:id/comment', verifyToken, wallController.addComment);
router.delete('/comments/:commentId', verifyToken, wallController.deleteComment);

module.exports = router;
