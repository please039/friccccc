
async function loadProducts() {
    const productContainer = document.getElementById("product");
    const loading = document.getElementById("loading");

    try {
        // ดึงสถานะ Login และรายการสินค้าพร้อมกัน
        const [authResponse, productsResponse] = await Promise.all([
            fetch("/api/auth/status"),
            fetch("/products")
        ]);

        // ตรวจสอบว่าการเรียก API สำเร็จหรือไม่
        if (!authResponse.ok || !productsResponse.ok) {
            throw new Error("Cannot load products");
        }

        // แปลงข้อมูลที่ได้รับจาก API เป็น JSON
        const authData = await authResponse.json();
        const data = await productsResponse.json();

        // ล้างรายการสินค้าเดิมก่อนแสดงข้อมูลใหม่
        productContainer.replaceChildren();

        // ตรวจสอบว่ามีสินค้าอยู่ในระบบหรือไม่
        if (data.products.length === 0) {
            productContainer.textContent = "No products available.";
            return;
        }

        // วนลูปแสดงสินค้าทีละรายการ
        data.products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.className = "shop-product-card";

            // สร้างกรอบรูปสินค้า
            const imageFrame = document.createElement("div");
            imageFrame.className = "shop-img-frame";

            // แสดงรูปภาพสินค้า
            const image = document.createElement("img");
            image.src = product.image;
            image.alt = product.name;
            image.className = "shop-image";
            imageFrame.appendChild(image);

            // แสดงชื่อสินค้า
            const name = document.createElement("h2");
            name.className = "product-name";
            name.textContent = product.name.toUpperCase();

            // แสดงราคาสินค้า โดยกำหนดให้มีทศนิยม 2 ตำแหน่ง
            const price = document.createElement("p");
            price.className = "product-price";
            price.textContent = "$" + Number(product.price).toFixed(2);

            const cartButton = document.createElement("button");

            if (product.stock > 0) {
                // กรณีสินค้ามีสต็อก สามารถกดเพิ่มลงตะกร้าได้
                cartButton.className = "product-btn";
                cartButton.textContent = "Add to Cart";

                cartButton.addEventListener("click", function () {

                    // ดึงข้อมูลตะกร้าสินค้าจาก Local Storage
                    let cart = JSON.parse(localStorage.getItem("cart")) || [];

                    // ตรวจสอบว่าสินค้านี้มีอยู่ในตะกร้าแล้วหรือไม่
                    const existingProduct = cart.find(item => item._id === product._id);

                    if (existingProduct) {
                        // ถ้ามีสินค้าอยู่แล้ว ให้เพิ่มจำนวนสินค้า 1 ชิ้น
                        existingProduct.quantity += 1;
                    } else {
                        // ถ้ายังไม่มี ให้เพิ่มสินค้าใหม่ลงในตะกร้า
                        cart.push({
                            _id: product._id,
                            name: product.name,
                            price: product.price,
                            image: product.image,
                            quantity: 1
                        });
                    }

                    // บันทึกข้อมูลตะกร้าสินค้ากลับลง Local Storage
                    localStorage.setItem("cart", JSON.stringify(cart));

                    // แจ้งเตือนเมื่อเพิ่มสินค้าสำเร็จ
                    alert(product.name + " added to cart!");
                });

            } else {
                // กรณีสินค้าหมด แสดง SOLD OUT และปิดปุ่ม
                cartButton.className = "product-btn2";
                cartButton.textContent = "SOLD OUT";
                cartButton.disabled = true;
            }

            // นำรูป ชื่อ ราคา และปุ่มใส่ลงในการ์ดสินค้า
            productCard.append(imageFrame, name, price, cartButton);

            // ตรวจสอบว่าผู้ใช้เป็น Admin หรือไม่
            if (authData.isAdmin) {

                // แก้ไขสินค้า 
                const editButton = document.createElement("button");
                editButton.type = "button";
                editButton.className = "btn btn-outline-dark w-100 mt-2";
                editButton.textContent = "EDIT PRODUCT";

                // เมื่อกดปุ่ม จะเปิดหน้าต่างแก้ไขสินค้าพร้อมข้อมูลเดิม
                editButton.addEventListener("click", () => openEditProduct(product));


                // ลบสินค้า 
                const deleteButton = document.createElement("button");
                deleteButton.type = "button";
                deleteButton.className = "btn btn-outline-danger w-100 mt-2";
                deleteButton.textContent = "DELETE PRODUCT";

                // เมื่อกดปุ่ม จะเรียกฟังก์ชันลบสินค้า
                deleteButton.addEventListener("click", () => deleteProduct(product));

                // เพิ่มปุ่มแก้ไขและลบลงในการ์ดสินค้า
                productCard.append(editButton, deleteButton);
            }

            // นำการ์ดสินค้าไปแสดงบนหน้าเว็บไซต์
            productContainer.appendChild(productCard);
        });

    } catch (error) {

        // FEATURE 5: จัดการข้อผิดพลาดในการโหลดสินค้า (Error Handling)
        console.error("Product loading error:", error);

        // ล้างข้อมูลสินค้าเดิมและแสดงข้อความแจ้งข้อผิดพลาด
        productContainer.replaceChildren();

        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Failed to load products.";
        productContainer.appendChild(errorMessage);

    } finally {

        // ลบข้อความ Loading หลังจากทำงานเสร็จ
        loading?.remove();
    }
}

