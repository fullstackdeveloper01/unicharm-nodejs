const express = require('express');
const router = express.Router();
const controller = require('../../controllers/superadmin/auditorController');

router.get('/', controller.getAllAuditors);
router.get('/:id', controller.getAuditorById);
router.post('/', controller.createAuditor);
router.put('/:id', controller.updateAuditor);
router.delete('/:id', controller.deleteAuditor);

module.exports = router;
