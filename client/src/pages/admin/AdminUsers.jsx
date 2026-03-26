import { Input } from '@/components/ui/input';
import axios from 'axios';
import { Search } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import profile from '../../assets/profile.png'
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
  const navigate=useNavigate()
  const [searchTerm, setSearchTerm] = useState('');
   const api='http://localhost:8000/api/v1/user/allUsers'
  const [users,setUsers]=useState([]);
  const accessToken = localStorage.getItem('accessToken');
  const getAllUsers = async () => {
  
  try {
    const res=await axios.get(api,{
      headers:{
        Authorization:`Bearer ${accessToken}`
      }
    })
    if(res.data.success){
     
      setUsers(res.data.users);
      toast.success('Users fetched successfully')
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
  }
  useEffect(() => {
    getAllUsers();
  }, []);
 const filteredUsers=users.filter((user)=>(
  `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())
 ))
  return (
   <div className='pl-20 md:pl-[350px] py-20 pr-20 mx-auto'>
   <h1 className='text-3xl font-bold mb-6'>User Management</h1>
    <p>View and manage Registered Users</p>
    <div className='flex relative w-[300px] mt-6'>
      <Search className='absolute top-1.5 right-2.5 text-gray-400'/>
      <Input value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder='Search users...' className=''/>

    </div>
    <div className='grid grid-cols-1 gap-7 mt-7'>
      <div>
      {filteredUsers.map((user,index)=>{
        return (
          <div key={index} className='bg-pink-100 p-5 rounded-lg'>
            <div className='flex items-center gap-2'>
              <img src={user?.profilePic || profile} alt={user?.name} className='w-16 aspect-square object-cover border border-pink-600 rounded-full'/>
              <div>
                <h1 className='font-semibold'>{user.firstName}{user.lastName}</h1>
                <p>{user.email} </p>
              </div>

            </div>
            <div className='flex gap-3 mt-3'>
              <button onClick={()=>navigate(`/dashboard/users/${user?._id}`)} className='bg-green-500 text-white px-3 py-1 rounded'>Edit</button>
             <Button variant='outline' className='bg-blue-500 text-white hover:bg-blue-600'>Show order</Button>
              </div>
          </div>  
        )
      })}
      </div>
    </div>

   </div>
  )
}

export default AdminUsers