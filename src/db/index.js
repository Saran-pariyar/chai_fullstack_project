import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {

        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        // we use connection object to ensure we're using right DB, there is different DB for production, testing, etc. We'll find out which host we're connected to
        console.log(`\n MongoDB connected!! DB Host: ${connectionInstance.connection.host}`);

    }
    catch (error) {
        console.log('MONGODB connection error', error);
        process.exit(1)
    }
}

export default connectDB;