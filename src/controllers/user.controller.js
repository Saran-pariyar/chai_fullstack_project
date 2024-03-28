import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
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
   // console.log("email: ", email);

   //validation
   if (
      // you can also use checking one by one but using some() is faster
      // now if even one field is empty, it will return true in that place

      [fullName, email, username, password].some((field) => field?.trim() === "")
   ) {
      throw new ApiError(400, "All fields are required")
   }

   //checking if user already exist
   const existedUser = await User.findOne({
      // we can use operators like this using $ sign
      // now it will return first document which matches
      $or: [{username}, {email}]
   })

if(existedUser){
   throw new ApiError(409, "User with email or username already exist")
}

// we get ".files" because of multer
const avatarLocalPath = req.files?.avatar[0]?.path;
// const coverImageLocalPath = req.files?.coverImage[0]?.path;

//checking coverImage exist or not
let coverImageLocalPath;
if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
   coverImageLocalPath = req.files.coverImage[0].path;
}


//checking
if (!avatarLocalPath){
throw new ApiError(400, "Avatar file is required")
}

// if cloudinary doesn't find an image, it will return empty string
const avatar = await uploadOnCloudinary(avatarLocalPath)
const coverImage = await uploadOnCloudinary(coverImageLocalPath)

if (!avatar){
   throw new ApiError(400, "Avatar file is required")
}

//create an user object and send to database
const user = await User.create({
   fullName,
   avatar: avatar.url,
   // some people don't give cover image
   coverImage: coverImage?.url || "",
   email,
   password,
   username: username.toLowerCase()
})

//checking user collection
// in select, we mean don't include/return password and refreshToken
const  createdUser = await User.findById(user._id).select("-password -refreshToken")

if (!createdUser){
   
   throw new ApiError(500, "Something went wrong while registering the user")
}

// Return response
return res.status(201).json(
//user ApiResponse for more structured way
   new ApiResponse(200, createdUser, "User registered successfully")

)

})




export { registerUser }

