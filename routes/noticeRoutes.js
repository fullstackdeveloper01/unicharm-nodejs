const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');

// Notice CRUD routes
router.get('/', noticeController.getAllNotices);
router.get('/:id', noticeController.getNoticeById);
router.post('/', noticeController.createNotice);
router.put('/:id', noticeController.updateNotice);
router.delete('/:id', noticeController.deleteNotice);

module.exports = router;
