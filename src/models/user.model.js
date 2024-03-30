import mongoose, { Schema } from "mongoose";
// import { jwt } from "jsonwebtoken";
import jwt from "jsonwebtoken";

import bcrypt from "bcrypt"

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, // cloudinary url
        required: true,
    },
    coverImage: {
        type: String,
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken: {
        type: String
    }

},
    {
        timestamps: true
    }
)

// it is a mongoose middleware to run just before sending data to db. See more Middleware types in mongoose docs
// we cannot use arrow function here as it may cause error. It may take time to encrypt it so we make it async
userSchema.pre("save", async function (next) {

    //we check and run this only if password is modified or else it will change password hash with everytime with this middleware
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)


    next()
})

//this method checks the password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

// we can just use access token too but using 2 token is a modern approach
// Access token are expired in short time 
// Refresh token are expired in long time 

// we give access token to user but we keep refresh token in database too so that we don't have to ask for password all the time to user
userSchema.methods.generateAccessToken = function () {
    
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName
    },

        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {

    return jwt.sign({
        _id: this._id,

    },

        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema)