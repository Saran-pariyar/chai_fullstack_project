import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser  = asyncHandler(async(req,res)=>{

   res.status(200).json({
    message: "user registered"
   })



/*
ALGORITHM FOR REGISTER USER

Steps:

- Get user details from frontend
- validation - not empty
- check if user already exists: username, email
- check for images, check for avatar
- upload them to cloudinary, avatar
- create user object - create entry in db
- remove password and refresh token field from response
- check for user creation
- return response

*/

// we need to get data first. We get these data from request's body from the form when they send these data

const {fullName, email, username, password} = req.body
console.log("email: ", email);


})




export {registerUser}

