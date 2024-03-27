import { v2 as cloudinary } from "cloudinary"
import fs from "fs"


//configuring
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});



//uploading

const uploadOnCloudinary = async (localFilePath) => {
    try {

        if (!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //file had been uploaded successfully
        // console.log("File is uploaded on cloudinary", response.url);
        
        // we will still remove the file from public/temp if successfully sent to cloudinary
        fs.unlinkSync(localFilePath)

        return response
    } catch (error) {
        //removing file from server in case of error because it may cause the error.
        fs.unlinkSync(localFilePath) //remove locally saved temporary file
        return null;

    }
}


export {uploadOnCloudinary}