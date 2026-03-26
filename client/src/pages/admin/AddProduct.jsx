import ImageUpload from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { setProductData } from "@/redux/ProductSlice";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import Products from "../Products";
import { Loader } from "lucide-react";

const AddProduct = () => {

  const dispatch=useDispatch()
  const[productsData,setProductsData]=useState({
    productName:'',
    productPrice:0,
    brand:'',
    category:'',
    productImg:[],  
    productDesc:''
  })
  const [loading,setLoading]=useState(false)
 
  const accessToken=localStorage.getItem('accessToken');
  const handleChange=(e)=>{
    const {name,value}=e.target;
    setProductsData((prevData)=>({
      ...prevData,[name]:value
    }))
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const formData= new FormData();
    formData.append('productName',productsData.productName);
    formData.append('productPrice',productsData.productPrice);
    formData.append('brand',productsData.brand);
    formData.append('category',productsData.category);
    formData.append('productDesc',productsData.productDesc);

    if(productsData.productImg.length===0){
      toast.error('Please upload at least one product image');
      return;
    }
     
    productsData.productImg.forEach((img,index)=>{
      formData.append('files',img);
    })
    try {
      setLoading(true)
      const res=await axios.post(`https://full-stacl-ecommerce-1nyae7crv.vercel.app/api/v1/product/add`,formData,{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      })
      if(res.data.success){
        toast.success(res.data.message)
        dispatch(setProductData([...Products,res.data.product]))

      }
    } catch (error) {
      console.error('Error adding product:',error);
    }
    finally{
      setLoading(false)
    }
  }
  return (
    <div className="md:pl-[350px] pl-20 py-10 mt-14 pr-5 md:pr-20 max-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <Card className="w-full my-20">
        <CardHeader>
          <CardTitle>Add Product</CardTitle>
          <CardDescription>Enter Product Detail below</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="grid gap-2">
              <Label>Product Name</Label>
              <Input
                onChange={handleChange}
                value={productsData.productName}
                type="text"
                name="productName"
                placeholder="Ex-iphone"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Price</Label>
              <Input
                onChange={handleChange}
                value={productsData.productPrice}
                type="number"
                name="productPrice"
                placeholder=""
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Brand</Label>
                <Input
                  onChange={handleChange}
                  value={productsData.brand}
                  type="text"
                  name="brand"
                  placeholder="Ex-apple"
                  required
                />
              </div>
               <div className="grid gap-2">
                <Label>Category</Label>
                <Input
                  onChange={handleChange}
                  value={productsData.category}
                  type="text"
                  name="category"
                  placeholder="Mobile"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <label>Description</label>
                </div>
                <Textarea 
                  onChange={handleChange}
                  value={productsData.productDesc}
                  name="productDesc" 
                  placeholder='Emter brief description of product'
                />


            </div>
            <ImageUpload productData={productsData} setProductData={setProductsData} />
          </div>
          <CardFooter className='flex flex-col gap-2'>
            <Button
            disabled={loading}
             onClick={handleSubmit}
              className='w-full bg-pink-600 cursor-pointer '
               type='submit'>
              {loading ? <><span className="flex gap-1 items-center"><Loader className="w-5 h-5 animate-spin" />Please Wait</span></>: 'Add Product'}
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
};
export default AddProduct;
