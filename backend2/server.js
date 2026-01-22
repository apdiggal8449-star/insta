import express from 'express';
import connectDb from './config/db.js';
import dotenv from 'dotenv';
 
dotenv.config();
 const app =express();

const port =process.env.PORT || 6433;

connectDb();
app.listen(port,()=>{
    console.log(`server running ${port}`);
})