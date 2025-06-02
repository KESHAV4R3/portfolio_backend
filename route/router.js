const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth')

const { sendMailToAdmin, sendMailToUser, getAllUser, userLogin, automaticLogin, makeUserActive, removeUserActive, deleteUser } = require('../controller/user')

router.post('/sendMailToAdmin', sendMailToAdmin);
router.post('/sendMailToUser', isAuthenticated, sendMailToUser);
router.patch('/makeUserActive', isAuthenticated, makeUserActive);
router.patch('/removeUserActive', isAuthenticated, removeUserActive);
router.delete('/deleteUser/:userId', isAuthenticated, deleteUser);
router.post('/userLogin', userLogin)
router.post('/automaticLogin', automaticLogin)
router.get('/getAllUsers', isAuthenticated, getAllUser)

module.exports = router;