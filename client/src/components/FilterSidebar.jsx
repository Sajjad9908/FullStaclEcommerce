import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'


const FilterSidebar = ({product,priceRange,setPriceRange,category,setCategory,brand,setBrand,search,setSearch}) => {

  const categories=Array.isArray(product)?product.map((item)=>item.category).filter(Boolean):[]
  const uniqueCategory=['All',...new Set(categories)]
  const brands=Array.isArray(product)?product.map((item)=>item.brand).filter(Boolean):[]
  const uniqueBrand=['All',...new Set(brands)]
  console.log(uniqueBrand);

const handleCategory=(val)=>{
  setCategory(val)
}

const handleBrand=(e)=>{
  setBrand(e.target.value)
}

const handleMinRange=(e)=>{
  const value=Number(e.target.value)
  if(value<=priceRange[1]){
    setPriceRange([value,priceRange[1]])
}


}
const handleMaxRange=(e)=>{
  const value=Number(e.target.value)
  if(value>=priceRange[0]){
    setPriceRange([priceRange[0],value])
  }
}

const resetFilter=()=>{
  setSearch('')
  setCategory('All')
  setBrand('All')
  setPriceRange([0,999999])
}

  return (
   <>
   <div className='bg-gray-100 mt-10 p-4 rounded-md h-max hidden md:block w-64'>
    <h1 className='mt-5 font-semibold text-xl'>Categories</h1>
    <Input value={search} onChange={(e)=>setSearch(e.target.value)} type='search' className="bg-gray-100 p-2 rounded-md border-2 border-gray-400 w-full mt-3"/>
    <div className='flex gap-2 flex-col'>
      {uniqueCategory.map((item,index)=>(
        <div key={index} className='flex items-center gap-2 mt-3'>
         
          <input type='radio' checked={category===item} onChange={()=>handleCategory(item)} className='w-4 h-4'/>
          <label htmlFor=''>{item}</label>
          </div>
      ))}
    </div>

    <h1 className='mt-5 font-semibold text-xl'>Brands</h1>=2

    <div className='flex gap-2 flex-col'>
       <select className="w-full bg-white border-2 border-gray-200 rounded-md"value={brand} onChange={handleBrand}>
          
      {uniqueBrand.map((item,index)=>(
      
         <option key={index} value={item}>{item.toUpperCase()}</option>
       ))}
         </select>
         <h1 className='mt-5 font-semibold text-xl mb-3'>Price Range</h1>
         <div className='flex flex-col gap-2'>
          <label> ${priceRange[0]} - $ {priceRange[1]}:</label>
          <div className='flex gap-2 items-center'>
            <input type='number'min="0" max="5000" value={priceRange[0]} onChange={handleMinRange} className='w-20 p-1 border border-gray-300 rounded'/>
            <span>-</span>
              <input type='number'min="0" max="999999"  onChange={handleMaxRange} className='w-20 p-1 border border-gray-300 rounded'/>
          </div>
          <input type='range' min='0' max='5000' step='100' className='w-full' value={priceRange[0]} onChange={(handleMinRange)}/>
          <input type='range' min='0' max='999999' step='100' className='w-full' value={priceRange[1]} onChange={handleMaxRange}/>
         </div>
         <Button className='bg-pink-600 text-white mt-5 cursor-pointer w-full' onClick={resetFilter}>reset Filters</Button>

    </div>
   </div>
   </>
  )
}

export default FilterSidebar