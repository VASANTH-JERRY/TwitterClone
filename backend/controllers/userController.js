const Notification = require('../models/notificationModel.js');
const User = require('../models/userModel.js');
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary').v2

const getUserProfile = async(req,res) =>
{
    try {
        const {userName} = req.params;

    const user = await User.findOne({userName}).select("-password");
    if(!user)
    {
        return res.json({error:"User not exist"})
    }

    return res.json(user)
    } catch (error) {

        console.error(error)
        return res.json({error:"Internal Server Error"})
    }
}

const followUnfollowUser = async(req,res) =>
{
    try {
        const {id} = req.params;

        const userToModify = await User.findById(id).select("-password");
        const currentUser = await User.findById(req.user._id )

        if(id === req.user._id.toString())
        {
            return res.json({error:"You cannot follow/unfollow yourself"})
        }

        if(!userToModify || !currentUser)
        {
            return res.json({error:"User not found"})
        }

        const isFollowing = currentUser.following.includes(userToModify._id)

        if(isFollowing)
        {
            // unfollow the user
            await User.findByIdAndUpdate(id,{$pull:{followers:req.user._id}})
            await User.findByIdAndUpdate(req.user._id,{$pull:{following:id}})

            return res.json({message:"User Unfollowed Successfully"})
        }
        else{
            //follow the user
            await User.findByIdAndUpdate(id,{$push:{followers:req.user._id}})
            await User.findByIdAndUpdate(req.user._id,{$push:{following:id}})

            await Notification.create({
                type:"follow",
                from:req.user._id,
                to: userToModify._id
            })

            return res.json({message:"User followed successfully"})
    }
    } catch (error) {
        
        
        console.error(error)
        return res.json({error:"Internal Server Error"})
    }


}

const getSuggestedUsers = async(req,res) =>
{
    try {
        const userId = req.user._id;
        const usersFollowedByMe = await User.findById(userId).select("following")

        const users = await User.aggregate([
            {
              $match: {
                _id: { $ne: userId }, // Match all users where _id is not equal to userId
              },
            },
            {
              $sample: {
                size: 10, // Randomly sample 10 users
              },
            },
          ]);
          

        const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id ))
        // in that above line the usersFollowedByMe was an object it contains a following array

        const suggestedUsers = filteredUsers.slice(0,4);
        suggestedUsers.forEach((item)=>item.password=null)

        return res.json(suggestedUsers)
    } catch (error) {
        
        console.error(error)
        return res.json({error:"Internal Server Error"})
    }
}

const updateUser = async(req,res)=>
{
    try {
        const {fullName,email,userName,currentPassword,newPassword,bio,link,}  = req.body
        let{profileImg,coverImg} = req.body
        const userId = req.user._id;

        const user = await User.findById(userId)
       

        if((!newPassword && currentPassword) || (!currentPassword && newPassword))
        {
            return res.json({error:"Please provide both current and new password"})
        }

        if(currentPassword && newPassword)
        {
            const isMatch = await bcrypt.compare(user.password,currentPassword)
            if(isMatch)
            {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(newPassword,salt);

                user.password = hashedPassword;
            }
        }

        if (profileImg) {
			if (user.profileImg) {
				// https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/zmxorcxexpdbh8r0bkjb.png
				await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profileImg);
			profileImg = uploadedResponse.secure_url;
		}

		if (coverImg) {
			if (user.coverImg) {
				await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(coverImg);
			coverImg = uploadedResponse.secure_url;
		}


        user.fullName = fullName || user.fullName;
        user.userName = userName || user.userName;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImg = profileImg || user.profileImg;
		user.coverImg = coverImg || user.coverImg;

        await user.save();
        
        user.password = null 

        return res.json(user)
    } catch (error) {
    
        console.error(error)
        return res.json({error:"Internal Server Error"})
    }
}

module.exports = {getUserProfile,followUnfollowUser,getSuggestedUsers,updateUser}