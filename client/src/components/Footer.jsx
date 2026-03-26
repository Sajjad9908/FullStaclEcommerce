import React from 'react'
import image from '../assets/logo.png'
import { Link } from 'react-router-dom'
import { TiSocialFacebookCircular } from "react-icons/ti";
import { FaInstagram } from "react-icons/fa";
import { CiTwitter } from "react-icons/ci";
import { CiLinkedin } from "react-icons/ci";

const Footer = () => {
  return (
    <>
   <footer className='bg-gray-900 text-gray-200 py-10'>
    <div className='max-w-7xl mx-auto px-4 md:flex md:justify-between pt-3'>

        <div className='mb-6 md:mb-0'>
            <Link to='/home' className='text-2xl font-bold text-pink-500'><img className='w-32' src={image} alt="Logo"/></Link>
            <p className='mt-2 text-sm'>Powering your world with best in Electronics</p>
            <p  className='mt-2 text-sm'>123 Electrinics St,Style City, My1001</p>
            <p  className='mt-2'>Email:Support@zaptro.com</p>
            <p className='mt-2'>Phone:03403269833</p>
        </div>

     <div className='mb-6 md:mb-0'>
        <h3 className='text-lg font-semibold mb-4'>Customer Service</h3>
        <ul className='mt-2 text-sm space-y-2'>
            <li>Contact us</li>
            <li>Shipping & returns</li>
            <li>FAQ</li>
            <li>Order Tracking</li>
            <li>Size Guide</li>
        </ul>
        </div>



      <div className='mb-6 md:mb-0'>
       <h3 className='text-lg font-semibold mb-4'>Follow us</h3>
       <ul className='flex item-center text-white'>
        <li><TiSocialFacebookCircular className='text-2xl text-white'/></li>
        <li className='mx-2'><FaInstagram className='text-2xl text-white'/></li>
        <li className='mx-2'><CiTwitter className='text-2xl text-white'/></li>
        <li className='mx-2'><CiLinkedin className='text-2xl text-white'/></li>
       </ul>
        </div>


          <div className='mb-6 md:mb-0'>
       <h3 className='text-lg font-semibold mb-4'>Stay in Loop</h3>
       <p className='text-sm'>Subscribe to our newsletter for the latest updates and offers.</p>
         <div className='mt-4 flex'>
            <input type="email" placeholder='Enter your email' className='px-4 text-white py-2 rounded focus:outline-none'/>
            <button className='bg-pink-500 text-white px-4 py-2 rounded-r-md hover:bg-pink-600 transition duration-300'>Subscribe</button>
         </div>
        </div>

    </div>

   </footer>
   </>
  )
}

export default Footer