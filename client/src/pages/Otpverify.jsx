import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
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

const Otpverify = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''

  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)

  const handleVerifyOtp = async (e) => {
    e.preventDefault()

    if (!email) {
      toast.error('Email not found. Please start again.')
      return
    }

    if (!otp.trim()) {
      toast.error('OTP is required')
      return
    }

    try {
      setLoading(true)
      const res = await axios.post(
        `https://full-stacl-ecommerce-1nyae7crv.vercel.app/api/v1/user/verify-otp/${encodeURIComponent(email)}`,
        { otp },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (res.data.success) {
        toast.success(res.data.message || 'OTP verified successfully')
        navigate(`/change-password?email=${encodeURIComponent(email)}`)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (!email) {
      toast.error('Email not found. Please start again.')
      return
    }

    try {
      setResendLoading(true)
      const res = await axios.post(
        'https://full-stacl-ecommerce-1nyae7crv.vercel.app/api/v1/user/forget-password',
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (res.data.success) {
        toast.success(res.data.message || 'OTP sent again')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-pink-100 px-4'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle>Verify OTP</CardTitle>
          <CardDescription>
            Enter the OTP sent to <span className='font-medium'>{email || 'your email'}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerifyOtp} className='grid gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='otp'>OTP</Label>
              <Input
                id='otp'
                name='otp'
                type='text'
                inputMode='numeric'
                maxLength={6}
                placeholder='Enter 6-digit OTP'
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <Button type='submit' className='w-full bg-pink-600 hover:bg-pink-500'>
              {loading ? (
                <>
                  <Loader className='w-4 h-4 mr-2 animate-spin' />
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className='flex-col gap-2'>
          <Button
            type='button'
            variant='outline'
            className='w-full'
            onClick={handleResendOtp}
            disabled={resendLoading}
          >
            {resendLoading ? (
              <>
                <Loader className='w-4 h-4 mr-2 animate-spin' />
                Resending...
              </>
            ) : (
              'Resend OTP'
            )}
          </Button>
          <Link to='/forgot-password' className='text-sm text-pink-800 underline-offset-4 hover:underline'>
            Change email
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Otpverify
