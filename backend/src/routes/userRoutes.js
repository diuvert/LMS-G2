const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const allowRoles = require('../middleware/roles');
const ctrl = require('../controllers/userController');
const router = express.Router();

router.use(auth, allowRoles('admin'));
router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.post(
  '/',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['student', 'instructor', 'admin']),
  ],
  ctrl.create
);
router.put(
  '/:id',
  [
    body('name').optional().notEmpty(),
    body('email').optional().isEmail(),
    body('role').optional().isIn(['student', 'instructor', 'admin']),
  ],
  ctrl.update
);
router.delete('/:id', ctrl.remove);

module.exports = router;
