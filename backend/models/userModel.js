const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        fullName:
        {
            type:String,
            required:true
        },
        userName:{
            type:String,
            required:true,
            unique:true
        },
        email:
        {
            type:String,
            required:true,
            unique:true
        },
        password:
        {
            type:String,
            required:true,

        },
        followers:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                default:[]
            },
        ],
        following:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                default:[]
            },
        ],
        profileImg:{
            type:String,
            default:""
        },
        coverImg:{
            type:String,
            default:""
        },
        bio:{
            type:String,
            default:""
        },
        likedPosts:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Post",
                default:[]
            }
        ]
    },{timestamps:true}
)

const User = mongoose.model("User",userSchema);

module.exports = User