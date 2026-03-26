import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader } from "lucide-react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/UserSlice";

const Login = () => {
  const navigate=useNavigate()
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const dispatch=useDispatch()
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const [verificationError, setVerificationError] = React.useState(false);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    e.preventDefault();
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit=async(e)=>{
    e.preventDefault();
    console.log(formData)
    setVerificationError(false);
    try {
      setLoading(true)

      const res=await axios.post(`http://localhost:8000/api/v1/user/login`,formData,{
        headers:{
          'Content-Type':'application/json'
        }
      })
      console.log(res.data)
      if(res.data.success){

        toast.success('Login Successful')
        localStorage.setItem('accessToken',res.data.accessToken)
        dispatch(setUser(res.data.user))
        navigate('/')
      }
    } catch (error) {
      console.log(error)
      const errorMessage = error.response?.data?.message || 'Login Failed'
      
      // Check if this is an email verification error
      if (errorMessage.includes('Please verify your email before logging in')) {
        setVerificationError(true);
      }
      
      toast.error(errorMessage)
    }
    finally{
      setLoading(false)
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-pink-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link to='/forgot-password'
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <div className="relative">
              <Input
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                required
              />
              {showPassword ? <><EyeOff onClick={()=>setShowPassword(false)} className="absolute right-3 top-3 w-5 h-5 cursor-pointer"/></> :<><Eye onClick={()=>setShowPassword(true)} className="absolute right-3 top-3 w-5 h-5 cursor-pointer"/></>}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button onClick={handleSubmit} type="submit" className="w-full">
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                ...Loading
              </>
            ) : (
              "Login"
            )}
          </Button>
          {verificationError && (
            <Button 
              onClick={() => navigate('/reverify')} 
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Resend Verification Email
            </Button>
          )}
          <div className="flex items-center gap-2 w-full justify-center">
            <p className="text-gray-700">Don't have an account?</p>
            <Link to="/signup" className="text-sm underline-offset-4 hover:underline text-pink-800">
              Sign Up
            </Link>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
