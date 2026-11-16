
async function loadProducts() {

    const productContainer = document.getElementById("product");
    const loading = document.getElementById("loading");

    try {

        // ขอข้อมูลสินค้าจาก Backend
        const response = await fetch("/products");

        if (!response.ok) {
            throw new Error("Cannot load products");
        }

        const data = await response.json();

        // ลบข้อความ Loading
        loading.remove();

        // ตรวจสอบว่ามีสินค้าหรือไม่
        if (data.products.length === 0) {
            productContainer.textContent = "No products available.";
            return;
        }

        // วนแสดงสินค้าทั้งหมด
        data.products.forEach(product => {

            const productCard = document.createElement("div");
            productCard.className = "shop-product-card";

            // รูปสินค้า
            const imageFrame = document.createElement("div");
            imageFrame.className = "shop-img-frame";

            const image = document.createElement("img");
            image.src = product.image;
            image.alt = product.name;
            image.className = "shop-image";

            imageFrame.appendChild(image);

            // ชื่อสินค้า
            const name = document.createElement("h2");
            name.className = "product-name";
            name.textContent = product.name.toUpperCase();

            // ราคา
            const price = document.createElement("p");
            price.className = "product-price";
            price.textContent = "$" + Number(product.price).toFixed(2);

            // ปุ่มสินค้า
            const button = document.createElement("button");

            if (product.stock > 0) {

                button.className = "product-btn";
                button.textContent = "Add to Cart";

                // เพิ่มสินค้าลงตะกร้า
                button.addEventListener("click", function () {

                    // ดึงข้อมูลตะกร้าจาก localStorage
                    let cart = JSON.parse(localStorage.getItem("cart")) || [];

                    // ตรวจสอบว่าสินค้านี้อยู่ในตะกร้าแล้วหรือยัง
                    const existingProduct = cart.find(item => item._id === product._id);

                    if (existingProduct) {

                        // ถ้ามีแล้ว เพิ่มจำนวน
                        existingProduct.quantity += 1;

                    } else {

                        // ถ้ายังไม่มี เพิ่มสินค้าใหม่
                        cart.push({
                            _id: product._id,
                            name: product.name,
                            price: product.price,
                            image: product.image,
                            quantity: 1
                        });

                    }

                    // บันทึกข้อมูลลง localStorage
                    localStorage.setItem("cart", JSON.stringify(cart));

                    alert(product.name + " added to cart!");

                });

            } else {

                button.className = "product-btn2";
                button.textContent = "SOLD OUT";
                button.disabled = true;

            }

            // รวมทุกส่วนเข้าด้วยกัน
            productCard.appendChild(imageFrame);
            productCard.appendChild(name);
            productCard.appendChild(price);
            productCard.appendChild(button);

            productContainer.appendChild(productCard);

        });

    } catch (error) {

        console.error("Product loading error:", error);

        loading.textContent = "Failed to load products.";

    }
}

document.addEventListener("DOMContentLoaded", loadProducts);
