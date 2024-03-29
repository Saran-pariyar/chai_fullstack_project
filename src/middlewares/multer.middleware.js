import multer from "multer";

//copy pasting this code template from multer github docs
const storage = multer.diskStorage({

  //cb means callback
  destination: function (req, file, cb) {
    //that second parameter is location of where we will keep the file
    // we request images from multer and keep in this path for temporary
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {

    cb(null, file.originalname)
  }
})

export const upload = multer({
  storage,
})

// learn more about multer from it's docs