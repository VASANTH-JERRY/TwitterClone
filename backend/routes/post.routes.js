const express = require('express');
const { protectedRoute } = require('../middleware/protectedRoute');
const { createPost, deletePost, commentOnPost, likeUnlikePost, getAllPost, getLikedPosts, getFollowingPosts, getUserPosts } = require('../controllers/postController');

const router = express.Router();

router.route("/create").post(protectedRoute,createPost)
router.route("/delete/:id").delete(protectedRoute,deletePost)
router.route("/comment/:id").post(protectedRoute,commentOnPost)
router.route("/like/:id").post(protectedRoute,likeUnlikePost)
router.route("/all").get(protectedRoute,getAllPost)
router.route("/likes/:id").get(protectedRoute,getLikedPosts)
router.route("/following").get(protectedRoute,getFollowingPosts)
router.route("/user/:userName").get(protectedRoute,getUserPosts)

module.exports = router