const User = require("../models/userModel.js");
const Notification = require("../models/notificationModel.js")

const getAllNotifications = async(req,res) =>
{
    try {
        const userId = req.user._id;
        
        const notifications = await Notification.find({to:userId})
        .populate(
            {
                path:"from",
                select:"userName profileImg"
            }
        )

        await Notification.updateMany({to:userId,read:true})

        return res.status(200).json(notifications)
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal Server error"})
    }
}

const deleteAllNotifications = async(req,res) =>
{
    try {
        const userId = req.user._id;
        await Notification.deleteMany({to:userId})
        return res.status(200).json({message:"Notifications deleted Successfully"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal Server error"})
    }
}

module.exports = {getAllNotifications,deleteAllNotifications}