import React from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const ProductImage = ({images}) => {
    const [mainImage,setMainImage]=React.useState(images?.[0]?.url)
  return (
    <div className='flex gap-5 w-max'>
        <div className='gap-5 flex flex-col'>
            {images?.map((image,index)=>(
                <img src={image.url} onClick={()=>(setMainImage(image.url))} className='cursor-pointer w-20 h-20 shadow-lg border'/>
            ))}
        </div>
        <Zoom>
         <img src={mainImage} className='w-[230px] md:w-[400px] shadow-lg border'/>
        </Zoom>
        
    </div>
  )
}

export default ProductImage