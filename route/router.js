const express = require('express');
const router = express.Router();

const { sendMailToAdmin, sendMailToUser, register, makeUserActive, removeUserActive, deleteUser } = require('../controller/user')

router.post('/sendMailToAdmin', sendMailToAdmin);
router.post('/sendMailToUser', sendMailToUser);
router.post('/registerUser', register);
router.patch('/makeUserActive', makeUserActive);
router.patch('/removeUserActive', removeUserActive);
router.delete('/deleteUser/:userId', deleteUser);

module.exports = router;