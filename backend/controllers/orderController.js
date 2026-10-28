import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

// lazy stripe initialization
const getStripe = () => {
    if (!process.env.STRIPE_SECRET_KEY) {
        return null;
    }
    return new Stripe(process.env.STRIPE_SECRET_KEY);
};

// config variables
const currency = "inr";
const deliveryCharge = 50;

// Placing User Order for Frontend using stripe
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        const stripe = getStripe();
        if (!stripe) {
            return res.json({ 
                success: false, 
                message: "Stripe payment gateway is not configured. Please use Cash on Delivery." 
            });
        }

        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address,
            payment: false,
            status: "Pending",
            date: new Date()
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // Dynamic frontend origin based on incoming request header
        const origin = req.headers.origin || process.env.FRONTEND_URL || 'http://localhost:5173';

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: Math.round(item.price * 100)
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery Charge"
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items: line_items,
            mode: 'payment',
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.error("Place order (stripe) error:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to initiate Stripe payment" });
    }
};

// Placing User Order with Cash on Delivery
const placeOrderCod = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address,
            payment: false,
            status: "Pending",
            date: new Date()
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Order placed successfully! Kitchen is preparing your food." });

    } catch (error) {
        console.error("Place order (COD) error:", error);
        res.status(500).json({ success: false, message: "Failed to place order" });
    }
};

// Listing Order for Admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ date: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("List orders error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch orders" });
    }
};

// User Orders for Frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId }).sort({ date: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("User orders error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch your orders" });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        if (!orderId || !status) {
            return res.status(400).json({ success: false, message: "Order ID and status required" });
        }

        const order = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.json({ success: true, message: `Order status updated to: ${status}`, data: order });
    } catch (error) {
        console.error("Update status error:", error);
        res.status(500).json({ success: false, message: "Failed to update status" });
    }
};

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true, status: "Food Processing" });
            res.json({ success: true, message: "Payment verified successfully!" });
        } else {
            // Keep the order marked as Cancelled rather than deleting completely, so user has record
            await orderModel.findByIdAndUpdate(orderId, { status: "Cancelled", payment: false });
            res.json({ success: false, message: "Payment was not completed or cancelled" });
        }
    } catch (error) {
        console.error("Verify order error:", error);
        res.status(500).json({ success: false, message: "Verification failed" });
    }
};

export { placeOrder, listOrders, userOrders, updateStatus, verifyOrder, placeOrderCod };
