const express = require('express');
const router = express.Router();
const controller = require('../../controllers/superadmin/groupController');

router.get('/', controller.getAllGroups);
router.get('/:id', controller.getGroupById);
router.post('/', controller.createGroup);
router.put('/:id', controller.updateGroup);
router.delete('/:id', controller.deleteGroup);

module.exports = router;
