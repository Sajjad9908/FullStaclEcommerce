import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader } from 'lucide-react'
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

const ChangePassword = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''

  const [loading, setLoading] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      toast.error('Email not found. Please start forgot password flow again.')
      return
    }

    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error('All fields are required')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Password and confirm password do not match')
      return
    }

    try {
      setLoading(true)
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/changePassword/${encodeURIComponent(email)}`,
        {
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (res.data.success) {
        toast.success(res.data.message || 'Password changed successfully')
        navigate('/login')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-pink-100 px-4'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Set a new password for <span className='font-medium'>{email || 'your account'}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='grid gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='newPassword'>New Password</Label>
              <div className='relative'>
                <Input
                  id='newPassword'
                  name='newPassword'
                  type={showNewPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
                {showNewPassword ? (
                  <EyeOff
                    onClick={() => setShowNewPassword(false)}
                    className='absolute right-3 top-3 w-5 h-5 cursor-pointer'
                  />
                ) : (
                  <Eye
                    onClick={() => setShowNewPassword(true)}
                    className='absolute right-3 top-3 w-5 h-5 cursor-pointer'
                  />
                )}
              </div>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <div className='relative'>
                <Input
                  id='confirmPassword'
                  name='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {showConfirmPassword ? (
                  <EyeOff
                    onClick={() => setShowConfirmPassword(false)}
                    className='absolute right-3 top-3 w-5 h-5 cursor-pointer'
                  />
                ) : (
                  <Eye
                    onClick={() => setShowConfirmPassword(true)}
                    className='absolute right-3 top-3 w-5 h-5 cursor-pointer'
                  />
                )}
              </div>
            </div>

            <Button type='submit' className='w-full bg-pink-600 hover:bg-pink-500'>
              {loading ? (
                <>
                  <Loader className='w-4 h-4 mr-2 animate-spin' />
                  Updating...
                </>
              ) : (
                'Change Password'
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

export default ChangePassword
