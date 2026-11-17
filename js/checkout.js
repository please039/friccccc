
let cart = JSON.parse(localStorage.getItem("cart")) || [];


// โหลดและแสดงข้อมูลสินค้าในหน้า Checkout
function loadCheckout() {

    // ดึงตำแหน่ง HTML สำหรับแสดงรายการสินค้าและราคารวม
    const checkoutItems = document.getElementById("checkoutItems");
    const checkoutTotal = document.getElementById("checkoutTotal");

    // ล้างรายการสินค้าเดิม
    checkoutItems.innerHTML = "";

    // กำหนดราคารวมเริ่มต้นเป็น 0
    let total = 0;

    // ตรวจสอบว่ามีสินค้าในตะกร้าหรือไม่
    if (cart.length === 0) {

        checkoutItems.textContent = "Your cart is empty.";
        checkoutTotal.textContent = "0.00";
        return;
    }

    // วนลูปแสดงสินค้าแต่ละรายการในตะกร้า
    cart.forEach(function (product) {

        // คำนวณราคารวมของสินค้าแต่ละรายการ
        const subtotal = Number(product.price) * product.quantity;

        // สร้างกล่องสำหรับแสดงสินค้าแต่ละรายการ
        const item = document.createElement("div");
        item.className = "d-flex justify-content-between mb-3";

        // สร้างข้อความแสดงชื่อสินค้าและจำนวนสินค้า
        const name = document.createElement("span");
        name.textContent = product.name + " x " + product.quantity;

        // สร้างข้อความแสดงราคารวมของสินค้ารายการนั้น
        const price = document.createElement("span");
        price.textContent = "$" + subtotal.toFixed(2);

        // นำชื่อสินค้าและราคาใส่ลงในกล่องสินค้า
        item.appendChild(name);
        item.appendChild(price);

        // นำกล่องสินค้าไปแสดงในหน้า Checkout
        checkoutItems.appendChild(item);

        // บวกราคาสินค้าแต่ละรายการเข้ากับราคารวมทั้งหมด
        total += subtotal;

    });

    // แสดงราคารวมทั้งหมด โดยกำหนดทศนิยม 2 ตำแหน่ง
    checkoutTotal.textContent = total.toFixed(2);
}


// ส่งคำสั่งซื้อไปยัง Backend เมื่อผู้ใช้กด Checkout
document.getElementById("checkoutForm").addEventListener("submit", async function (event) {

    // ป้องกันไม่ให้หน้าเว็บ Reload เมื่อกด Submit
    event.preventDefault();

    // ตรวจสอบว่าตะกร้ามีสินค้าหรือไม่
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // รวบรวมข้อมูลลูกค้าและรายการสินค้าที่ต้องการสั่งซื้อ
    const orderData = {

        // ข้อมูลของลูกค้า
        customerName: document.getElementById("customerName").value,
        customerEmail: document.getElementById("customerEmail").value,
        customerPhone: document.getElementById("customerPhone").value,
        shippingAddress: document.getElementById("shippingAddress").value,
        orderNote: document.getElementById("orderNote").value,

        // ดึงเฉพาะ ID และจำนวนสินค้าจากตะกร้า
        // เพื่อส่งรายการสินค้าไปยัง Backend
        items: cart.map(function (product) {
            return {
                productId: product._id,
                quantity: product.quantity
            };
        })

    };

    try {

        // ส่งข้อมูลคำสั่งซื้อไปยัง Backend ผ่าน POST Request
        const response = await fetch("/orders", {

            method: "POST",

            // ระบุว่าข้อมูลที่ส่งไปเป็นรูปแบบ JSON
            headers: {
                "Content-Type": "application/json"
            },

            // แปลงข้อมูลคำสั่งซื้อเป็น JSON ก่อนส่ง
            body: JSON.stringify(orderData)

        });

        // รับข้อมูลตอบกลับจาก Backend และแปลงเป็น JSON
        const data = await response.json();

        // ตรวจสอบว่าการสร้างคำสั่งซื้อสำเร็จหรือไม่
        if (!response.ok) {

            // ถ้าไม่สำเร็จ แสดงข้อความแจ้งเตือนจาก Backend
            alert(data.message);
            return;
        }

        // ล้างข้อมูลตะกร้าสินค้าหลังจากบันทึกคำสั่งซื้อสำเร็จ
        localStorage.removeItem("cart");

        // แจ้งเตือนว่าทำรายการสั่งซื้อสำเร็จ
        alert("Order placed successfully!");

        // เปลี่ยนเส้นทางไปยังหน้า Shop
        window.location.href = "/shop";

    } catch (error) {

        // แสดงรายละเอียดข้อผิดพลาดใน Console
        console.error("Checkout error:", error);

        // แจ้งเตือนเมื่อไม่สามารถเชื่อมต่อกับ Server ได้
        alert("Cannot connect to server. Please try again.");

    }

});


document.addEventListener("DOMContentLoaded", loadCheckout);