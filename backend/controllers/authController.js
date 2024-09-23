const User = require('../models/userModel.js');
const { generateTokenandSaveCookies } = require('../utilities/generateToken.js');
const bcrypt = require('bcryptjs');

const signup = async (req, res) => {
    try {
        const { fullName, userName, email, password } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        const existingEmail = await User.findOne({ email });

        if (existingEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }
        const existingUser = await User.findOne({ userName });

        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }


        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            userName,
            email,
            password: hashedPassword,
        });


        if (newUser) {
            generateTokenandSaveCookies(newUser._id, res);
            await newUser.save();

            res.status(200).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.userName,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
            });
        } else {
            return res.status(400).json({ error: "Invalid user data" });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server error" });
    }
};

const login = async (req,res) => {

    try {
    
        const {userName,password} = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // if (!emailRegex.test(email)) {
        //     return res.status(400).json({ error: "Invalid email format" });
        // }

        const user = await User.findOne({userName})

        if(!user)
        {
            return res.status(400).json({error:"User not exists"})
        }

        const isCorrectPassword = await bcrypt.compare(password,user.password)

        if(!isCorrectPassword)
        {
            return res.status(400).json({error:"invalid Password"})
        }

        generateTokenandSaveCookies(user._id, res);

        return res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.userName,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
        })

        
    } catch (error) {
            console.error(error)
            return res.json({error:"Internal Server Error"})
    }
    
}

const logout = async(req,res) =>{
    try {
        res.cookie("jwt", "", {maxAge:0})
        res.status(200).json({message:"Logged out Successfully"})
    } catch (error) {
        console.error(error)
        return res.json({error:"Internal Server Error"})
    }
}

const getMe = async(req,res)=>{
    try {
        const user = await User.findById(req.user._id).select("-password");
        return res.status(200).json(user)
    } catch (error) {
        console.error(error)
        return res.json({error:"Internal Server Error"})
    }
    

}


module.exports = { signup, login,logout,getMe };
