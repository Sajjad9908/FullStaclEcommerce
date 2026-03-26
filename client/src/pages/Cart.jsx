import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import profile from '../assets/profile.png'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Trash2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { setCart } from '@/redux/ProductSlice'

const Cart = () => {
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const { cart } = useSelector((state) => state.products)
  console.log(cart)
  const subTotal=cart.totalPrice
  const shipping= subTotal >299 ? 0 : 10

  const tax= subTotal * 0.05
  const total=subTotal + shipping + tax
  const accessToken=localStorage.getItem('accessToken')
  const handleUpdateQuantity=async(productId,type)=>{
      try {
        const res=await axios.put('http://localhost:8000/api/v1/cart/update', { productId, type },{
          headers:{
            Authorization:`Bearer ${accessToken}`
          }
        })
        if(res.data.success){
          dispatch(setCart(res.data.cart))
        }

      } catch (error) {
        console.log(error);
      }
  }
  const loadCart=async()=>{
    try {
      const res=await axios.get('http://localhost:8000/api/v1/cart',{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      })
      if(res.data.success){
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  useEffect(()=>{
    loadCart()
  },[dispatch])
  const handleRemove=async(productId)=>{
    try {
      const res= await axios.delete('http://localhost:8000/api/v1/cart/remove',{
        data:{ productId },
        headers:{
          Authorization:`Bearer ${accessToken}`
        },
       
      })
      if(res.data.success){
        console.log(res.data.cart)
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      console.log(error);
    }

  }
  
  return (
    <div className='pt-20 bg-gray-50 min-h-screen'>
      {
        cart?.items?.length > 0 ?
        
         <div className='max-w-7xl mx-auto '>
          <h1 className='text-2xl font-bold text-gray-800 mb-7'>Shopping Cart</h1>
          <div className='mx-auto flex flex-wrap gap-7'>
            <div className='flex flex-col gap-5 flex-1'>
              {cart.items.map((product,index)=>(
               <Card key={index} className='w-full'>
                <div className='flex justify-between items-center gap-3 pr-3 sm:pr-7'>
                  <div className='flex items-center gap-3 sm:gap-4 min-w-0 flex-1'>
                    <img src={product?.productId?.productImg[0]?.url || profile} alt="Product" className="w-16 h-16 sm:w-25 sm:h-25 object-cover rounded-md shrink-0" />
                    <div className='min-w-0'>
                      <h1 className='font-semibold truncate'>{product?.productId.productName}</h1>
                      <p className='text-gray-400 font-semibold'>${product?.productId.productPrice}</p>
                    </div>


               </div>
               <div className='flex gap-3 sm:gap-5 items-center shrink-0'>
                <Button variant='outline' onClick={()=>handleUpdateQuantity(product?.productId?._id,'decrement')}>-</Button>
                <span>{product.quantity}</span>
                <Button variant='outline' onClick={()=>handleUpdateQuantity(product?.productId?._id,'increment')}>+</Button>
               </div>
               <p className='whitespace-nowrap shrink-0'>${(product?.productId.productPrice)*(product.quantity)}</p>
               <p onClick={()=>handleRemove(product?.productId?._id)} className='flex text-red-400 items-center gap-1 cursor-pointer shrink-0'><Trash2 className='w-4 h-4'/>remove</p>

                </div>
               </Card>
              ))}
              </div>

              <div>
                <Card className='w-[350px]'>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='flex justify-between overflow-x-hidden'>
                      <span>Sub total {
                        cart?.items?.length
                        } items</span>
                        <span className='font-bold'>${cart?.totalPrice?.toLocaleString('en-US')}</span>

                    </div>
                    <div className='flex justify-between'>
                      <span>Shipping</span>
                      <span>$ {shipping}</span>
                    </div>
                      <div className='flex justify-between'>
                      <span>tax(5%)</span>
                      <span>$ {tax.toFixed(2)}</span>
                    </div> 
                    <Separator/>
                    <div className='flex justify-between font-bold text-lg '>
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                    </div>
                    <div className='space-y-4 pt-4'>
                      <div className='flex space-x-2'>
                        <Input placeholder='Promo code'/>
                        <Button variant='outline'>Apply</Button>
                      </div>
                      <Button onClick={()=>navigate('/address')} className='w-full bg-pink-600'>Place order</Button>
                      <Button className='w-full bg-transparent' variant='outline'><Link to='/products'>Continue Shopping</Link></Button>
                    </div>
                    <div className='text-sm text-muted-foreground pt-4'>
                      <p>* free shipping on orders over $299</p>
                      <p>* 30 Days return policy</p>
                      <p>* 24/7 Customer Support</p>
                      <p>* secure checkout with ssl encryption</p>
                    </div>
                  </CardContent>
                </Card>
                </div>
            </div>
           </div> 
           :<div className='flex flex-col items-center justify-center min-h-60vh p-6 text-center'>
            <div className='bg-pink-100 p-6 rounded-full'>
              <ShoppingCart className='w-12 h-12 text-pink-600'/>
               </div>
              
                <div>
                  <h1 className='mt-6 text-2xl font-bold text-gray-800'>Your cart is empty </h1>
                  <p className='text-gray-600 mt-2'>Looks like you haven't added anything to your cart yet.</p>
                  <Button variant='outline' className='bg-pink-600 text-white hover:bg-pink-500 mt-3 hover:text-white py-3 px-6 cursor-pointer'><Link to='/products'>Start Shopping</Link></Button>
             
             
              </div>
            
            
           </div>
      }
       </div>
      
     
  )
}

export default Cart