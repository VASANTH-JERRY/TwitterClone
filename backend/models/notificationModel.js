const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        from:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        to:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        type:{
            type:String,
            enum:['follow','like'],
            required:true
        },
        read:{
            type:String,
            default:false
        }
    },{timestamps:true}
)


const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;