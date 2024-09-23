const express = require('express');
const { signup, login,logout,getMe } = require('../controllers/authController');
const { protectedRoute } = require('../middleware/protectedRoute');
const router = express.Router();

router.route("/me").get(protectedRoute,getMe);
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);

module.exports= router