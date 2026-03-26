import crypto from "crypto";
import Cart from "../model/CartModel.js";
import Order from "../model/OrderModel.js";

const REQUIRED_ADDRESS_FIELDS = [
    "fullName",
    "phone",
    "email",
    "address",
    "city",
    "state",
    "zip",
    "country"
];

const PAYMENT_METHODS = new Set(["cod", "easypaisa", "jazzcash", "bank_transfer", "card"]);
const SUCCESS_CODES = new Set(["0000", "000", "success", "successful", "paid", "completed"]);

const normalizePaymentMethod = (value = "cod") => String(value).trim().toLowerCase();

const formatAddress = (shippingAddress = {}) => {
    const normalizedAddress = Object.fromEntries(
        REQUIRED_ADDRESS_FIELDS.map((field) => [field, String(shippingAddress[field] ?? "").trim()])
    );

    const missingField = REQUIRED_ADDRESS_FIELDS.find((field) => !normalizedAddress[field]);
    if (missingField) {
        throw new Error(`Shipping address field is required: ${missingField}`);
    }

    return normalizedAddress;
};

const calculateShipping = (subTotal) => (subTotal > 299 ? 0 : 10);
const calculateTax = (subTotal) => Number((subTotal * 0.05).toFixed(2));

const formatEasypaisaTimestamp = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

const serializeForSignature = (payload) => Object.entries(payload)
    .filter(([key, value]) => key !== "merchantHashedReq" && value !== undefined && value !== null && value !== "")
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([, value]) => String(value).trim())
    .join("&");

const generateHmacSignature = (payload, secret) => crypto
    .createHmac("sha256", secret)
    .update(serializeForSignature(payload))
    .digest("hex");

const buildOrderFromCart = (cart) => {
    const products = cart.items.map((item) => ({
        productId: item.productId?._id ?? item.productId,
        quantity: item.quantity,
        price: item.price
    }));

    const subTotal = Number(cart.totalPrice ?? 0);
    const shipping = calculateShipping(subTotal);
    const tax = calculateTax(subTotal);
    const amount = Number((subTotal + shipping + tax).toFixed(2));

    return {
        products,
        subTotal,
        shipping,
        tax,
        amount
    };
};

const buildEasypaisaPayload = ({ order, shippingAddress }) => {
    const expiryMinutes = Number(process.env.EASYPAISA_EXPIRY_MINUTES ?? 60);
    const expiryDate = new Date(Date.now() + expiryMinutes * 60 * 1000);

    const payload = {
        storeId: process.env.EASYPAISA_STORE_ID,
        amount: order.amount.toFixed(2),
        postBackURL: process.env.EASYPAISA_POST_BACK_URL,
        orderRefNum: order._id.toString(),
        autoRedirect: process.env.EASYPAISA_AUTO_REDIRECT ?? "1",
        emailAddr: shippingAddress.email,
        mobileNum: shippingAddress.phone,
        expiryDate: formatEasypaisaTimestamp(expiryDate),
        paymentMethod: process.env.EASYPAISA_PAYMENT_METHOD ?? "MA_PAYMENT_METHOD"
    };

    const hashKey = process.env.EASYPAISA_HASH_KEY;
    if (hashKey) {
        payload.merchantHashedReq = generateHmacSignature(payload, hashKey);
    }

    return {
        apiUrl: process.env.EASYPAISA_API_URL ?? "https://easypay.easypaisa.com.pk/easypay-service/rest/v4/initiate-ma-transaction",
        payload
    };
};

const initiateRemotePayment = async ({ apiUrl, payload }) => {
    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const text = await response.text();
    let data;

    try {
        data = text ? JSON.parse(text) : {};
    } catch {
        data = { raw: text };
    }

    if (!response.ok) {
        throw new Error(data?.message || data?.responseDesc || "Failed to initiate payment");
    }

    return data;
};

const clearCart = async (userId) => {
    await Cart.findOneAndUpdate(
        { userId },
        { $set: { items: [], totalPrice: 0 } },
        { returnDocument: 'after' }
    );
};

