
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");

require("dotenv").config();

const app = express();

// อ่านข้อมูลจาก Form และ JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ตั้งค่า Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// ตั้งค่า EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ส่งข้อมูลผู้ใช้ไปยัง EJS
app.use((req, res, next) => {
    res.locals.isLoggedIn = !!req.session.userId;
    res.locals.userName = req.session.userName || "";
    res.locals.isAdmin = req.session.userRole === "admin";
    next();
});

// เรียกใช้งาน Routes
const authRoutes = require("./routes/auth");
app.use("/", authRoutes);

const productRoutes = require("./routes/products");
app.use("/products", productRoutes);

const orderRoutes = require("./routes/orders");
app.use("/orders", orderRoutes);

// ตรวจสอบสถานะ Login
app.get("/api/auth/status", (req, res) => {
    if (req.session.userId) {
        res.json({
            isLoggedIn: true,
            userName: req.session.userName,
            isAdmin: req.session.userRole === "admin"
        });
    } else {
        res.json({
            isLoggedIn: false,
            isAdmin: false
        });
    }
});

// ตรวจสอบสิทธิ์ Admin
function requireAdmin(req, res, next) {
    if (!req.session.userId) {
        return res.redirect("/login");
    }

    if (req.session.userRole !== "admin") {
        return res.status(403).send("Access Denied - Admin Only");
    }

    next();
}

// หน้า Add Product - Admin เท่านั้น
app.get("/add-product.html", requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, "../add-product.html"));
});

// หน้าแรก
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"));
});

// เปิดให้เข้าถึงไฟล์ Frontend อื่น ๆ
app.use(express.static(path.join(__dirname, "..")));

// เชื่อมต่อ MongoDB และเปิด Server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected!");

        app.listen(process.env.PORT || 3000, () => {
            console.log("Server running at http://localhost:3000");
        });
    })
    .catch((error) => {
        console.log("MongoDB Connection Failed!");
        console.log(error.message);
    });
