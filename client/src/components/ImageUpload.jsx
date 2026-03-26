
import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { XIcon } from 'lucide-react'

const ImageUpload = ({ productData, setProductData }) => {
  const handleFile=(e)=>{
      const files=Array.from(e.target.files || [])
      if(files.length>0){
        setProductData((prevData)=>({
          ...prevData,
          productImg:[...prevData.productImg,...files]
        }))
      }
  }
   const removeImage=(index)=>{
              setProductData((prevData)=>{
               const UpdatedImages=prevData.productImg.filter((_,i) => i!==index)
               return{
                ...prevData,
                productImg:UpdatedImages
               }
              })
            }
  return (
    <div className='grid gap-2'>
      <label>Product Images</label>
      <Input type="file" id="file-upload" className='hidden' accept='image/*' multiple 
      onChange={handleFile}
      />
      <Button variant='outline'>
        <label htmlFor="file-upload" className='cursor-pointer'>Upload Images</label>
      </Button>

      {/* ImagePreview */}
      {productData.productImg.length>0 && (
        <div className='grid grid-cols-2 gap-4 mt-3 sm:grid-cols-3'>
          {productData.productImg.map((img,index)=>{
            let preview
            if(img instanceof File){
              preview=URL.createObjectURL(img)
            }
            else if(typeof img==='string'){
              preview=img
            }
            else if(img?.url){
              preview=img.url

            }
            else{
              return null
            }
           
            return(
            <Card key={index} className='relative group overflow-hidden'>
               <CardContent>
                <img src={preview}  className='w-full h-32 object-cover rounded-md' width={200} height={200}/>
                <button onClick={()=>(removeImage(index))} className='absolute top-1 right-1 bg-black/50 opacity-0 group-hover:opacity-100 transition'><XIcon size={14}/></button>
               </CardContent>
            </Card>
            )
          })}
         </div>
      )}
    </div>
  )
}

export default ImageUpload