
const express = require("express");
const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/Products");

const router = express.Router();

// ตรวจสอบว่าผู้ใช้ Login แล้วหรือยัง
function requireLogin(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({
            message: "Please login first"
        });
    }

    next();
}

// สร้างคำสั่งซื้อ
router.post("/", requireLogin, async (req, res) => {

    try {

        const {
            customerName,
            customerEmail,
            customerPhone,
            shippingAddress,
            orderNote,
            items
        } = req.body;

        // ตรวจสอบข้อมูลลูกค้า
        if (
            !customerName ||
            !customerEmail ||
            !customerPhone ||
            !shippingAddress
        ) {
            return res.status(400).json({
                message: "Please complete all shipping information"
            });
        }

        // ตรวจสอบรายการสินค้า
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Your cart is empty"
            });
        }

        let orderItems = [];
        let total = 0;

        // ตรวจสอบสินค้าและราคาใน MongoDB
        for (const item of items) {

            if (
                !mongoose.Types.ObjectId.isValid(item.productId) ||
                !Number.isInteger(item.quantity) ||
                item.quantity < 1
            ) {
                return res.status(400).json({
                    message: "Invalid product information"
                });
            }

            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: product.name + " does not have enough stock"
                });
            }

            const subtotal = product.price * item.quantity;

            orderItems.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity
            });

            total += subtotal;
        }

        // บันทึกคำสั่งซื้อลง MongoDB
        const order = new Order({

            user: req.session.userId,

            customerName,
            customerEmail,
            customerPhone,
            shippingAddress,
            orderNote: orderNote || "",

            items: orderItems,
            total

        });

        await order.save();

        res.status(201).json({
            message: "Order placed successfully!",
            order
        });

    } catch (error) {

        console.error("Create order error:", error);

        res.status(500).json({
            message: "Something went wrong"
        });

    }

});

module.exports = router;
