import { LayoutDashboard, PackagePlus, PackageSearch, Users } from 'lucide-react'
import React from 'react'
import { FaRegEdit } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='fixed border-r bg-pink-50 border-pink-200 md:w-20 md:w-[300px] md:px-2 md:px-10 p-3 md:p-10 h-screen'>
      <div className='text-center pt-20 px-1 md:px-3 space-y-2'>
        <NavLink to='/dashboard/sales' className={({isActive}) => `text-base md:text-xl ${isActive ? 'bg-pink-600 text-gray-200 ' : 'bg-transparent'} flex items-center justify-center md:justify-start gap-2 font-bold cursor-pointer rounded-2xl w-full p-2`}><LayoutDashboard className='shrink-0'/> <span className='hidden md:inline'>Dashboard</span></NavLink>

          <NavLink to='/dashboard/add-product' className={({isActive}) => `text-base md:text-xl ${isActive ? 'bg-pink-600 text-gray-200 ' : 'bg-transparent'} flex items-center justify-center md:justify-start gap-2 font-bold cursor-pointer rounded-2xl w-full p-2`}><PackagePlus className='shrink-0'/> <span className='hidden md:inline'>AddProducts</span></NavLink>


            <NavLink to='/dashboard/products' className={({isActive}) => `text-base md:text-xl ${isActive ? 'bg-pink-600 text-gray-200 ' : 'bg-transparent'} flex items-center justify-center md:justify-start gap-2 font-bold cursor-pointer rounded-2xl w-full p-2`}>
              <PackageSearch className='shrink-0'/> 
              <span className='hidden md:inline'>Products</span></NavLink>


              <NavLink to='/dashboard/users' className={({isActive}) => `text-base md:text-xl ${isActive ? 'bg-pink-600 text-gray-200 ' : 'bg-transparent'} flex items-center justify-center md:justify-start gap-2 font-bold cursor-pointer rounded-2xl w-full p-2`}><Users className='shrink-0'/> <span className='hidden md:inline'>Users</span></NavLink>

                <NavLink to='/dashboard/orders' className={({isActive}) => `text-base md:text-xl ${isActive ? 'bg-pink-600 text-gray-200 ' : 'bg-transparent'} flex items-center justify-center md:justify-start gap-2 font-bold cursor-pointer rounded-2xl w-full p-2`}><FaRegEdit className='shrink-0'/> <span className='hidden md:inline'>Orders</span></NavLink>
      </div>
        
        </div>
  )
}

export default Sidebar