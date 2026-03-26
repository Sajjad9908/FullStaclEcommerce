import express from 'express';
import 'dotenv/config';
import connectDB from './dbconfig/dbconfig.js';
import router2 from './Routes/UserRoute.js';
const app=express();
const PORT=process.env.PORT || 5000;
import cors from 'cors';
import Productrouter from './Routes/ProductRoute.js';
import multer from 'multer';
import cartRoute from './Routes/CartRoute.js';
import orderRoute from './Routes/OrderRoute.js';

app.use(cors({
    origin:'http://localhost:5173',
    methods:['GET','POST','PUT','DELETE'],
    credentials:true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/v1/user',router2);
app.use('/api/v1/product',Productrouter)
app.use('/api/v1/cart',cartRoute)
app.use('/api/v1/orders',orderRoute)



 await connectDB();

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})


