// require('dotenv').config()
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    // we're saying env file is in our root directory
    path: './.env'
})



connectDB().then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at port: ${process.env.PORT}`);
    });
    
    // if error comes
    app.on("error", (error)=>{
        console.log("Server Error: ", error);
    })
}

).catch((error)=>{
console.log("MONGO db connection failed!!! ", error);
})






/*
//FIRST APPROACH TO CONNECT TO DATABASE
    ; (async () => {
        try {
            await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

            app.on("error", (error) => {
                console.log("Err: ", error);
                throw error
            })
            app.listen(process.env.PORT, () => {
                console.log(`App is listening on port ${process.env.PORT}`);
            })
        } catch (error) {
            console.log("Error: ", error);
            throw error
        }
    })()

    */