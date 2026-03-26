import React, { useState } from 'react'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'


    








const SignUp = () => {
 const [showPassword,setShowPassword]=useState(false)
 const [loading,setLoading]=useState(false)
 const navigate=useNavigate();

 const [formData,setFormData]=useState({
  firstName:'',
  lastName:'',
  email:'',
  password:''
 })

 const handleChange=(e)=>{
  const {name,value}=e.target;
  setFormData((prev)=>({
    ...prev,
    [name]:value
  }))
 }

 const handleSubmit=async(e)=>{
  e.preventDefault();
 console.log(formData)

 try {
  setLoading(true)  
  const res=await axios.post(`https://full-stacl-ecommerce-1nyae7crv.vercel.app/api/v1/user/register`,formData,{
    headers:{
      'Content-Type':'application/json'
    }
  })
  console.log(res.data)
 
  if(res.data.success){
    navigate('/verify')
    toast.success(res.data.message)

  }
  
 
 } catch (error) {
  console.log(error)
  alert(error.response.data.message || 'Something went wrong')
  toast.error(error.response.data.message || 'Something went wrong')
 }
 finally{
  setLoading(false)
 }
 
 }

  return (
    <div className='flex justify-center items-center min-h-screen bg-pink-100'>
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create Your Account</CardTitle>
        <CardDescription className='text-sm'>
          Enter given details below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
      
          <div className="flex flex-col gap-6">

            <div className='grid grid-cols-2 gap-3'>
               <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className='relative'>
                  <Input
                   id="password"
                   name="password"
                   required
                   placeholder='create a password'
                   type={showPassword? 'text':'password'}
                   value={formData.password}
                   onChange={handleChange}
                   />
                   {showPassword? <EyeOff onClick={()=>(setShowPassword(false))} className='w-5 h-5 bottom-3 absolute right-3 top-3 cursor-pointer'/>:<Eye onClick={()=>setShowPassword(true)} className='w-5 h-5 absolute right-3 top-3 bottom-3 cursor-pointer'/>}
              </div>

              <div className='flex flex-col item-center'>
                <h3 className="text-sm text-gray-600">Don't have an account?</h3>
                <Link to="/sign" className='text-sm underline-offset-4 hover:underline text-pink-800'>Login</Link>
              </div>
            
            </div>
          </div>
     
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button onClick={handleSubmit} type="submit" className="w-full cursor-pointer bg-pink-600 hover:bg-pink-500">
          {loading? <> <Loader className="w-4 h-4 mr-2 animate-spin"/> please wait... </> : 'Sign Up'}
       
        </Button>
        <div className='flex items-center gap-2 w-full justify-center'>
     <p className='text-gray-700 '>Already have an account?</p> <Link to="/login" className='text-sm underline-offset-4 hover:underline text-pink-800'>Login</Link>
     </div>



    </CardFooter>
    </Card>
    
    </div>
  )
}

export default SignUp