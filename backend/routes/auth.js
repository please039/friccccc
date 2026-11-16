
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const path = require("path");

const router = express.Router();

// ตรวจสอบว่าผู้ใช้ Login แล้วหรือยัง
function requireLogin(req, res, next) {
    if (!req.session.userId) {
        return res.redirect("/login");
    }

    next();
}

// แสดงหน้า Signup
router.get("/signup", (req, res) => {
    res.render("signup");
});

// สมัครสมาชิก
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // ตรวจสอบว่ากรอกข้อมูลครบหรือไม่
        if (!name || !email || !password || !confirmPassword) {
            return res.send("Please fill in all fields");
        }

        // ตรวจสอบความยาว Password
        if (password.length < 8) {
            return res.send("Password must be at least 8 characters");
        }

        // ตรวจสอบ Password ทั้งสองช่อง
        if (password !== confirmPassword) {
            return res.send("Passwords do not match");
        }

        const cleanEmail = email.toLowerCase().trim();

        if (!/^[^\s@]+@gmail\.com$/.test(cleanEmail)) {
            return res.status(400).send("Only @gmail.com email addresses are allowed");
        }

        // ตรวจสอบ Email ซ้ำ
        const existingUser = await User.findOne({
            email: cleanEmail
        });

        if (existingUser) {
            return res.send("Email already exists");
        }

        // เข้ารหัส Password
        const hashedPassword = await bcrypt.hash(password, 12);

        // สร้างสมาชิกใหม่
        const newUser = new User({
            name: name.trim(),
            email: cleanEmail,
            password: hashedPassword
        });

        await newUser.save();

        // สมัครสมาชิกสำเร็จ กลับไปหน้า Login
        res.redirect("/login");

    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// แสดงหน้า Login
router.get("/login", (req, res) => {
    res.render("login");
});

// ตรวจสอบการ Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // ตรวจสอบว่ากรอกข้อมูลครบหรือไม่
        if (!email || !password) {
            return res.send("Please enter email and password");
        }

        const cleanEmail = email.toLowerCase().trim();

        if (!/^[^\s@]+@gmail\.com$/.test(cleanEmail)) {
            return res.status(400).send("Only @gmail.com email addresses are allowed");
        }

        // ค้นหาสมาชิกด้วย Email
        const user = await User.findOne({
            email: cleanEmail
        });

        if (!user) {
            return res.send("Invalid email or password");
        }

        // เปรียบเทียบ Password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.send("Invalid email or password");
        }

        // บันทึกข้อมูลสมาชิกลง Session
        req.session.userId = user._id;
        req.session.userName = user.name;
        req.session.userRole = user.role;
        // Login สำเร็จ กลับไปหน้า Home
        req.session.save((err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Session error");
            }

            res.redirect("/");
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// Logout
router.post("/logout", (req, res) => {
    req.session.destroy((err) => {

        if (err) {
            return res.status(500).send("Logout failed");
        }

        res.clearCookie("connect.sid");
        res.redirect("/login");
    });
});

// เข้าใช้งานหน้า Shop ได้เฉพาะคนที่ Login แล้ว
router.get("/shop", requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, "../../shop.html"));
});

router.get("/shop.html", requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, "../../shop.html"));
});

module.exports = router;
