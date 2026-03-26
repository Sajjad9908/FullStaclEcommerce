import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader } from 'lucide-react'
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import profile from '../../assets/profile.png'
import axios from 'axios'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from 'sonner'

const UserInfo = () => {
  const[loading,setLoading]=React.useState(false)
  const navigate=useNavigate()
  const [updateuser,setUpdateUser]=React.useState({
   firstName:'',
   lastName:'',
   email:'',
   phoneNo:'',
   address:'',
   city:'',
   zipCode:'',
    role:'',
   profilePic:''
  })
   const[file,setFile]=React.useState(null)

   const params=useParams()
   const userId=params.id
  const handleChange=(e)=>{
    setUpdateUser({...updateuser,[e.target.name]:e.target.value})
  }

  const handleFileChange=(e)=>{
    const selectedFile=e.target.files[0]
    setFile(selectedFile)
    setUpdateUser({...updateuser,profilePic:URL.createObjectURL(selectedFile)})
  }

 const handleSubmit= async(e)=>{
    e.preventDefault()
    
    const accessToken=localStorage.getItem('accessToken')
    try {
      setLoading(true)
      const formData=new FormData();
      formData.append('firstName',updateuser.firstName)
      formData.append('lastName',updateuser.lastName)
      formData.append('email',updateuser.email)
      formData.append('phoneNo',updateuser.phoneNo)
       formData.append('address',updateuser.address)
        formData.append('city',updateuser.city)
         formData.append('zipCode',updateuser.zipCode)
          if(updateuser.role){
            formData.append('role',updateuser.role)
          }

          if(file){
            formData.append('file',file)
          }


          const res=await axios.put(`http://localhost:8000/api/v1/user/update/${userId}`,formData,{
            headers:{
              Authorization:`Bearer ${accessToken}`,
              'Content-Type':'multipart/form-data'
            }
          })
          if(res.data.success){
            toast.success(res.data.message)
            setUpdateUser((prev)=>({
              ...prev,
              ...res.data.updatedUser,
              role:res.data.updatedUser?.role || prev.role
            }))
          }

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update profile")
      
    }
    finally{
        setLoading(false)
    }
    

  }
  const getUserDetails=async()=>{
    try {
      const res=await axios.get(`http://localhost:8000/api/v1/user/getUser/${userId}`)
      if(res.data.success){
        setUpdateUser((prev)=>({
          ...prev,
          ...res.data.user,
          role:res.data.user?.role || prev.role
        }))
      }
    } catch (error) {
      console.log(error);
      
    }
  }
  useEffect(()=>{
    getUserDetails()
  },[])

  return (
    <div className='pt-5 pl-[350px] min-h-screen bg-gray-100'>
      <div className='max-w-7xl mx-auto' >
        <div className='flex flex-col justify-center min-h-screen bg-gray-100'>
          <div className='flex justify-between gap-10'>
            <Button onClick={()=>navigate(-1)}><ArrowLeft /></Button>
            <h1 className='font-bold mb-7 text-2xl text-gray-800'>
              Update Profile
            </h1>
          </div>
           <div className="flex items-start justify-between w-full gap-10 px-7 max-w-2xl">
                    {/* Profile picture */}
                    <div className="flex flex-col items-center">
                    <img src={updateuser?.profilePic || profile} className="w-32 h-32 rounded-full object-cover border-4 border-pink-800"/>
                    <label className="mt-4 cursor-pointer text-sm text-white rounded-2xl text-center bg-pink-600 px-4 py-2 hover:bg-pink-700">change picture
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange}/>
                    </label>
                    </div>
                    {/* Profile details form */}
                    <form onSubmit={handleSubmit} className="space-y-4 shadow-lg p-5 rounded-lg bg-white">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium">firstName</label>
                          <input type="text" name="firstName" placeholder="john" value={updateuser?.firstName} onChange={handleChange} className="w-full px-3 py-2 mt-2 border rounded-lg"/>
                        </div>
                         <div>
                          <label className="block text-sm font-medium">lastName</label>
                          <input type="text" name="lastName" placeholder="doe" value={updateuser?.lastName} onChange={handleChange} className="w-full px-3 py-2 mt-2 border rounded-lg text-gray-400"/>
                        </div>
                          <div className="col-span-2">
                          <label className="block text-sm font-medium">Email</label>
                          <input onChange={handleChange} value={updateuser?.email} type="email" name="email" className="w-full px-3 py-2 mt-2 border rounded-lg bg-gray-100 cursor-not-allowed"/>
                        </div>
                         <div className="col-span-2">
                          <label className="block text-sm font-medium">Phone Num</label>
                          <input type="text" onChange={handleChange} value={updateuser?.phoneNo} name="phoneNo" placeholder="Enter Your Contact number" className="w-full px-3 py-2 mt-2 border rounded-lg text-gray-400"/>
                        </div>

                          <div >
                          <label className="block text-sm font-medium">Address </label>
                          <input type="text" name="address" value={updateuser?.address} onChange={handleChange} placeholder="Enter Your Address" className="w-full px-3 py-2 mt-2 border rounded-lg text-gray-400"/>
                        </div>

                         <div >
                          <label className="block text-sm font-medium">city </label>
                          <input onChange={handleChange} type="text" name="city" value={updateuser?.city} placeholder="Enter Your City" className="w-full px-3 py-2 mt-2 border rounded-lg text-gray-400"/>
                        </div>

                         <div className="col-span-2">
                          <label className="block text-sm font-medium">zipCode </label>
                          <input onChange={handleChange} type="text" name="zipCode" value={updateuser?.zipCode} placeholder="Enter Your Zip Code" className="w-full px-3 py-2 mt-2 border rounded-lg text-gray-400"/>
                        </div>

                        <div>
                          <label className="block text-sm font-medium">Role </label>
                          <select onChange={handleChange} name="role" value={updateuser?.role} className="w-full px-3 py-2 mt-2 border rounded-lg text-gray-400 cursor-not-allowed bg-gray-100">
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>

                        

                      </div>
                      <div className='flex gap-3 items-center '>
                        <Label className='block text-sm font-medium'>Role:
                        <RadioGroup value={updateuser.role} 
                        onValueChange={(value)=>(setUpdateUser({...updateuser,role:value}))}
                        className='flex items-center'>
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value="user" id="user"/>
                            <Label htmlFor="user">User</Label>

                          </div>

                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value="admin" id="admin"/>
                            <Label htmlFor="admin">Admin</Label>

                          </div>
                        </RadioGroup>
                        </Label>
                      </div>
                      <Button type="submit" className="w-full mt-4 bg-pink-600 hover:bg-pink-700">{loading && <><Loader className="w-5 h-5 rounded-full animate-spin"/></>}Update Profile</Button>
                      
                    </form>
                </div>
        </div>
      </div>
    </div>
  )
}

export default UserInfo