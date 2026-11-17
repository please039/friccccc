
const express = require("express");
const Visitor = require("../models/Visitor");

const router = express.Router();

// แปลงวันที่ปัจจุบันเป็นวันที่ประเทศไทย
function getBangkokDate() {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Bangkok",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(new Date());
}

// บันทึกผู้เข้าชมหน้า Home
router.post("/track", async (req, res) => {
    try {
        // ดึง IP Address 
        let ipAddress = req.ip;


        //ให้เป็น IPv4
        if (ipAddress === "::1") {
            ipAddress = "127.0.0.1";
        }

        // วันที่ปัจจุบันตามเวลาไทย
        const visitDate = getBangkokDate();

        // เวลาปัจจุบัน
        const now = new Date();

        // เพิ่มข้อมูลเฉพาะเมื่อ IP นี้ยังไม่มีในวันนี้
        const result = await Visitor.updateOne(
            {
                ipAddress: ipAddress,
                visitDate: visitDate
            },
            {
                $setOnInsert: {
                    ipAddress: ipAddress,
                    visitDate: visitDate,
                    firstVisitAt: now,
                    lastVisitAt: now
                }
            },
            {
                upsert: true
            }
        );

        // ถ้ามีข้อมูลเดิมแล้ว ให้อัปเดตเวลาล่าสุดเข้าชม
        if (result.upsertedCount === 0) {
            await Visitor.updateOne(
                {
                    ipAddress: ipAddress,
                    visitDate: visitDate
                },
                {
                    $set: {
                        lastVisitAt: now
                    }
                }
            );
        }

        res.json({
            success: true,
            message: "Visitor tracked successfully"
        });

    } catch (error) {
        console.error("Visitor Tracking Error:", error);

        res.status(500).json({
            success: false,
            message: "Cannot track visitor"
        });
    }
});

module.exports = router;
