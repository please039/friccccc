
document.addEventListener("DOMContentLoaded", function () {

    console.log("Add Product JS Loaded!");

    const form = document.getElementById("addProductForm");

    if (!form) {
        console.log("Cannot find addProductForm!");
        return;
    }

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        console.log("Submit button clicked!");

        const productData = {
            name: document.getElementById("productName").value,
            description: document.getElementById("productDescription").value,
            price: Number(document.getElementById("productPrice").value),
            image: document.getElementById("productImage").value,
            category: document.getElementById("productCategory").value,
            stock: Number(document.getElementById("productStock").value)
        };

        try {
            const response = await fetch("/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(productData)
            });

            const data = await response.json().catch(() => ({}));

            console.log("Backend response:", data);

            if (!response.ok) {
                alert(data.message || "Cannot add product");
                return;
            }

            alert("Product added successfully!");
            form.reset();

        } catch (error) {
            console.error("Error:", error);
            alert("Cannot connect to server");
        }
    });
});


