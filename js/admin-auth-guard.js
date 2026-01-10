// ===============================
// ADMIN AUTH GUARD
// Include this in all admin pages
// ===============================
document.addEventListener("DOMContentLoaded", async () => {
    if (!window.supabaseClient) {
        console.error("Supabase client not loaded");
        return;
    }

    // -------------------------------
    // Define all admin page URLs
    // -------------------------------
    const adminPages = [
        "admin-create.html",
        "admin-skills.html",
        "admin-resume.html",
        "admin-mygallery.html",
        "admin-courses.html",
        "admin-projects.html",
        "admin-edit.html",
        "admin-projects-gallery.html",
        "admin-cover.html"
    ];

    const currentPage = window.location.pathname.split("/").pop();

    // -------------------------------
    // 1️⃣ Check Supabase session
    // -------------------------------
    const { data: { session } } = await supabaseClient.auth.getSession();
    const isAuthenticated = !!session;

    if (!isAuthenticated) {
        localStorage.removeItem("adminAuth");
        window.location.href = "loginpage.html";
        return;
    }

    // -------------------------------
    // 2️⃣ Set admin session flag
    // -------------------------------
    localStorage.setItem("adminAuth", "true");

    // -------------------------------
    // 3️⃣ Protect admin pages
    // -------------------------------
    if (!adminPages.includes(currentPage)) {
        await supabaseClient.auth.signOut();
        localStorage.removeItem("adminAuth");
        window.location.href = "loginpage.html";
        return;
    }

    // -------------------------------
    // 4️⃣ Block access if flag missing
    // -------------------------------
    if (localStorage.getItem("adminAuth") !== "true") {
        alert("You must log in to access admin pages.");
        window.location.href = "loginpage.html";
        return;
    }

    // -------------------------------
    // 5️⃣ Instant logout on external link clicks
    // -------------------------------
    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", async (e) => {
            const href = link.getAttribute("href");
            if (!href) return;

            // Check if link is NOT an admin page
            const isAdminLink = adminPages.some(p => href.includes(p));
            if (!isAdminLink) {
                await supabaseClient.auth.signOut();
                localStorage.removeItem("adminAuth");
                // Optional: redirect immediately
                // window.location.href = href; // let the browser handle navigation
            }
        });
    });

    // -------------------------------
    // 6️⃣ Optional: logout after inactivity
    // -------------------------------
    let logoutTimer;
    const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes

    function resetLogoutTimer() {
        clearTimeout(logoutTimer);
        logoutTimer = setTimeout(async () => {
            await supabaseClient.auth.signOut();
            localStorage.removeItem("adminAuth");
            alert("You were logged out due to inactivity.");
            window.location.href = "loginpage.html";
        }, INACTIVITY_LIMIT);
    }

    ["mousemove","keydown","click","scroll","touchstart"].forEach(evt => 
        document.addEventListener(evt, resetLogoutTimer)
    );

    resetLogoutTimer();
});
