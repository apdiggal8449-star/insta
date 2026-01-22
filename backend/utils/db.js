import mongoose from "mongoose";

const connectDB = async () => {
    const mongoURI = process.env.MONGO_URL;
    console.log('MONGO_URL =', mongoURI); // check karo kya aa raha hai

    if (!mongoURI) {
        console.error("❌ MONGO_URL is undefined. Check your .env file!");
        return;
    }

    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            family:4,
        });
        console.log('✅ MongoDB connected successfully.');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
    }
};

export default connectDB;
