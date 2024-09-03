import express from 'express'
import { configDotenv } from 'dotenv';
import authRoutes from './routes/auth.route.js'
import { dbConnect } from './lib/db.js';
import cookieParser from 'cookie-parser';
import productRoutes from './routes/product.route.js'

configDotenv({
    path:'.env'
})
const app=express();
app.use(express.json());
app.use(cookieParser())
const PORT=process.env.PORT || 5000;

app.use('/api/auth',authRoutes)
app.use('/api/products',productRoutes)


app.listen(PORT, (req,res)=>{
    console.log(`app listen at port ${PORT}`);
    dbConnect();
})