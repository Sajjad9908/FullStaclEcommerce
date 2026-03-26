import { json } from "express";
import Product from "../model/ProductModels.js";
import cloudinary from "../utils/Cloudinary.js";
import getDataUri from "../utils/dataUri.js";



export const addProduct=async(req,res)=>{
    try {
        const {productName,productDesc,productPrice,category,brand}=req.body;
        const userId=req.id;
        if(!productName || !productDesc || !productPrice){
            return res.status(400).json({
                success:false,
                message:'Please provide all required fields'
            })
        }

        // handle multiple images uploads
        let productImg=[];
        if(!req.files || req.files.length===0){
            return res.status(400).json({
                success:false,
                message:'Please upload at least one product image in files field'
            })
        }

        for (let file of req.files) {
            const fileUri= getDataUri(file)
            const result= await cloudinary.uploader.upload(fileUri.content,{
                folder:'mern_products'
            })
            productImg.push({
                url:result.secure_url,
                publicId:result.public_id
            })
        }

        const product=await Product.create({
            userId,
            productName,
            productDesc,
            productPrice,
            category,
            brand,
            productImg
        })
        return res.status(201).json({
            success:true,
            message:'Product added successfully',
            product
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message || 'Failed to add product'
        })
    }
}

export const getAllProducts=async(req,res)=>{
    try {
        const products=await Product.find()
        if(!products || products.length===0){
            return res.status(404).json({
                success:false,
                message:'No products found'
            })
        }
        return res.status(200).json({
            success:true,
            message:'Products retrieved successfully',
            products
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const DeleteProduct=async(req,res)=>{
    try {
        const productId=req.params.id;
        console.log('Product ID to delete:', productId); // Debugging log
        const product=await Product.findById(productId);
        if(!product){
            return res.status(404).json({
                success:false,
                message:'Product not found'
            })
        }
            // delete images from cloudinary
            if(product.productImg && product.productImg.length>0){
                for (let img of product.productImg) {
                    const result=await cloudinary.uploader.destroy(img.publicId);
                    
                }

            }
            await Product.findByIdAndDelete(productId);
            return res.status(200).json({
                success:true,
                message:'Product deleted successfully'
            })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const UpdateProduct=async(req,res)=>{
    try {
        const productId=req.params.id;
        console.log('Product ID:', productId); // Debugging log
        const {productName,productDesc,productPrice,category,brand,existingImages}=req.body;
        const product=await Product.findById(productId);
        if(!product){
            return res.status(404).json({
                success:false,
                message:'Product not found'
            })
        }
        // handle new image uploads
         let updatedImages=[]
        if(existingImages){
            console.log('Existing Images:', existingImages); // Debugging log
            console.log(typeof(existingImages)); // Debugging log
            const keepIds=JSON.parse(existingImages)
            updatedImages=product.productImg.filter(img=>keepIds.includes(img.publicId))

            const removedImages=product.productImg.filter(img=>!keepIds.includes(img.publicId))

            for (let img of removedImages) {
                await cloudinary.uploader.destroy(img.publicId)
            }
        }
        else{
            updatedImages=product.productImg;
        }
        if(req.files && req.files.length>0){
            for (let file of req.files) {
                const fileUri=getDataUri(file)
                const result=await cloudinary.uploader.upload(fileUri.content,{
                    folder:'mern_products'
                })
                updatedImages.push({
                    url:result.secure_url,
                    publicId:result.public_id
                })
        }}
        product.productName=productName || product.productName;
        product.productDesc=productDesc || product.productDesc;
        product.productPrice=productPrice || product.productPrice;
        product.category=category || product.category;
        product.brand=brand || product.brand;
        product.productImg=updatedImages;
        await product.save();
        return res.status(200).json({
            success:true,
            message:'Product updated successfully',
            product
        })
    
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message || 'Failed to update product'
        })      
    }
}