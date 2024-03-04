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
        console.log("File is uploaded on cloudinary", response.url);

        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)

    }
}

cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
    { public_id: "olympic_flag" },
    function (error, result) { console.log(result); });