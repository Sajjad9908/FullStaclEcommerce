import React from 'react'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Navbar from './components/ui/Navbar'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Home from './pages/Home'
import Verify from './pages/Verify'
import VerifyEmail from './pages/VerifyEmail'
import Footer from './components/Footer'
import Profile from './pages/Profile'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Dashboard from './pages/Dashboard'
import AdminSales from './pages/admin/AdminSales'
import AddProduct from './pages/admin/AddProduct'
import AdminProduct from './pages/admin/AdminProduct'
import AdminOrders from './pages/admin/AdminOrders'
import ShowUsersOrders from './pages/admin/ShowUsersOrders'
import AdminUsers from './pages/admin/AdminUsers'
import UserInfo from './pages/admin/UserInfo'
import ProtectedRoute from './components/ProtectedRoute'
import SingleProduct from './pages/SingleProduct'
import AddressRoute from './pages/AddressRoute'
import FogetPass from './pages/FogetPass'
import Otpverify from './pages/Otpverify'
import ChangePassword from './pages/ChangePassword'
import ReVerify from './pages/ReVerify'

const router=createBrowserRouter([
  {
    path:'/',
    element:<><Navbar/>  <Home/> <Footer/></>
  },
  {
    path:'/signup',
    element:<><SignUp/></>
  },
  {
    path:'/forgot-password',
    element:<><FogetPass/></>
  },
  {
    path:'/verify-otp',
    element:<><Otpverify/></>
  },
  {
    path:'/change-password',
    element:<><ChangePassword/></>
  },
  {
  path:'/login',
  element:<><Login/></>
  },
  {
    path:'/verify',
    element:<><Verify/></>
  },

  {
    path:'/verify/:token',
    element:<><VerifyEmail/></>
  },
  {path:'/profile/:userId',
    element:<ProtectedRoute> <Navbar/> <Profile/> <Footer/></ProtectedRoute>
  },
  {
    path:'/products',
    element:<ProtectedRoute><Navbar/><Products/><Footer/></ProtectedRoute>
  },
  {path:'/product/:id',
    element:<><Navbar/> <SingleProduct/> </> 
  },
  {
    path:'/cart',
    element:<ProtectedRoute><Navbar/><Cart/></ProtectedRoute>
  },
   {
        path:'/address',
        element:<ProtectedRoute><AddressRoute/></ProtectedRoute>
      },
      {
        path:'/reverify',
        element:<><Navbar/><ReVerify/><Footer/></>
      },
  {
    path:'/dashboard',
    element:<ProtectedRoute adminOnly={true}><Navbar/><Dashboard/></ProtectedRoute>,
    children:[
      {
        path:'sales',
        element:<><Navbar/> <AdminSales/></>

      },
       {
        path:'add-product',
        element:<><AddProduct/></>

      },
     
       {
        path:'products',
        element:<><AdminProduct/></>

      },
       {
        path:'orders',
        element:<><AdminOrders/></>

      },
       {
        path:'users/orders/:userId',
        element:<><ShowUsersOrders/></>

      },
       {
        path:'users',
        element:<><AdminUsers/></>

      },
       {
        path:'users/:id',
        element:<><UserInfo/></>

      },
    ]
    
   
  }
])
const App = () => {
  return (
    <>
    <RouterProvider router={router}/>
    </>
  )
}

export default App