// auth.admin.js
document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("loginBtn");
    const loginStatus = document.getElementById("loginStatus");

    if (!loginBtn) return;

    loginBtn.addEventListener("click", async () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

        if (error) {
            loginStatus.style.color = "red";
            loginStatus.textContent = `Login failed: ${error.message}`;
            return;
        }

        loginStatus.style.color = "#008080";
        loginStatus.textContent = "Login successful! Redirecting...";
        setTimeout(() => window.location.href = "admin.html", 1000);
    });
});
