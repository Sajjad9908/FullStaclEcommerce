import React, { use } from 'react'
import { Button } from './ui/button'
import { ShoppingCart } from 'lucide-react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setCart } from '@/redux/ProductSlice'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const ProductCart = ({product,loading}) => {
  const dispatch=useDispatch()
  const navigate=useNavigate()
  
    const {productName,category,productPrice,productImg,_id}=product

    console.log(product)
      const token=localStorage.getItem('accessToken')

       const AddtoCart=async(productId)=>{
        console.log(productId,'button hit');
      try {
        const res=await axios.post('http://localhost:8000/api/v1/cart/add',{productId},{
          headers:{
            Authorization:`Bearer ${token}`
          }
        })
       if(res.data.success){
        toast.success(res.data.message)
        dispatch(setCart(res.data.cart))
       }
      } catch (error) {
        console.log(error);
        toast.error('Failed to add to cart')
      }
    }
  return (
    <>
    
   
    <div className='shadow-lg rounded-lg overflow-hidden h-max relative'>
       
        <div className='w-full h-full aspect-square'>
      <img onClick={()=>navigate(`/product/${_id}`)}
      src={productImg[0]?.url}
       className=' w-full h-full transition-transform duration-300 hover:scale-105'/>
     </div>
     <div className='px-2 space-y-1'>
        <h1 className='font-semibold h-12 line-clamp-2'>{productName}</h1>
        <h2 className='font-bold'>${productPrice}</h2>
        <Button className='bg-pink-600 w-full mb-3' onClick={()=>AddtoCart(product._id)}> <ShoppingCart/>Add to Cart</Button>
    </div>
    </div>
    </>
  )
}

export default ProductCart