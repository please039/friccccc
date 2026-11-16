
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function loadCheckout() {

    const checkoutItems = document.getElementById("checkoutItems");
    const checkoutTotal = document.getElementById("checkoutTotal");

    checkoutItems.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {
        checkoutItems.textContent = "Your cart is empty.";
        checkoutTotal.textContent = "0.00";
        return;
    }

    cart.forEach(function (product) {

        const subtotal = Number(product.price) * product.quantity;

        const item = document.createElement("div");
        item.className = "d-flex justify-content-between mb-3";

        const name = document.createElement("span");
        name.textContent = product.name + " x " + product.quantity;

        const price = document.createElement("span");
        price.textContent = "$" + subtotal.toFixed(2);

        item.appendChild(name);
        item.appendChild(price);

        checkoutItems.appendChild(item);

        total += subtotal;

    });

    checkoutTotal.textContent = total.toFixed(2);
}


// ส่งคำสั่งซื้อ
document.getElementById("checkoutForm").addEventListener("submit", async function (event) {

    event.preventDefault();

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const orderData = {

        customerName: document.getElementById("customerName").value,
        customerEmail: document.getElementById("customerEmail").value,
        customerPhone: document.getElementById("customerPhone").value,
        shippingAddress: document.getElementById("shippingAddress").value,
        orderNote: document.getElementById("orderNote").value,

        items: cart.map(function (product) {
            return {
                productId: product._id,
                quantity: product.quantity
            };
        })

    };

    try {

        const response = await fetch("/orders", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(orderData)

        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        // ล้างตะกร้าหลังบันทึกสำเร็จ
        localStorage.removeItem("cart");

        alert("Order placed successfully!");

        window.location.href = "/shop";

    } catch (error) {

        console.error("Checkout error:", error);

        alert("Cannot connect to server. Please try again.");

    }

});


document.addEventListener("DOMContentLoaded", loadCheckout);
