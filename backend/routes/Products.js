
const express = require("express");
const Product = require("../models/Products");

const router = express.Router();

// ตรวจสอบว่าเป็น Admin หรือไม่
function requireAdmin(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({
            message: "Please login first"
        });
    }

    if (req.session.userRole !== "admin") {
        return res.status(403).json({
            message: "Admin only"
        });
    }

    next();
}

// เพิ่มสินค้า - Admin เท่านั้น
router.post("/", requireAdmin, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            image,
            category,
            stock
        } = req.body;

        if (
            !name ||
            !description ||
            price === undefined ||
            price === null ||
            !image ||
            !category
        ) {
            return res.status(400).json({
                message: "Please fill in all required fields"
            });
        }

        const newProduct = new Product({
            name,
            description,
            price,
            image,
            category,
            stock
        });

        await newProduct.save();

        res.status(201).json({
            message: "Product added successfully!",
            product: newProduct
        });

    } catch (error) {
        res.status(400).json({
            message: "Failed to add product",
            error: error.message
        });
    }
});

// ดูสินค้าทั้งหมด - ทุกคนเข้าดูได้
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();

        res.json({
            message: "Products retrieved successfully!",
            products: products
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// ดูสินค้ารายชิ้น - ทุกคนเข้าดูได้
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(product);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// แก้ไขสินค้า - Admin เท่านั้น
router.put("/:id", requireAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Product updated successfully!",
            product: updatedProduct
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// ลบสินค้า - Admin เท่านั้น
router.delete("/:id", requireAdmin, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(
            req.params.id
        );

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Product deleted successfully!"
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

module.exports = router;
