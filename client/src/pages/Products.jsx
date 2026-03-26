import FilterSidebar from '@/components/FilterSidebar'
import React, { useEffect, useState } from 'react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ProductCart from '@/components/ProductCart'
import { toast } from 'sonner'
import axios from 'axios'
import { Skeleton } from '@/components/ui/skeleton'
import { useDispatch, useSelector } from 'react-redux'
import { setCart, setProductData } from '@/redux/ProductSlice'



   



const Products = () => {
  const {products}=useSelector((state)=>state.products)
 
  const dispatch=useDispatch()
  const[product,setProduct]=useState([])
   const[loading,setLoading]=React.useState(false)
   const[search,setSearch]=useState('')
   const[category,setCategory]=useState('All')
   const[brand,setBrand]=useState('All')
   const[error,setError]=useState(false)
   const[priceRange,setPriceRange]=useState([0,999999])
   const [sortOrder,setSortOrder]=useState('')
   

    const getAllProducts=async()=>{
        try {
        setError(false)
            setLoading(true)
            const res=await axios.get('http://localhost:8000/api/v1/product/getAllProducts')
            if(res.data.success){
                setProduct(res.data.products)
                dispatch(setProductData(res.data.products))
                
                toast.success('data received success Fully')
        } else {
          setError(true)
          toast.error(res.data.message || 'Failed to fetch products')
            }
        } catch (error) {
            console.log(error);
        setError(true)
        const message = error?.response?.data?.message || error?.message || 'Failed to fetch products'
        toast.error(message)
          
        }
        finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
      if(product.length===0){
        return}
          let filteredProducts=[...product]  
        if(search.trim()!==''){
         filteredProducts=filteredProducts.filter((p)=>p.productName.toLowerCase().includes(search.toLowerCase()))
        
        }  
        
        if(category!=='All'){
          filteredProducts=filteredProducts.filter((p)=>p.category===category)
        }
        if(brand!=='All'){
          filteredProducts=filteredProducts.filter((p)=>p.brand===brand)
        }
        filteredProducts=filteredProducts.filter((p)=>p.productPrice>=priceRange[0] && p.productPrice<=priceRange[1])
       
        if(sortOrder==='lowToHigh'){
          filteredProducts.sort((a,b)=>a.productPrice-b.productPrice)
        }
        else if(sortOrder==='highToLow'){
          filteredProducts.sort((a,b)=>b.productPrice-a.productPrice)
        } 
        dispatch(setProductData(filteredProducts))
    },[search,category,brand,priceRange,sortOrder,product,dispatch])

    useEffect(()=>{
        getAllProducts()
    },[])
   
 
  return (

   
        <div className='pb-10 pt-20'>
            <div className='max-w-7xl mx-auto flex gap-7'>
             <FilterSidebar product={product} priceRange={priceRange}
             setPriceRange={setPriceRange}
             search={search}
             setSearch={setSearch}
             
             category={category}
             setCategory={setCategory}
             brand={brand}
              setBrand={setBrand}
             />
             {/* product main section */}
             <div className='flex flex-col flex-1'>
               <div className='flex justify-end'>
                 <Select onValueChange={(value)=>setSortOrder(value)}>
      <SelectTrigger className="w-full max-w-55">
        <SelectValue placeholder="Sort by Price" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          
          <SelectItem value="lowToHigh">Price low to high</SelectItem>
          <SelectItem value="highToLow">Price high to low</SelectItem>
           
        </SelectGroup>
      </SelectContent>
    </Select>
 
                </div>
               
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7 mt-5'>
                  {error && (<div className='flex item-center justify-between'>
                    <h1 className='text-red-500 text-lg'>Something went wrong</h1>

                    
                     </div>)}
                   
                    {loading
                       ? Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className='shadow-lg bg-gray-400 rounded-lg overflow-hidden'>
                    <Skeleton className='w-full aspect-square' />
                    <div className='px-2 py-2 space-y-2'>
                      <Skeleton className='h-4 w-4/5' />
                      <Skeleton className='h-4 w-1/3' />
                      <Skeleton className='h-9 w-full' />
                    </div>
                  </div>
                ))
                    
                   
                    :
                        products.filter(Boolean).map((item)=>(
                            <div key={item._id}>
                               <ProductCart product={item} loading={loading}/>
                            </div>
                        ))
                    }
                    </div>
            
                
            

            </div>
             </div>
             </div>
       
 
  )
}

export default Products