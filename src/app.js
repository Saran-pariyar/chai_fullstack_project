import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// setting limit of how much size of json we can receive
app.use(express.json({limit:"16kb"}))

app.use(express.urlencoded({extended:true, limit:"16kb"}))

app.use(cookieParser())

//routes import
import userRouter from './routes/user.routes.js'

//we'll be using middleware to ge routes
//routes 
//now whenever we are on "/users", it will give control to userRouter
app.use("/api/v1/users", userRouter)

export {app}