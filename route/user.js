const express = require('express');
const { handleUserSignUp, handleUserLogin, getUserData, getUserByEmail } = require('../controller/user');

const router = express.Router();

router.post('/signup', handleUserSignUp);
router.post('/login', handleUserLogin);
router.get('/info', getUserData);
router.post('/email', getUserByEmail);

module.exports = router;