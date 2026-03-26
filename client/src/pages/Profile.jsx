import React, { useEffect } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import profile from '../assets/profile.png'
import { toast } from "sonner";
import axios from "axios";
import { setUser } from "@/redux/UserSlice";
import { Loader } from "lucide-react";

const Profile = () => {
  const params=useParams()
  const userId=params.userId
  const [loading,setLoading]=React.useState(false)
  const user=useSelector((state)=> state.user.user)
  const dispatch=useDispatch()
  const [updateuser,setUpdateUser]=React.useState({
    firstName:user?.firstName || '',
    lastName:user?.lastName || '',
    email:user?.email || '',
    phoneNo:user?.phoneNo || '',
    address:user?.address || '',
    city:user?.city || '',
    zipCode:user?.zipCode || '',
    profilePic:user?.profilePic || '',
    role:user?.role || '',
  })
  const [file,setFile]=React.useState(null)

  useEffect(() => {
    setUpdateUser({
      firstName:user?.firstName || '',
      lastName:user?.lastName || '',
      email:user?.email || '',
      phoneNo:user?.phoneNo || '',
      address:user?.address || '',
      city:user?.city || '',
      zipCode:user?.zipCode || '',
      profilePic:user?.profilePic || '',
      role:user?.role || '',
    })
  }, [user])

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
          formData.append('role',updateuser.role)

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
            const nextUser = res.data.updatedUser || res.data.user
            if(nextUser){
              dispatch(setUser(nextUser))
              setUpdateUser((prev)=>({
                ...prev,
                ...nextUser,
              }))
            }
          }

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update profile")
      
    }
    finally{
        setLoading(false)
    }
    

  }
 
  return (
    <div className="pt-20 min-h-screen bg-gray-100">
      <Tabs defaultValue="profile" className="max-w-7xl mx-auto items-center">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">orders</TabsTrigger>
       
        </TabsList>
        <TabsContent value="profile">
          <div>
            <div className="flex flex-col items-center justify-center bg-gray-100">
                <h1 className="font-bold mb-7 text-gray-800">Update profile</h1>
                <div className="flex flex-col md:flex-row items-center md:items-start justify-between w-full gap-10 px-7 max-w-2xl">
                    {/* Profile picture */}
                    <div className="flex flex-col items-center">
                    <img src={updateuser?.profilePic || profile} className="w-32 h-32 rounded-full object-cover border-4 border-pink-800"/>
                    <label className="mt-4 cursor-pointer text-sm text-white rounded-2xl text-center bg-pink-600 px-4 py-2 hover:bg-pink-700">change picture
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange}/>
                    </label>
                    </div>
                    {/* Profile details form */}
                    <form onSubmit={handleSubmit} className="space-y-4 shadow-lg p-5 rounded-lg bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium">firstName</label>
                          <input type="text" name="firstName" placeholder="john" value={updateuser.firstName} onChange={handleChange} className="w-full px-3 py-2 mt-2 border rounded-lg"/>
                        </div>
                         <div>
                          <label className="block text-sm font-medium">lastName</label>
                          <input type="text" name="lastName" placeholder="doe" value={updateuser.lastName} onChange={handleChange} className="w-full px-3 py-2 mt-2 border rounded-lg text-gray-400"/>
                        </div>
                          <div className="md:col-span-2">
                          <label className="block text-sm font-medium">Email</label>
                          <input onChange={handleChange} value={updateuser.email} type="email" name="email" className="w-full px-3 py-2 mt-2 border rounded-lg bg-gray-100 cursor-not-allowed"/>
                        </div>
                         <div className="md:col-span-2">
                          <label className="block text-sm font-medium">Phone Num</label>
                          <input type="text" onChange={handleChange} value={updateuser.phoneNo} name="phoneNo" placeholder="Enter Your Contact number" className="w-full px-3 py-2 mt-2 border rounded-lg text-gray-400"/>
                        </div>

                          <div >
                          <label className="block text-sm font-medium">Address </label>
                          <input type="text" name="address" value={updateuser.address} onChange={handleChange} placeholder="Enter Your Address" className="w-full px-3 py-2 mt-2 border rounded-lg text-gray-400"/>
                        </div>

                         <div >
                          <label className="block text-sm font-medium">city </label>
                          <input onChange={handleChange} type="text" name="city" value={updateuser.city} placeholder="Enter Your City" className="w-full px-3 py-2 mt-2 border rounded-lg text-gray-400"/>
                        </div>

                         <div className="md:col-span-2">
                          <label className="block text-sm font-medium">zipCode </label>
                          <input onChange={handleChange} type="text" name="zipCode" value={updateuser.zipCode} placeholder="Enter Your Zip Code" className="w-full px-3 py-2 mt-2 border rounded-lg text-gray-400"/>
                        </div>

                      

                        

                      </div>
                      <Button type="submit" className="w-full mt-4 bg-pink-600 hover:bg-pink-700">{loading && <><Loader className="w-5 h-5 rounded-full animate-spin"/></>}Update Profile</Button>
                      
                    </form>
                </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>orders</CardTitle>
              <CardDescription>
                Track performance and user engagement metrics. Monitor trends
                and identify growth opportunities.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              Page views are up 25% compared to last month.
            </CardContent>
          </Card>
        </TabsContent>
       
       
      </Tabs>
    </div>
  );
};

export default Profile;
