import express from "express";
import { addProduct, DeleteProduct, getAllProducts, UpdateProduct } from "../controller/ProductController.js";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import { multipleUpload } from "../middleware/multer.js";
const Productrouter=express.Router();


Productrouter.post('/add',isAuthenticated,isAdmin,multipleUpload,addProduct)
Productrouter.get('/getAllProducts',getAllProducts)
Productrouter.delete('/deleteProduct/:id',isAuthenticated,isAdmin,DeleteProduct)
Productrouter.put('/updateProduct/:id',isAuthenticated,isAdmin,multipleUpload,UpdateProduct)

export default Productrouter;