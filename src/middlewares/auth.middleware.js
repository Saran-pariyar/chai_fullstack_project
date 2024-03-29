import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Jwt as jwt } from "jsonwebtoken";

// this middleware checks if we're authenticated or not
export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        //in app.js, we have given cookieParser middleware  so we can access any cookie
        // we've created cookie in the user controller in which we've returned status(200)

        // we check using header too because user may send using mobile phone too.
        // see www.jwt.io/introduction to see why we use "Authorization". It's because its the syntax
        // we get data like this "Bearer <token>", that's why we remove "Bearer" using replace.
        // if we're logged In, we will have this token in cookie, so we're checking that
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")

        // if token dones'doesn't exist
        if (!token) {
            throw new ApiError(401, 'Unauthorized request')

        }
        // 
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        // see the user model, Access token has _id, email, username and fullName so we _id here
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }

        // after every checks, we will send the data of user to the logout
        req.user = user;
        // in user.route, you can see there is verifyJWT and after that, there is logoutUser, when this verifyJWT is done, next() means move to another middleware now
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})