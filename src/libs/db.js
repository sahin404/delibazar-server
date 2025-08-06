import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const dbConnect = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Database Connect Successfully!');
    }
    catch(err){
        console.log('An error occured to connect mondodb. Message: ', err.message);
    }
}
