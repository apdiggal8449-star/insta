import mongoose from "mongoose";

const connectDb = async () => {
  try {
    console.log("MONGO_URL =", process.env.MONGO_URL); // 👈 DEBUG
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.log("❌ not connected", error.message);
  }
};

export default connectDb;
