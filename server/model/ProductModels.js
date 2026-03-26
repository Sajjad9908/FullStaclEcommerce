import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    productName: {
      type: String,
      required: true,
    },
    productDesc: {
      type: String,
      required: true,
    },
    productImg: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    productPrice: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
    },
    brand: {
      type: String,
    },
  },
  { timestamps: true },
);


const Product=mongoose.model('Product',productSchema)
export default Product;
