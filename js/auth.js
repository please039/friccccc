async function checkLoginStatus() {
    try {
        const response = await fetch("/api/auth/status");

        const data = await response.json();

        const authMenu = document.getElementById("authMenu");

        if (!authMenu) return;

        authMenu.innerHTML = "";

        // ตรวจสอบว่าผู้ใช้ Login อยู่หรือไม่
        if (data.isLoggedIn) {

            // สร้างรายการ Welcome เพื่อแสดงชื่อผู้ใช้
            const welcomeItem = document.createElement("li");
            welcomeItem.className = "nav-item";

            const welcomeText = document.createElement("span");
            welcomeText.className = "nav-link";
            welcomeText.textContent = "Welcome, " + data.userName;

            // นำข้อความ Welcome ใส่ลงใน Navbar
            welcomeItem.appendChild(welcomeText);
            authMenu.appendChild(welcomeItem);

            // ตรวจสอบว่าผู้ใช้เป็น Admin หรือไม่
            if (data.isAdmin) {
                const addProductItem = document.createElement("li");
                addProductItem.className = "nav-item";

                // สร้างลิงก์ไปยังหน้า Add Product
                const addProductLink = document.createElement("a");
                addProductLink.className = "nav-link";
                addProductLink.href = "/add-product.html";
                addProductLink.textContent = "ADD PRODUCT";

                // เพิ่มลิงก์ Add Product ลงใน Navbar
                addProductItem.appendChild(addProductLink);
                authMenu.appendChild(addProductItem);
            }

            // สร้างเมนู Logout สำหรับผู้ใช้ที่ Login แล้ว
            const logoutItem = document.createElement("li");
            logoutItem.className = "nav-item";

            // สร้าง Form สำหรับส่งคำขอ Logout ไปยัง Backend
            const logoutForm = document.createElement("form");
            logoutForm.action = "/logout";
            logoutForm.method = "POST";

            // สร้างปุ่ม Logout
            const logoutButton = document.createElement("button");
            logoutButton.type = "submit";
            logoutButton.className = "nav-link btn";
            logoutButton.textContent = "LOGOUT";

            // นำปุ่ม Logout ใส่ใน Form
            logoutForm.appendChild(logoutButton);

            // นำ Form Logout ใส่ใน Navbar
            logoutItem.appendChild(logoutForm);
            authMenu.appendChild(logoutItem);

        } else {

            // ถ้าผู้ใช้ยังไม่ได้ Login ให้แสดงเมนู Login และ Sign Up
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

        // แสดงรายละเอียดข้อผิดพลาดใน Console
        console.error("Login status error:", error);
    }
}

// รอให้ HTML โหลดเสร็จ แล้วเรียกฟังก์ชันตรวจสอบสถานะ Login
document.addEventListener("DOMContentLoaded", checkLoginStatus);