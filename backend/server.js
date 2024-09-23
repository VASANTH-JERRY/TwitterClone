const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const cors = require("cors")
const cloudinary = require("cloudinary")

const authRoutes = require("./routes/auth.routes.js")
const userRoutes = require("./routes/user.routes.js")
const postRoutes = require("./routes/post.routes.js")
const notificationRoutes = require("./routes/notification.routes.js")

cloudinary.config(
    {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key : process.env.CLOUDINARY_API_KEY,
        api_secret : process.env.CLOUDINARY_API_SECRET
    }
)


app.use(express.json({limit:'25mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors())


app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);
app.use("/api/post",postRoutes);
app.use("/api/notification",notificationRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Database Connected Successfully"))
.catch((err)=>console.log("Error in Database Connection"))

app.listen(process.env.PORT,()=>console.log(`Server is running at port ${process.env.PORT}`))
