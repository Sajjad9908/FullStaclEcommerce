import mongoose from "mongoose";
import 'dotenv/config';


const connectDB = async () => {
try {
await mongoose.connect(process.env.MONGOOSE_URL);
console.log("MongoDB connected successfully");
} catch (error) {
    console.error("Error connecting to MongoDB:", error);
}
}

export default connectDB;