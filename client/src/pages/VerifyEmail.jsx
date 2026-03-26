import axios from 'axios'
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const VerifyEmail = () => {
    const navigate=useNavigate()
    const token=useParams()
    console.log(token)
    const [status,setStatus]=React.useState('Verifying...')

    const VerifyEmail=async()=>{
        try {
            const res=await axios.post(`https://full-stacl-ecommerce.vercel.app/api/v1/user/verify`,{},{
                headers:{
                    Authorization:`Bearer ${token.token}`
                }
            })
            if(res.data.success){
                setStatus('✅ Email Verified Successfully')
            }
            setTimeout(() => {
                navigate('/login')
            }, 3000);
        } catch (error) {
            console.log(error)
            setStatus('Verification Failed')
        }
    }
    useEffect(()=>{
        VerifyEmail()
    },[token])
  return (
    <div className='relative w-full h-screen overflow-hidden bg-pink-100 '>
        <div className='min-h-screen flex items-center justify-center'>
            <div className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center'>

                <h2 className='text-2xl font-semibold text-green-500 mb-4'>✅ {status}</h2>
                <p className='text-gray-400 text-sm'>Please wait while we verify your email address...</p>
            </div>
        </div>
    </div>
  )
}

export default VerifyEmail