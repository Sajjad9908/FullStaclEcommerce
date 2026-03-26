import React from 'react'
import { Button } from './button'
import image from '../../assets/mobile.png'

const Hero = () => {
  return (
 <>
 <section className='bg-gradient-to-r from-blue-600 to-purple-600 text-white py-24'>
 <div className='max-w-7xl mx-auto px-4'>
    <div className='grid md:grid-cols-2 gap-8 items-center '>
        <div>
            <h1 className='text-4xl md:text-6xl font-bold mb-3'>Latest Electronics at best prices</h1>
            <p className='text-xl mb-6 text-blue-100'>Discover cutting-edge technology with unbeatable deals on smart Phones,laptos and more.</p>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Button className='bg-white text-blue-600 hover:bg-gray-100 transition duration-300'>Shop Now</Button>
              <Button variant='outline' className='border-white text-white hover:bg-white hover:text-blue-600 bg-transparent'>View deals</Button>
            </div>
        </div>
        <div className='relative'>
            <img src={image} alt="Hero Image" width={500} height={400} className='mt-3 rounded-lg shadow-2xl'/>
        </div>
    </div>
 </div>
 </section>
 </>
  )
}

export default Hero