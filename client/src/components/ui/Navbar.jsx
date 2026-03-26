import React, { useState } from 'react'
import image from '../../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, ShoppingCart } from 'lucide-react'
import { Button } from './button'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '@/redux/UserSlice'

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.user)
  const cart = useSelector((state) => state.products.cart)
  const admin = user?.role === 'admin'

  const logoutHandler = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const res = await axios.post(
        'https://full-stacl-ecommerce-1nyae7crv.vercel.app/api/v1/user/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      if (res.data.success) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        dispatch(setUser(null))
        toast.success(res.data.message)
        navigate('/login')
      }
    } catch (error) {
      console.log(error)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      dispatch(setUser(null))
      navigate('/login')
    }
  }

  return (
    <>
      <header className='fixed top-0 z-50 bg-pink-50 w-full border-b border-pink-200'>
        <div className='relative flex items-center justify-between w-full max-w-7xl mx-auto py-3 px-3 sm:px-4'>
          <div className='shrink-0'>
            <img
              src={image}
              alt='Logo'
              className='h-10 sm:h-12 w-auto max-w-[140px] sm:max-w-[160px]'
            />
          </div>

          <nav className='hidden md:flex gap-5 justify-between items-center'>
            <ul className='flex md:gap-7 gap-3 items-center text-xl font-semibold'>
              <Link to='/'><li>Home</li></Link>
              <Link to='/products'><li>Products</li></Link>
              
                <>
                  <Link to={`/profile/${user._id}`}><li>{user.firstName} {user.lastName}</li></Link>
                  <img src={user.profilePic} alt='Profile' className='h-8 w-8 rounded-full ml-2' />
                  <Link to='/dashboard/sales'><li>Dashboard</li></Link>
                </>
           
            </ul>
            <Link to='/cart' className='relative'>
              <ShoppingCart />
              <span className='bg-pink-500 rounded-full absolute -top-3 -right-5 px-2 mr-3'>
                {cart?.items?.length || 0}
              </span>
            </Link>
            {user
              ? <Button onClick={logoutHandler} className='bg-pink-500 hover:bg-pink-600 text-white'>Logout</Button>
              : <Button onClick={() => navigate('/login')} className='text-white cursor-pointer bg-gradient-to-tl from-blue-600 to-purple-600'>Login</Button>}
          </nav>

          <div className='md:hidden shrink-0'>
            <Menu onClick={() => setOpen(!open)} className='cursor-pointer' />
          </div>

          {open && (
            <div className='md:hidden absolute top-full left-0 right-0 z-40'>
              <ul className='transition-all duration-75 w-full p-6 min-h-[calc(100vh-76px)] bg-pink-50 border-t border-pink-200 flex flex-col gap-3 items-start text-xl font-semibold'>
                <Link to='/'><li>Home</li></Link>
                <Link to='/products'><li>Products</li></Link>
                {admin && (
                  <>
                    <Link to={`/profile/${user._id}`}><li>{user.firstName} {user.lastName}</li></Link>
                    <img src={user.profilePic} alt='Profile' className='h-8 w-8 rounded-full ml-2' />
                    <Link to='/dashboard/sales'><li>Dashboard</li></Link>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </header>
    </>
  )
}

export default Navbar
