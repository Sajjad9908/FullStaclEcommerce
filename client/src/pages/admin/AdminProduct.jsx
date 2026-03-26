import { Input } from "@/components/ui/input";
import { Edit, Search, Trash2 } from "lucide-react";
import React, { useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ImageUpload";
import axios from "axios";
import { setProductData } from "@/redux/ProductSlice";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AdminProduct = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [editProduct, setEditProduct] = React.useState(null);
   const [sortOrder,setSortOrder]=useState('')
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productName", editProduct.productName);
    formData.append("productPrice", editProduct.productPrice);
    formData.append("brand", editProduct.brand);
    formData.append("category", editProduct.category);
    formData.append("productDesc", editProduct.productDesc);

    const existingImages = editProduct.productImg
      .filter((img) => !(img instanceof File) && img.publicId)
      .map((img) => img.publicId);
    formData.append("existingImages", JSON.stringify(existingImages));

    editProduct.productImg
      .filter((img) => img instanceof File)
      .forEach((img) => {
        formData.append("productImg", img);
      });
    try {
      const res = await axios.put(
        `https://full-stacl-ecommerce.vercel.app/api/v1/updateProduct/${editProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
      if (res.data.success) {
        const updateProducts = products.map((product) =>
          product._id === editProduct._id ? res.data.product : product,
        );
        dispatch(setProductData(updateProducts));
        alert("Product updated successfully");
        setEditProduct(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const DeleteProduct = async (productId) => {
    try {
      const remainingProducts = products.filter(
        (product) => product._id !== productId,
      );
      const res = await axios.delete(
        `https://full-stacl-ecommerce.vercel.app/api/v1/product/deleteProduct/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
      if (res.data.success) {
        dispatch(setProductData(remainingProducts));
        alert("Product deleted successfully");
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to delete product");
    }
  };

  let filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  product.brand.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
  product.category.toLowerCase().includes(searchTerm.toLocaleLowerCase()) 
  );
  if(sortOrder==='lowToHigh'){
    filteredProducts=[...filteredProducts].sort((a,b)=>a.productPrice-b.productPrice)
  } else if(sortOrder==='highToLow'){
    filteredProducts=[...filteredProducts].sort((a,b)=>b.productPrice-a.productPrice)
  }

  return (
    <div className="pl-20 md:pl-[330px] py-20 md:pr-20 pr-4 flex flex-col min-h-screen bg-gray-100">
      <div className="flex flex-col w-full md:flex-row justify-between md:items-center">
        <div className="relative bg-white rounded-lg">
          <Input
            type="text"
            placeholder="Search products..."
            className="w-full min-w-0 md:w-[400px] items-center"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-3 top-1.5 text-gray-500" />
        </div>
        <Select onValueChange={(value)=>setSortOrder(value)}>
          <SelectTrigger className="w-full max-w-[400px] mt-1.5 md:mt-0 bg-white">
            <SelectValue placeholder="Sort by item" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort Options</SelectLabel>
              <SelectItem value="lowToHigh">Low to High</SelectItem>
              <SelectItem value="highToLow">High to Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col items-center justify-between w-full gap-3">
      {filteredProducts.map((product, index) => {
        return (
          <Card key={index} className="w-full px-3 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <img
                  src={product.productImg[0].url}
                  className="w-14 h-14 md:w-20 md:h-20 object-cover rounded shrink-0"
                />
                <h1 className="font-bold text-gray-700 truncate whitespace-nowrap min-w-0">
                  {product.productName}
                </h1>
              </div>
              <h1 className="font-semibold text-gray-700 shrink-0 text-sm md:text-base">
                ${product.productPrice.toFixed(2)}
              </h1>
              <div className="flex gap-2 md:gap-3 shrink-0">
                <Dialog>
                  <DialogTrigger asChild>
                    <Edit
                      onClick={() => setEditProduct(product)}
                      className="text-green-500 cursor-pointer"
                    />
                  </DialogTrigger>
                  <DialogContent className="max-w-75 md:max-w-155 max-h-185 overflow-y-scroll">
                    <DialogHeader>
                      <DialogTitle>Edit Product</DialogTitle>
                      <DialogDescription>
                        Make changes to your product here. Click save when
                        you&apos;re done.
                      </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                      <Field>
                        <Label>Product Name</Label>
                        <Input
                          name="productName"
                          value={editProduct?.productName || ""}
                          onChange={handleChange}
                          placeholder="example-iphone"
                          required
                          type="text"
                        />
                      </Field>
                      <Field>
                        <Label>Product Price</Label>
                        <Input
                          value={editProduct?.productPrice || ""}
                          onChange={handleChange}
                          name="productPrice"
                          placeholder="0.00"
                          required
                          type="number"
                        />
                      </Field>
                      <Field className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>Brand</Label>
                          <Input
                            name="brand"
                            value={editProduct?.brand || ""}
                            onChange={handleChange}
                            placeholder="example-brand"
                            required
                            type="text"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Category</Label>
                          <Input
                            name="category"
                            value={editProduct?.category || ""}
                            onChange={handleChange}
                            placeholder="example-category"
                            required
                            type="text"
                          />
                        </div>

                        <div className="grid gap-2">
                          <div className="flex items-center">
                            <Label>Description</Label>
                          </div>
                          <Textarea
                            name="productDesc"
                            value={editProduct?.productDesc || ""}
                            onChange={handleChange}
                            placeholder="Enter product description..."
                          />
                        </div>
                        <ImageUpload
                          productData={editProduct}
                          setProductData={setEditProduct}
                        />
                      </Field>
                    </FieldGroup>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button onClick={handleSave} type="submit">
                        Save changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                     <Trash2
            
                  className="text-red-500 cursor-pointer"
                />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => DeleteProduct(product._id)}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

              
              </div>
            </div>
          </Card>
        );
      })}
      </div>
    </div>
  );
};

export default AdminProduct;