const isSuccessfulPayment = (payload = {}) => {
    const responseCode = String(payload.responseCode ?? payload.pp_ResponseCode ?? payload.status ?? payload.paymentStatus ?? "")
        .trim()
        .toLowerCase();

    return SUCCESS_CODES.has(responseCode);
};

export const createOrder = async (req, res) => {
    try {
        const userId = req.id;
        const paymentMethod = normalizePaymentMethod(req.body.paymentMethod);

        if (!PAYMENT_METHODS.has(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment method"
            });
        }

        let shippingAddress;
        try {
            shippingAddress = formatAddress(req.body.shippingAddress);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        const cart = await Cart.findOne({ userId }).populate("items.productId");
        if (!cart || !cart.items.length) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        const totals = buildOrderFromCart(cart);
        const order = await Order.create({
            user: userId,
            products: totals.products,
            amount: totals.amount,
            tax: totals.tax,
            shipping: totals.shipping,
            currency: process.env.ORDER_CURRENCY ?? "PKR",
            paymentMethod,
            paymentStatus: paymentMethod === "cod" ? "pending" : "initiated",
            shippingAddress,
            transactionId: `${paymentMethod.toUpperCase()}-${crypto.randomUUID()}`
        });

        if (paymentMethod === "cod") {
            await clearCart(userId);

            return res.status(201).json({
                success: true,
                message: "Order created successfully",
                order
            });
        }

        if (paymentMethod !== "easypaisa") {
            order.paymentMeta = {
                integrationStatus: "pending_manual_gateway_setup"
            };
            await order.save();

            return res.status(201).json({
                success: true,
                message: "Order created. Gateway setup is pending for this payment method.",
                order
            });
        }

        const missingConfig = ["EASYPAISA_STORE_ID", "EASYPAISA_POST_BACK_URL"]
            .filter((key) => !process.env[key]);

        if (missingConfig.length > 0) {
            return res.status(500).json({
                success: false,
                message: `Missing Easypaisa configuration: ${missingConfig.join(", ")}`
            });
        }

        const easypaisa = buildEasypaisaPayload({ order, shippingAddress });
        let gatewayResponse = null;

        if (process.env.EASYPAISA_INITIATE_ON_SERVER === "true") {
            gatewayResponse = await initiateRemotePayment(easypaisa);
        }

        order.gatewayOrderId = gatewayResponse?.orderRefNum || order._id.toString();
        order.paymentMeta = {
            provider: "easypaisa",
            checkoutUrl: easypaisa.apiUrl,
            requestPayload: easypaisa.payload,
            gatewayResponse
        };
        await order.save();

        return res.status(201).json({
            success: true,
            message: "Order created. Submit the returned payload to Easypaisa checkout.",
            order,
            payment: {
                provider: "easypaisa",
                checkoutUrl: easypaisa.apiUrl,
                payload: easypaisa.payload,
                gatewayResponse
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create order"
        });
    }
};

export const handleEasypaisaCallback = async (req, res) => {
    try {
        const payload = { ...req.query, ...req.body };
        const orderReference = payload.orderRefNum || payload.orderId || payload.gatewayOrderId;

        if (!orderReference) {
            return res.status(400).json({
                success: false,
                message: "orderRefNum is required"
            });
        }

        const order = await Order.findById(orderReference) || await Order.findOne({ gatewayOrderId: orderReference });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.gatewayPaymentId = payload.paymentId || payload.transactionId || order.gatewayPaymentId;
        order.gatewaySignature = payload.merchantHashedReq || payload.secureHash || order.gatewaySignature;
        order.transactionId = payload.transactionId || order.transactionId;
        order.paymentMeta = {
            ...(order.paymentMeta || {}),
            callbackPayload: payload
        };

        if (isSuccessfulPayment(payload)) {
            order.paymentStatus = "paid";
            order.status = "confirmed";
            await clearCart(order.user);
        } else {
            order.paymentStatus = "failed";
        }

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Callback processed successfully",
            order
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to process Easypaisa callback"
        });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.id })
            .populate("products.productId")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch orders"
        });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.orderId,
            user: req.id
        }).populate("products.productId");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch order"
        });
    }
};