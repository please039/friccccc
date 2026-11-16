
async function checkLoginStatus() {
    try {
        const response = await fetch("/api/auth/status");
        const data = await response.json();

        const authMenu = document.getElementById("authMenu");

        if (!authMenu) return;

        authMenu.innerHTML = "";

        if (data.isLoggedIn) {

            // Welcome
            const welcomeItem = document.createElement("li");
            welcomeItem.className = "nav-item";

            const welcomeText = document.createElement("span");
            welcomeText.className = "nav-link";
            welcomeText.textContent = "Welcome, " + data.userName;

            welcomeItem.appendChild(welcomeText);
            authMenu.appendChild(welcomeItem);

            // Add Product - Admin only
            if (data.isAdmin) {
                const addProductItem = document.createElement("li");
                addProductItem.className = "nav-item";

                const addProductLink = document.createElement("a");
                addProductLink.className = "nav-link";
                addProductLink.href = "/add-product.html";
                addProductLink.textContent = "ADD PRODUCT";

                addProductItem.appendChild(addProductLink);
                authMenu.appendChild(addProductItem);
            }

            // Logout
            const logoutItem = document.createElement("li");
            logoutItem.className = "nav-item";

            const logoutForm = document.createElement("form");
            logoutForm.action = "/logout";
            logoutForm.method = "POST";

            const logoutButton = document.createElement("button");
            logoutButton.type = "submit";
            logoutButton.className = "nav-link btn";
            logoutButton.textContent = "LOGOUT";

            logoutForm.appendChild(logoutButton);
            logoutItem.appendChild(logoutForm);
            authMenu.appendChild(logoutItem);

        } else {

            authMenu.innerHTML = `
                <li class="nav-item">
                    <a class="nav-link" href="/login">LOGIN</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/signup">SIGN UP</a>
                </li>
            `;
        }

    } catch (error) {
        console.error("Login status error:", error);
    }
}

document.addEventListener("DOMContentLoaded", checkLoginStatus);
