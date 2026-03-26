import express from "express";
import {
    createOrder,
    getMyOrders,
    getOrderById,
    handleEasypaisaCallback
} from "../controller/OrderController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const orderRoute = express.Router();

orderRoute.post("/create", isAuthenticated, createOrder);
orderRoute.get("/my-orders", isAuthenticated, getMyOrders);
orderRoute.get("/:orderId", isAuthenticated, getOrderById);
orderRoute.post("/easypaisa/callback", handleEasypaisaCallback);

export default orderRoute;