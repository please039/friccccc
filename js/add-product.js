
document.addEventListener("DOMContentLoaded", function () {
  
    console.log("Add Product JS Loaded!");

    const form = document.getElementById("addProductForm");

    if (!form) {
        console.log("Cannot find addProductForm!");
        return;
    }

    // ตรวจเมื่อผู้ใช้กด Submit Form
    form.addEventListener("submit", async function (event) {

        // ป้องกันไม่ให้หน้าเว็บ Reload หลังจากกด Submit
        event.preventDefault();

        // แสดงข้อความใน Console เพื่อเช็กว่ามีการกด Submit แล้ว
        console.log("Submit button clicked!");

        // รวบรวมข้อมูลสินค้าจากช่องกรอกข้อมูลใน HTML
        const productData = {
            name: document.getElementById("productName").value,
            description: document.getElementById("productDescription").value,

            // แปลงราคาจาก String ให้เป็น Number
            price: Number(document.getElementById("productPrice").value),

            image: document.getElementById("productImage").value,
            category: document.getElementById("productCategory").value,

            // แปลงจำนวนสินค้าในสต็อกให้เป็น Number
            stock: Number(document.getElementById("productStock").value)
        };

        try {
            // ส่งข้อมูลสินค้าไปยัง Backend ด้วย POST Request
            const response = await fetch("/products", {
                method: "POST",

                // ระบุว่าข้อมูลที่ส่งไปเป็นรูปแบบ JSON
                headers: {
                    "Content-Type": "application/json"
                },

                // แปลงข้อมูลสินค้าเป็น JSON ก่อนส่งไป Backend
                body: JSON.stringify(productData)
            });

            // หากแปลง JSON ไม่สำเร็จ ให้ใช้ Object ว่างแทน
            const data = await response.json().catch(() => ({}));

            // แสดงผลลัพธ์ที่ได้รับจาก Backend ใน Console
            console.log("Backend response:", data);

            // ตรวจสอบว่า Request สำเร็จหรือไม่
            if (!response.ok) {

                // ถ้าไม่สำเร็จ ให้แสดงข้อความแจ้งเตือนจาก Backend
                alert(data.message || "Cannot add product");
                return;
            }

            // แจ้งเตือนเมื่อเพิ่มสินค้าสำเร็จ
            alert("Product added successfully!");

            // ล้างข้อมูลใน Form หลังจากเพิ่มสินค้าสำเร็จ
            form.reset();

        } catch (error) {

            // แสดงรายละเอียดข้อผิดพลาดใน Console
            console.error("Error:", error);

            // แจ้งเตือนเมื่อไม่สามารถเชื่อมต่อกับ Server ได้
            alert("Cannot connect to server");
        }
    });
});