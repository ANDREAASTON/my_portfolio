// admin.auth.js - include on admin.html
document.addEventListener("DOMContentLoaded", async () => {
    // Check if user is logged in
    const { data: { session } } = await supabaseClient.auth.getSession();

    if (!session) {
        // Not logged in → redirect to login
        window.location.href = "loginpage.html";
    } else {
        console.log("✅ Admin authenticated:", session.user.email);
    }

    // Optional: listen for auth changes (logout, session expired)
    supabaseClient.auth.onAuthStateChange((_event, _session) => {
        if (!_session) window.location.href = "loginpage.html";
    });
});
