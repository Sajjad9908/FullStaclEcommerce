import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setCart } from '@/redux/ProductSlice'

const ProductDesc = ({product}) => {
  console.log(product)
  const dispatch=useDispatch()
 
  const token=localStorage.getItem('accessToken')
   const addToCart=async(productId)=>{
    try {
      const res=await axios.post('https://full-stacl-ecommerce.vercel.app/api/v1/cart/add',{productId},{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      if(res.data.success){
        toast(res.data.message)
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      console.log(error);
      console.log(error.message);
    }
   }
  return (
    <div className='flex flex-col gap-2'>
        <h1 className="font-bold text-4xl text-gray-800"> {product.productName}</h1>
        <p className='text-gray-800'>{product.category} | {product.brand}</p>
        <h2 className='text-2xl font-bold mt-2.5 text-pink-600'>${product.productPrice.toFixed(2)}</h2>
        <p className='lineclamp-12 text-muted-foreground'>{product.productDesc}</p>
        <div className="flex gap-2 items-center w-[300px]">
            <p className='text-gray-800 font-semibold'>Quantity:</p>
            <Input type='number' className="w-14" defaultValue={1}/>
        </div>
        <Button className='bg-pink-600 w-max ' onClick={() => addToCart(product._id)}>Add to Cart</Button>
       
    </div>
  )
}

export default ProductDesc