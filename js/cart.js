
// ดึงข้อมูลตะกร้าจาก Local Storage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// แสดงสินค้าในตะกร้า
function loadCart() {

    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    cartItems.innerHTML = "";

    let total = 0;

    // ตรวจสอบว่าตะกร้าว่างหรือไม่
    if (cart.length === 0) {
        cartItems.textContent = "Your cart is empty.";
        cartTotal.textContent = "0.00";
        return;
    }

    // วนแสดงสินค้า
    cart.forEach(product => {

        const item = document.createElement("div");
        item.className = "d-flex align-items-center justify-content-between border-bottom py-3";

        const info = document.createElement("div");

        // ชื่อสินค้า
        const name = document.createElement("h5");
        name.textContent = product.name;

        // ราคา
        const price = document.createElement("p");
        price.textContent = "$" + Number(product.price).toFixed(2);

        // ปุ่มลดจำนวน
        const decrease = document.createElement("button");
        decrease.textContent = "-";
        decrease.className = "btn btn-secondary btn-sm me-2";

        decrease.addEventListener("click", function () {

            if (product.quantity > 1) {
                product.quantity--;
                saveCart();
            }

        });

        // จำนวนสินค้า
        const quantity = document.createElement("span");
        quantity.textContent = product.quantity;

        // ปุ่มเพิ่มจำนวน
        const increase = document.createElement("button");
        increase.textContent = "+";
        increase.className = "btn btn-secondary btn-sm ms-2";

        increase.addEventListener("click", function () {

            product.quantity++;
            saveCart();

        });

        // ปุ่มลบสินค้า
        const remove = document.createElement("button");
        remove.textContent = "Remove";
        remove.className = "btn btn-danger btn-sm ms-3";

        remove.addEventListener("click", function () {

            cart = cart.filter(item => item._id !== product._id);
            saveCart();

        });

        // ราคารวมของสินค้านั้น
        const subtotal = Number(product.price) * product.quantity;

        const subtotalText = document.createElement("p");
        subtotalText.textContent = "$" + subtotal.toFixed(2);

        // รวมข้อมูลเข้าด้วยกัน
        info.appendChild(name);
        info.appendChild(price);
        info.appendChild(decrease);
        info.appendChild(quantity);
        info.appendChild(increase);
        info.appendChild(remove);

        item.appendChild(info);
        item.appendChild(subtotalText);

        cartItems.appendChild(item);

        total += subtotal;

    });

    // แสดงราคารวมทั้งหมด
    cartTotal.textContent = total.toFixed(2);

}

// บันทึกข้อมูลและแสดงตะกร้าใหม่
function saveCart() {

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();

}

// โหลดตะกร้าเมื่อเปิดหน้า
document.addEventListener("DOMContentLoaded", loadCart);
