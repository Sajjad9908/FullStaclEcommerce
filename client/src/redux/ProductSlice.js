
import { createSlice } from "@reduxjs/toolkit";

const productSlice=createSlice({
    name:'products',
    initialState:{
        products:[],
        cart:[],
        address:[],
        selectedAddress:null
    },
    reducers:{
        setProductData:(state,action)=>{
            state.products=action.payload

        },
        setCart:(state,action)=>{
            state.cart=action.payload
        },
        //Adress Management
        addAddress:(state,action)=>{
            if(!state.address) state.address=[]
            state.address.push(action.payload)
        },
        setSelectedAddress:(state,action)=>{
            state.selectedAddress=action.payload
        },
        deleteAddress:(state,action)=>{
            const deletedIndex = action.payload
            const nextAddress = (state.address ?? []).filter((_,index)=>index!==action.payload)
            state.address=nextAddress
            //reset selected address
            if(state.selectedAddress===deletedIndex){
                state.selectedAddress=null
            } else if (state.selectedAddress > deletedIndex) {
                state.selectedAddress -= 1
            }
        }
    }
})
export const {setProductData,setCart,addAddress,setSelectedAddress,deleteAddress}=productSlice.actions
export default productSlice.reducer