function openEditProduct(product) {

    // นำข้อมูลสินค้าเดิมไปใส่ในช่องกรอกข้อมูล
    document.getElementById("editProductId").value = product._id;
    document.getElementById("editProductName").value = product.name;
    document.getElementById("editProductDescription").value = product.description;
    document.getElementById("editProductPrice").value = product.price;
    document.getElementById("editProductStock").value = product.stock;
    document.getElementById("editProductImage").value = product.image;
    document.getElementById("editProductCategory").value = product.category;

    // เปิด Modal สำหรับแก้ไขสินค้า โดยใช้ Bootstrap
    bootstrap.Modal.getOrCreateInstance(
        document.getElementById("editProductModal")
    ).show();
}


async function deleteProduct(product) {

    // ถามเพื่อยืนยันก่อนลบสินค้า
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) {
        return;
    }

    try {

        // ส่ง DELETE Request ไปยัง Backend เพื่อลบสินค้าตาม ID
        const response = await fetch(`/products/${encodeURIComponent(product._id)}`, {
            method: "DELETE"
        });

        // รับผลลัพธ์จาก Backend
        const data = await response.json();

        // ตรวจสอบว่าการลบสินค้าสำเร็จหรือไม่
        if (!response.ok) {
            throw new Error(data.message || "Cannot delete product");
        }

        // โหลดรายการสินค้าใหม่หลังจากลบสำเร็จ
        await loadProducts();

        // แจ้งเตือนว่าลบสินค้าสำเร็จ
        alert("Product deleted successfully.");

    } catch (error) {

        // จัดการข้อผิดพลาดในการลบสินค้า
        console.error("Product deletion error:", error);
        alert(error.message || "Cannot connect to server");
    }
}


// รอให้ HTML โหลดเสร็จก่อนเริ่มทำงาน
document.addEventListener("DOMContentLoaded", () => {

    // ดึง Form สำหรับแก้ไขสินค้า
    const editProductForm = document.getElementById("editProductForm");

    // ตรวจจับเหตุการณ์เมื่อผู้ใช้กด Submit Form
    editProductForm.addEventListener("submit", async event => {

        // ป้องกันไม่ให้หน้าเว็บ Reload เมื่อ Submit Form
        event.preventDefault();

        // ดึง ID ของสินค้าที่ต้องการแก้ไข
        const productId = document.getElementById("editProductId").value;

        // รวบรวมข้อมูลใหม่จากช่องกรอกข้อมูล
        const productData = {
            name: document.getElementById("editProductName").value,
            description: document.getElementById("editProductDescription").value,
            price: Number(document.getElementById("editProductPrice").value),
            stock: Number(document.getElementById("editProductStock").value),
            image: document.getElementById("editProductImage").value,
            category: document.getElementById("editProductCategory").value
        };

        try {

            // ส่ง PUT Request ไปยัง Backend เพื่ออัปเดตสินค้า
            const response = await fetch(`/products/${encodeURIComponent(productId)}`, {
                method: "PUT",

                // ระบุว่าข้อมูลที่ส่งไปเป็น JSON
                headers: {
                    "Content-Type": "application/json"
                },

                // แปลงข้อมูลสินค้าเป็น JSON ก่อนส่งไป Backend
                body: JSON.stringify(productData)
            });

            // รับผลลัพธ์จาก Backend
            const data = await response.json();

            // ตรวจสอบว่าการอัปเดตสำเร็จหรือไม่
            if (!response.ok) {
                throw new Error(data.message || "Cannot update product");
            }

            // ปิดหน้าต่างแก้ไขสินค้าหลังอัปเดตสำเร็จ
            bootstrap.Modal.getOrCreateInstance(
                document.getElementById("editProductModal")
            ).hide();

            // โหลดรายการสินค้าใหม่เพื่อแสดงข้อมูลล่าสุด
            await loadProducts();

            // แจ้งเตือนว่าแก้ไขสินค้าสำเร็จ
            alert("Product updated successfully.");

        } catch (error) {

            // จัดการข้อผิดพลาดในการแก้ไขสินค้า
            console.error("Product update error:", error);
            alert(error.message || "Cannot connect to server");
        }
    });

  

    // เรียกฟังก์ชันโหลดสินค้าเมื่อ HTML โหลดเสร็จ
    loadProducts();
});