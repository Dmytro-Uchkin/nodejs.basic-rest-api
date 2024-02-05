const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const userController = require('../controllers/user');

// POST user
router.post('/signup', userController.add_user);

// POST user
router.post('/login', userController.login_user);

// DELETE user
router.delete('/:userId', checkAuth, userController.delete_user);

module.exports = router;