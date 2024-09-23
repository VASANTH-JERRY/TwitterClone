const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js')

const protectedRoute = async(req,res,next) =>
{
    try {
    const token = req.cookies.jwt
    if(!token)
    {
        return res.json({error:"Authenticate token error"})
    }
    const decode = jwt.verify(token,process.env.JWT_SECRET);

    if(!decode)
    {
        return res.json({error:"Invalid token error"})
    }

    const user = await User.findById(decode.userId).select("-password")

    if(!user)
        {
            return res.json({error:"User not exist"})
        }
    
    req.user = user;
    next()
        
    } catch (error) {
        console.error(error)
        return res.json({error:"Internal Server Error"})
    }
}

module.exports = {protectedRoute}