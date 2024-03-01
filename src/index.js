// require('dotenv').config()
import dotenv from "dotenv"
import express from "express"
import connectDB from "./db/index.js";

dotenv.config({
    // we're saying env file is in our root directory
    path: './.env'
})


connectDB();






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