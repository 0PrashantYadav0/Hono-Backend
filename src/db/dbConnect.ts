import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }
    if(mongoose.connection.readyState === 1) return;
    await mongoose.connect(String(process.env.MONGO_URI));
    console.log("Database connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to database");
  }
}