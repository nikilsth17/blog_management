import mongoose from "mongoose";


export const dbConnect = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB connection OK...")
    } catch (error) {
        console.log("Db connection failed!!");
        console.log(error.message);
    }
}

