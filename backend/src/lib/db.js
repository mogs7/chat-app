import mongoose from "mongoose";

// a function that connects to the database
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`); 
    } catch (error) {
        console.log("MondogDB connection error: ", error);   
    }
}; 