import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


//creating function to generate tokens
const generateAccessAndRefreshTokens = async(userId) =>{
   try{
      const user = await User.findById(userId)
      // we get these methods from user model
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      // in our user model, we have a property name refreshToken, it will have string as value. 
      //We will generate a refresh token here, and assign that value to the that refreshToken properties in user model
      user.refreshToken = refreshToken
      // we get this save() method from mongodb
      // when we run save, the whole model will be retriggered, and we've put "required" in password property in model
      //to make sure it doesn't check for that when we use the save(), we make that validation check false

      await user.save({validateBeforeSave: false})

      return {accessToken, refreshToken}
   }
   catch(error){
throw new ApiError(500, "Something went wrong while generating refresh and access token")
   }
}

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

// login
const loginUser = asyncHandler(async(req,res)=>{
//steps
// 1 get data from req.body
// 2 check using username or email
// 3 find the user
// 4 password check
// 5 generate access and refresh token
// 6 send cookie


  // 1
  const { email, username, password } = req.body

  // if we don't get either username or email 
  if (!username || !email) {
     throw new ApiError(400, "username or password is required")
  }

  //checking 
  // we use $or operator given my Mongodb, now it check from username and email
  const user = await User.findOne({
     $or: [{ username }, { email }]
  })

  if (!user) {
     throw new ApiError(404, "User does not exist")
  }

  // see the user.model.js, we've added the method to check password.
  // we got this argument password from req.body
  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
     throw new ApiError(401, "Invalid user credentials")
  }

  //5. Generate tokens 

  // now finally generating token after every check it done
  //this function will return access and refresh token, so we destructure it
  const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

  //6. sending through cookie
  // now we decide what information to user. we'll filter out these two
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

})

export { registerUser,
loginUser }

