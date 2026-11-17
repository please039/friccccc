async function loadProducts() {
    const productContainer = document.getElementById("product");
    const loading = document.getElementById("loading");

    try {
        const [authResponse, productsResponse] = await Promise.all([
            fetch("/api/auth/status"),
            fetch("/products")
        ]);

        if (!authResponse.ok || !productsResponse.ok) {
            throw new Error("Cannot load products");
        }

        const authData = await authResponse.json();
        const data = await productsResponse.json();

        productContainer.replaceChildren();

        if (data.products.length === 0) {
            productContainer.textContent = "No products available.";
            return;
        }

        data.products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.className = "shop-product-card";

            const imageFrame = document.createElement("div");
            imageFrame.className = "shop-img-frame";

            const image = document.createElement("img");
            image.src = product.image;
            image.alt = product.name;
            image.className = "shop-image";
            imageFrame.appendChild(image);

            const name = document.createElement("h2");
            name.className = "product-name";
            name.textContent = product.name.toUpperCase();

            const price = document.createElement("p");
            price.className = "product-price";
            price.textContent = "$" + Number(product.price).toFixed(2);

            const cartButton = document.createElement("button");
            if (product.stock > 0) {
                cartButton.className = "product-btn";
                cartButton.textContent = "Add to Cart";
                cartButton.addEventListener("click", function () {
                    let cart = JSON.parse(localStorage.getItem("cart")) || [];
                    const existingProduct = cart.find(item => item._id === product._id);

                    if (existingProduct) {
                        existingProduct.quantity += 1;
                    } else {
                        cart.push({
                            _id: product._id,
                            name: product.name,
                            price: product.price,
                            image: product.image,
                            quantity: 1
                        });
                    }

                    localStorage.setItem("cart", JSON.stringify(cart));
                    alert(product.name + " added to cart!");
                });
            } else {
                cartButton.className = "product-btn2";
                cartButton.textContent = "SOLD OUT";
                cartButton.disabled = true;
            }

            productCard.append(imageFrame, name, price, cartButton);

            if (authData.isAdmin) {
                const editButton = document.createElement("button");
                editButton.type = "button";
                editButton.className = "btn btn-outline-dark w-100 mt-2";
                editButton.textContent = "EDIT PRODUCT";
                editButton.addEventListener("click", () => openEditProduct(product));

                const deleteButton = document.createElement("button");
                deleteButton.type = "button";
                deleteButton.className = "btn btn-outline-danger w-100 mt-2";
                deleteButton.textContent = "DELETE PRODUCT";
                deleteButton.addEventListener("click", () => deleteProduct(product));

                productCard.append(editButton, deleteButton);
            }

            productContainer.appendChild(productCard);
        });
    } catch (error) {
        console.error("Product loading error:", error);
        productContainer.replaceChildren();
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Failed to load products.";
        productContainer.appendChild(errorMessage);
    } finally {
        loading?.remove();
    }
}

function openEditProduct(product) {
    document.getElementById("editProductId").value = product._id;
    document.getElementById("editProductName").value = product.name;
    document.getElementById("editProductDescription").value = product.description;
    document.getElementById("editProductPrice").value = product.price;
    document.getElementById("editProductStock").value = product.stock;
    document.getElementById("editProductImage").value = product.image;
    document.getElementById("editProductCategory").value = product.category;

    bootstrap.Modal.getOrCreateInstance(
        document.getElementById("editProductModal")
    ).show();
}

async function deleteProduct(product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) {
        return;
    }

    try {
        const response = await fetch(`/products/${encodeURIComponent(product._id)}`, {
            method: "DELETE"
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Cannot delete product");
        }

        await loadProducts();
        alert("Product deleted successfully.");
    } catch (error) {
        console.error("Product deletion error:", error);
        alert(error.message || "Cannot connect to server");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const editProductForm = document.getElementById("editProductForm");

    editProductForm.addEventListener("submit", async event => {
        event.preventDefault();

        const productId = document.getElementById("editProductId").value;
        const productData = {
            name: document.getElementById("editProductName").value,
            description: document.getElementById("editProductDescription").value,
            price: Number(document.getElementById("editProductPrice").value),
            stock: Number(document.getElementById("editProductStock").value),
            image: document.getElementById("editProductImage").value,
            category: document.getElementById("editProductCategory").value
        };

        try {
            const response = await fetch(`/products/${encodeURIComponent(productId)}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(productData)
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Cannot update product");
            }

            bootstrap.Modal.getOrCreateInstance(
                document.getElementById("editProductModal")
            ).hide();
            await loadProducts();
            alert("Product updated successfully.");
        } catch (error) {
            console.error("Product update error:", error);
            alert(error.message || "Cannot connect to server");
        }
    });

    loadProducts();
});
