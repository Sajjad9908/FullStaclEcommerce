import Cart from "../model/CartModel.js"
import Product from "../model/ProductModels.js"

export const getAllCartItems=async(req,res)=>{
    try {
        const userId=req.id
        const cart=await Cart.findOne({userId}).populate('items.productId')
        if(!cart){
            return res.json({
                success:true,
                cart:[]
            })
        }
        return res.status(200).json({
            success:true,
            message:'Cart items retrieved successfully',
            cart
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message || 'Failed to fetch cart items'
        })
    }
}

export const addToCart=async(req,res)=>{
    try {
        const userId=req.id
        const {productId}=req.body

        const product=await Product.findById(productId)
        if(!product){
            return res.status(404).json({
                success:false,
                message:'Product not found'
            })
         }

         let cart=await Cart.findOne({userId})
         if(!cart){
            cart=new Cart({
                userId,
                items:[{
                    productId,
                    quantity:1,
                    price:product.productPrice
                }]
            })
         }
         else{
            const itemIndex=cart.items.findIndex(item=>item.productId.toString()===productId)
            if(itemIndex>-1){
                cart.items[indexItem].quantity+=1
            }
            else{
        cart.items.push({
            productId,
            quantity:1,
            price:product.productPrice
        })

         }
        }
        
        cart.totalPrice=cart.items.reduce((total,item )=>total+item.price*item.quantity,0)
        await cart.save()
        const populatedCart=await Cart.findById(cart._id).populate('items.productId')
        return res.status(200).json({
            success:true,
            message:'Item added to cart successfully',
            cart:populatedCart
        })
        
    }
    catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message || 'Failed to add item to cart'
        })
    }

}

export const UpdateQuantity=async(req,res)=>{
    try {
         const userId=req.id
         const {productId,type}=req.body
         console.log(productId,type)
         console.log('cart route hit')

         let cart=await Cart.findOne({userId})
         if(!cart) return res.status(404).json({   success:false,message:'Cart not found'})
            const item= cart.items.find(item=>item.productId.toString()===productId)
            if(!item) return res.status(404).json({   success:false,message:'Product not found in cart'})

                if(type==='increment'){
                    item.quantity+=1
                }
                 if(type==='decrement' && item.quantity>1){
                    item.quantity-=1
                }
                   
                cart.totalPrice= cart.items.reduce((total,item)=>total+item.price*item.quantity,0)
                 await cart.save()
    
              const populatedCart=await cart.populate('items.productId')
              return res.status(200).json({
                success:true,
                message:'Cart item quantity updated successfully',
                cart:populatedCart
              })
         }
     catch (error) {
        res.status(500).json({
            success:false,
            message:error.message || 'Failed to update cart item quantity'
        })
    }
}

export const removeFromCart=async(req,res)=>{
    try {
        const userId=req.id
        const {productId}=req.body
        const cart=await Cart.findOne({userId})
        if(!cart) return res.status(404).json({   success:false,message:'Cart not found'})
        
       cart.items=cart.items.filter(item=>item.productId.toString()!==productId)

       cart.totalPrice=cart.items.reduce((total,item)=>total+item.price*item.quantity,0)
         await cart.save()
         const populatedCart=await cart.populate('items.productId')

         res.status(200).json({
            success:true,
            message:'Item removed from cart successfully',
                cart:populatedCart
         })
        
    }
        catch (error) {
        res.status(500).json({
            success:false,
            message:error.message || 'Failed to remove item from cart'
        })
    }
        }