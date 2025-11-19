const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/roles');
const ctrl = require('../controllers/courseController');
const router = express.Router();

router.get('/', ctrl.list);
router.get('/:id', ctrl.get);

router.post(
  '/',
  auth,
  allowRoles('instructor', 'admin'),
  [body('title').notEmpty(), body('description').optional().isString()],
  ctrl.create
);

router.put(
  '/:id',
  auth,
  allowRoles('instructor', 'admin'),
  [body('title').optional().notEmpty(), body('description').optional().isString()],
  ctrl.update
);

router.delete('/:id', auth, allowRoles('instructor', 'admin'), ctrl.remove);

module.exports = router;
