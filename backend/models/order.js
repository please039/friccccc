
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    customerName: {
        type: String,
        required: true
    },

    customerEmail: {
        type: String,
        required: true
    },

    customerPhone: {
        type: String,
        required: true
    },

    shippingAddress: {
        type: String,
        required: true
    },

    orderNote: {
        type: String,
        default: ""
    },

    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },

            name: {
                type: String,
                required: true
            },

            price: {
                type: Number,
                required: true
            },

            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ],

    total: {
        type: Number,
        required: true,
        min: 0
    },

    status: {
        type: String,
        default: "Pending"
    }

}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
