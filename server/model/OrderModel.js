import mongoose from "mongoose";
const orderSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    products:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Product',  
                required:true
            },
            quantity:{
                type:Number,
                required:true,
              
            },
            price:{
                type:Number,
                required:true
            }
        }
    ],
    amount:{
        type:Number,
        required:true
    },
    tax:{
        type:Number,
        required:true
    },

    shipping:{
        type:Number,
        required:true
    },
    currency:{
        type:String,
        required:true,
        default:'PKR'
    },
    status:{
        type:String,
        enum:['pending','confirmed','shipped','delivered','completed','cancelled'],
        default:'pending'
    },
    paymentMethod:{
        type:String,
        enum:['cod','jazzcash','easypaisa','bank_transfer','card'],
        default:'cod'
    },
    paymentStatus:{
        type:String,
        enum:['pending','initiated','paid','failed','refunded'],
        default:'pending'
    },
    gatewayOrderId:{
        type:String
    },
    gatewayPaymentId:{
        type:String
    },
    gatewaySignature:{
        type:String
    },
    transactionId:{
        type:String
    },
    shippingAddress:{
        fullName:{ type:String, required:true },
        phone:{ type:String, required:true },
        email:{ type:String, required:true },
        address:{ type:String, required:true },
        city:{ type:String, required:true },
        state:{ type:String, required:true },
        zip:{ type:String, required:true },
        country:{ type:String, required:true }
    },
    paymentMeta:{
        type:mongoose.Schema.Types.Mixed,
        default:{}
    },
    notes:{
        type:String
    }
},{timestamps:true})
export default mongoose.model('Order',orderSchema)  
