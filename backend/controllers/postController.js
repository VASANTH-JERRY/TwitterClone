const User = require("../models/userModel.js")
const Post = require("../models/postModel.js");
const Notification = require("../models/notificationModel.js")
const cloudinary = require('cloudinary').v2


const createPost = async(req,res) =>
{
    try {
        const id = req.user._id.toString();
        const {text} = req.body;
        let {img} = req.body
        const user = await User.findById(req.user._id)

        if(!user)
        {
            return res.json({error:"user not found"})
        }

        if(!img && !text)
        {
            return res.json({error:"post must have either image or text"})
        }

        if(img)
        {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url
        }

        const newPost = new Post({
            user:id,
            text:text,
            img:img
        })

        await newPost.save();

        return res.json({message:"Post created Successfully"});

    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal Server error"})
    }
}

const deletePost = async(req,res) =>
{
    try {
        const {id} = req.params;

        const post = await Post.findById(id)

        if(!post)
        {
            return res.json({error:"post not found"})
        }

        if(post.user.toString() !== req.user._id.toString())
        {
            return res.json({message:"You are  not authorised to delete this post"})
        }

        if(post.img)
        {
            const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
        }
        await Post.findByIdAndDelete(req.params.id)

        return res.json({message:"post deleted Successfully"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal Server error"})
    }
}

const commentOnPost = async(req,res) =>{
    try {
        const {text} = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if(!text)
        {
            return res.json({error:"text field is required"})
        }
        if(!post)
        {
            return res.json({error:"post not found"})
        }

        const comment = {user:userId,text}

        post.comments.push(comment)
        await post.save();

        return res.json(post)

    
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal Server error"})
    }
}

const likeUnlikePost = async(req,res) =>
{
    try {
        const userId = req.user._id;
        const postId = req.params.id;

        const post = await Post.findById(postId)

        if(!post)
        {
            return res.json({error:"post not found"})
        }

        const isLiked =  post.likes.includes(userId)

        if(isLiked)
        {
            //Unlike the post
            await Post.updateOne({_id:postId},{$pull:{likes:userId}})
            await User.updateOne({_id:userId},{$pull:{likedPosts:postId}})

            const updatedLikes = post.likes.filter((id)=>id.toString() !== userId.toString())

            return res.json(updatedLikes)
        }
        else{
            //like post
            post.likes.push(userId)

            await User.updateOne({_id:userId},{$push:{likedPosts:postId}})
            await post.save();

            const notification = new Notification(
            {
                from:userId,
                to:post.user,
                type:"like"
            })
            await notification.save()

            const updatedLikes = post.likes;
            return res.json(updatedLikes)
            
        }
    } catch (error) {

        console.log(error);
        return res.status(500).json({error:"Internal Server error"})
    }
}


const getAllPost = async(req,res) =>{
    try {
        const posts = await Post.find()
        .sort({createdAt:-1})
        .populate(
            {
                path:"user",
                select:"-password"
            }
        )
        .populate(
            {
                path:"comments.user",
                select:"-password"
            }
        )

        if(posts.length === 0)
        {
            return res.status(200).json([])
        }

        return res.status(200).json(posts)
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal Server error"})
    }
}

const getLikedPosts = async(req,res) =>
{
    try {
        const userId = req.params.id;

        const user = await User.findById(userId)
        if(!user)
        {
            return res.json({error:"user not found"})
        }

        const posts = await Post.find({_id:{$in:user.likedPosts}})
        .sort({createdAt:-1})
        .populate(
            {
                path:"user",
                select:"-password"
            }
        )
        .populate(
            {
                path:"comments.user",
                select:"-password"
            }
        )

        return res.status(200).json(posts)

    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal Server error"})
    }
}

const getFollowingPosts = async(req,res) =>
{
    try {
        const userId = req.user._id;
        const user = await User.findById(userId)
        if(!user)
        {
            return res.json({error:"user not found"})
        }

        const following = user.following

        const posts = await Post.find({user:{$in:following}})
        .sort({createdAt:-1})
        .populate(
            {
                path:"user",
                select:"-password"
            }
        )
        .populate(
            {
                path:"comments.user",
                select:"-password"
            }
        )

        return res.json(posts)
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal Server error"})
    }
}

const getUserPosts = async(req,res) =>
{
    try {
        const userName = req.params.userName;

        const user = await User.findOne({userName})

        const posts = await Post.find({user:user._id})
        .sort({createdAt:-1})
        .populate(
            {
                path:"user",
                select:"-password"
            }
        )
        .populate(
            {
                path:"comments.user",
                select:"-password"
            }
        )

        return res.json(posts)
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal Server error"})
    }
}
module.exports = {createPost,deletePost,commentOnPost,likeUnlikePost,getAllPost,getLikedPosts,getFollowingPosts,getUserPosts}