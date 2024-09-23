const express = require('express');
const { protectedRoute } = require('../middleware/protectedRoute');
const { getUserProfile, followUnfollowUser, getSuggestedUsers, updateUser } = require('../controllers/userController');

const router = express.Router();

router.route('/profile/:userName').get(protectedRoute,getUserProfile);
router.route('/follow/:id').post(protectedRoute,followUnfollowUser);
router.route("/suggested").get(protectedRoute,getSuggestedUsers)
router.route("/update").post(protectedRoute,updateUser)

module.exports = router