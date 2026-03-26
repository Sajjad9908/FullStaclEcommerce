import express from 'express';
import 'dotenv/config';
import connectDB from './dbconfig/dbconfig.js';
import router2 from './Routes/UserRoute.js';
const app=express();
const PORT=process.env.PORT || 5000;
import cors from 'cors';
import Productrouter from './Routes/ProductRoute.js';
import cartRoute from './Routes/CartRoute.js';
import orderRoute from './Routes/OrderRoute.js';

const allowedOrigins = [
  'https://full-stacl-ecommerce-vlbf.vercel.app', // frontend (no trailing slash)
  'http://localhost:5173',
];
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/v1/user',router2);
app.use('/api/v1/product',Productrouter)
app.use('/api/v1/cart',cartRoute)
app.use('/api/v1/orders',orderRoute)

await connectDB();

if (!process.env.VERCEL) {
    app.listen(PORT,()=>{
        console.log(`Server is running on http://localhost:${PORT}`);
    })
}

export default app;


