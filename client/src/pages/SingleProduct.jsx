import BreadCrumbs from '@/components/BreadCrumbs'
import ProductDesc from '@/components/ProductDesc'
import ProductImage from '@/components/ProductImage'
import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const SingleProduct = () => {
    const params=useParams()
    const productId=params.id
    const {products}=useSelector(state=>state.products)

    const product=products.find(item=>item._id===productId)
    
  return (
    <div className='pt-20 py-10 max-w-7xl mx-auto'>
        <BreadCrumbs product={product}/>
        <div className='mt-10 grid px-3 grid-cols-1 md:grid-cols-2 md:px-0 items-start'>
            <ProductImage images={product.productImg}/>
            <ProductDesc product={product}/>
        </div>
    </div>
  )
}

export default SingleProduct