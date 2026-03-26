import express from 'express'
import { isAuthenticated } from '../middleware/isAuthenticated.js'
import { addToCart, getAllCartItems, removeFromCart, UpdateQuantity } from '../controller/CartController.js'

const cartRoute=express.Router()

cartRoute.get('/',isAuthenticated,getAllCartItems)
cartRoute.post('/add',isAuthenticated,addToCart)
cartRoute.put('/update',isAuthenticated,UpdateQuantity)
cartRoute.delete('/remove',isAuthenticated,removeFromCart)


export default cartRoute