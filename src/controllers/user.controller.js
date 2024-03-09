import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import {User} from "../models/user.model.js"

const registerUser = asyncHandler(async (req, res) => {

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

   const { fullName, email, username, password } = req.body
   console.log("email: ", email);

   //validation
   if (
      // you can also use checking one by one but using some() is faster
      // now if even one field is empty, it will return true in that place

      [fullName, email, username, password].some((field) => field?.trim() === "")
   ) {
      throw new ApiError(400, "All fields are required")
   }

   //checking if user already exist
   const existedUser = User.findOne({
      // we can use operators like this using $ sign
      // now it will return first document which matches
      $or: [{username}, {email}]
   })

if(existedUser){
   throw new ApiError(409, "User with email or username already exist")
}


})




export { registerUser }

