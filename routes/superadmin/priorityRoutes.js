const express = require('express');
const router = express.Router();
const controller = require('../../controllers/superadmin/priorityController');

router.get('/', controller.getAllPriorities);
router.get('/:id', controller.getPriorityById);
router.post('/', controller.createPriority);
router.put('/:id', controller.updatePriority);
router.delete('/:id', controller.deletePriority);

module.exports = router;
