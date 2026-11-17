
const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
    ipAddress: {
        type: String,
        required: true
    },

    visitDate: {
        type: String,
        required: true
    },

    firstVisitAt: {
        type: Date,
        required: true
    },

    lastVisitAt: {
        type: Date,
        required: true
    }
});

// ป้องกัน IP เดิมถูกบันทึกซ้ำในวันเดียวกัน
visitorSchema.index(
    { ipAddress: 1, visitDate: 1 },
    { unique: true }
);

const Visitor = mongoose.model("Visitor", visitorSchema);

module.exports = Visitor;
