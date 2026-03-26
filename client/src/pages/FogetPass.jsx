import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const FogetPass = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email.trim()) {
      toast.error('Email is required')
      return
    }

    try {
      setLoading(true)
      const res = await axios.post(
        'https://full-stacl-ecommerce.vercel.app/api/v1/user/forget-password',
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (res.data.success) {
        toast.success(res.data.message || 'OTP sent to your email')
        navigate(`/verify-otp?email=${encodeURIComponent(email)}`)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-pink-100 px-4'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email and we will send you a one-time OTP.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='grid gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='m@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button type='submit' className='w-full bg-pink-600 hover:bg-pink-500'>
              {loading ? (
                <>
                  <Loader className='w-4 h-4 mr-2 animate-spin' />
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className='justify-center'>
          <Link to='/login' className='text-sm text-pink-800 underline-offset-4 hover:underline'>
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default FogetPass