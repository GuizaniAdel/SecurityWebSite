const express = require('express');
const router = express.Router();

const { register, login, updateScore, getUsersAndScores, checkPasswordResetTokenExist, UpdatePasswordResetuser } = require('../controllers/user');
const ResetPassword = require('../controllers/sendEmails');
const verifyTokenMiddleware = require('../middlewares/verifyToken');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/UpdateScore').patch(verifyTokenMiddleware, updateScore);
router.route('/allusers').get(getUsersAndScores);
router.route('/ResetPassword/:email').post(ResetPassword);
router.route('/checkPasswordResetTokenExist/:resetToken').get(checkPasswordResetTokenExist);
router.route('/UpdatePasswordResetuser').patch(UpdatePasswordResetuser);

module.exports = router;