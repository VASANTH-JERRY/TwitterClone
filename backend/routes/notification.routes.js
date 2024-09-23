const express = require("express");
const { protectedRoute } = require("../middleware/protectedRoute");
const { getAllNotifications, deleteAllNotifications } = require("../controllers/notificationController");

const router = express.Router();

router.route("/getall").get(protectedRoute,getAllNotifications)
router.route("/deleteall").delete(protectedRoute,deleteAllNotifications)

module.exports = router