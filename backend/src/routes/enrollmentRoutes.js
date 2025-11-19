const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const ctrl = require('../controllers/enrollmentController');

const router = express.Router();

router.use(auth);
router.get('/', ctrl.listMine);
router.post('/', [body('courseId').notEmpty()], ctrl.enroll);
router.put('/:id', [body('status').isIn(['enrolled', 'completed', 'dropped'])], ctrl.updateStatus);
router.delete('/:id', ctrl.remove);

module.exports = router;
