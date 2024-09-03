import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    const c = await mongoose.connect(process.env.MONGO_URI);
    console.log(`mongodb connected ${c.connection.host}`);
  } catch (error) {

console.log('mongodb connection error',error)  }

};
